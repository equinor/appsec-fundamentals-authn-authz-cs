using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace GotQuotes.Utils;

public interface ITokenValidator
{
    Task<bool> IsValidToken(string token);
}

public class TokenValidator : ITokenValidator
{
    private readonly IConfiguration _configuration;
    private readonly TokenValidationParameters _tokenValidationParameters;
    private readonly ILogger<TokenValidator> _logger;

    public TokenValidator(IConfiguration configuration, ILogger<TokenValidator> logger)
    {
        _configuration = configuration;
        _tokenValidationParameters = (configuration.GetSection("AzureAd:Jwt:TokenValidationParameters")?.Get<TokenValidationParameters>()) ?? new TokenValidationParameters();
        _logger = logger;
    }

    public async Task<bool> IsValidToken(string token)
    {
        var authority = _configuration["AzureAd:Jwt:Authority"];
        var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>($"{authority}.well-known/openid-configuration", new OpenIdConnectConfigurationRetriever());
        var openIdConfig = await configurationManager.GetConfigurationAsync(CancellationToken.None);
        _tokenValidationParameters.IssuerSigningKeys = openIdConfig.SigningKeys;
        return IsValidToken(token, _tokenValidationParameters);
    }

    public bool IsValidToken(string token, TokenValidationParameters validationParameters)
    {
        var jwtToken = new JwtSecurityToken(token);
        _logger.LogWarning("Inspecting token for : {Audience}, valid from {ValidFrom} to {ValidTo}", jwtToken.Audiences.First(), jwtToken.ValidFrom, jwtToken.ValidTo);

        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            // Check issuer
            if (jwtToken.Issuer != validationParameters.ValidIssuer) {
                throw new SecurityTokenInvalidIssuerException("Issuer is invalid");
            };

            // Check audience
            if (jwtToken.Audiences.All(a => a != validationParameters.ValidAudience)) {
                throw new SecurityTokenInvalidAudienceException("Audience is invalid");
            };

            // Check signature and validate
            if (!validationParameters.IssuerSigningKeys.Any()) {
                throw new SecurityTokenInvalidSigningKeyException("No signing keys!");
            };
            var validationParametersWithSigningKey = new TokenValidationParameters
            {
                IssuerSigningKeys = validationParameters.IssuerSigningKeys,
                ValidateIssuerSigningKey = true,
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateLifetime = false
            };
            _ = tokenHandler.ValidateToken(token, validationParametersWithSigningKey, out _);

            // Check valid timeframes
            if (jwtToken.ValidFrom > DateTime.UtcNow || jwtToken.ValidTo < DateTime.UtcNow) {
                throw new SecurityTokenInvalidLifetimeException("Token is not valid in timeframe");
            };

            // Check scope
            if (jwtToken.Claims.All(c => c.Type != "scp" || !c.Value.Split(' ').Any(s => s == "Quote.Read"))) {
                throw new SecurityTokenInvalidLifetimeException("Token does not contain correct scope");
            };

            // All checks passed
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("Invalid token: {e.Message}", e.Message);
            return false;
        }
    }
}