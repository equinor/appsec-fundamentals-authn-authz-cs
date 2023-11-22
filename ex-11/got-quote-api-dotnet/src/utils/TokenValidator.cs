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
        _tokenValidationParameters = (configuration.GetSection("AzureAd:Jwt:TokenValidationParameters")?.Get<TokenValidationParameters>()) ?? throw new Exception("Unable to retrieve TokenValidationParameters from appsettings.json");
        _logger = logger;
    }

    public async Task<bool> IsValidToken(string token)
    {
        var authority = _configuration["AzureAd:Jwt:Authority"];
        var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>($"{authority}.well-known/openid-configuration", new OpenIdConnectConfigurationRetriever());
        var openIdConfig = await configurationManager.GetConfigurationAsync(CancellationToken.None);

        if (openIdConfig.SigningKeys == null || !openIdConfig.SigningKeys.Any()) {
            throw new Exception("Unable to retrieve signing keys from OpenID configuration.");
        }
        // We will fetch valid SigningKeys from .well-known/openid-configuration
        _tokenValidationParameters.IssuerSigningKeys = openIdConfig.SigningKeys;

        var jwtToken = new JwtSecurityToken(token);
        _logger.LogWarning("Token for : {Audience}, valid from {ValidFrom} to {ValidTo}",jwtToken.Audiences.First(), jwtToken.ValidFrom, jwtToken.ValidTo);

        var tokenHandler = new JwtSecurityTokenHandler();

        // Verify token based on validationParameters (see appsettings.json)
        try
        {
            _ = tokenHandler.ValidateToken(token, _tokenValidationParameters, out _);
            return true;
        }
        catch {
            return false;
        }
    }
}