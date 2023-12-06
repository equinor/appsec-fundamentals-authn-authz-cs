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

        if (validationParameters.IssuerSigningKeys == null || !validationParameters.IssuerSigningKeys.Any())
        {
            throw new Exception("Missing Issuer signing keys.");
        }

        var jwtToken = new JwtSecurityToken(token);
        _logger.LogWarning("Token for : {Audience}, valid from {ValidFrom} to {ValidTo}", jwtToken.Audiences.First(), jwtToken.ValidFrom, jwtToken.ValidTo);

        var tokenHandler = new JwtSecurityTokenHandler();

        try
        {
            _ = tokenHandler.ValidateToken(token, _tokenValidationParameters, out _);
            return true;
        }
        catch
        {
            return false;
        }
    }
}