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
                _logger.LogError("Issuer is invalid");
                throw new SecurityTokenInvalidIssuerException("Issuer is invalid");
            };

            // Check audience
            if (jwtToken.Audiences.All(a => a != validationParameters.ValidAudience)) {
                _logger.LogError("Audience is invalid");
                throw new SecurityTokenInvalidAudienceException("Audience is invalid");
            };

            // Check signature and validate
            var signingKey = validationParameters.IssuerSigningKeys.FirstOrDefault();
            if (signingKey == null) {
                _logger.LogError("Signing key is invalid");
                throw new SecurityTokenInvalidSigningKeyException("Signing key is invalid");
            };
            var validationParametersWithSigningKey = new TokenValidationParameters
            {
                IssuerSigningKey = signingKey,
                ValidateIssuerSigningKey = true,
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateLifetime = false
            };
            _ = tokenHandler.ValidateToken(token, validationParametersWithSigningKey, out _);

            // Check valid timeframe
            if (jwtToken.ValidFrom > DateTime.UtcNow || jwtToken.ValidTo < DateTime.UtcNow) {
                _logger.LogError("Token is not valid in timeframe");
                throw new SecurityTokenInvalidLifetimeException("Token is not valid in timeframe");
            };

            // Check scope
            if (jwtToken.Claims.All(c => c.Type != "scp" || !c.Value.Split(' ').Any(s => s == "Quote.Read"))) {
                _logger.LogError("Token does not contain correct scope");
                throw new SecurityTokenInvalidLifetimeException("Token does not contain correct scope");
            };

            // All checks passed
            return true;
        }
        catch
        {
            return false;
        }
    }
}