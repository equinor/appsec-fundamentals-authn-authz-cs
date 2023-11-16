using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace GotQuotes.Middleware;

public class JwtMiddleware(RequestDelegate next, IConfiguration configuration)
{
    private readonly RequestDelegate _next = next;
    private readonly IConfiguration _configuration = configuration;
    private readonly TokenValidationParameters _tokenValidationParameters = (configuration.GetSection("AzureAd:Jwt:TokenValidationParameters")?.Get<TokenValidationParameters>()) ?? throw new Exception("Unable to retrieve TokenValidationParameters from appsettings.json");

    public async Task InvokeAsync(HttpContext context)
    {
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
        if (authHeader == null) {
                context.Response.StatusCode = 401;
                return;
        } else {
            var token = authHeader["Bearer ".Length..].Trim();

            // Validate the token
            if (!await IsValidToken(token))
            {
                context.Response.StatusCode = 401; // Unauthorized
                return;
            }
        }

        await _next(context);
    }

    private async Task<bool> IsValidToken(string token)
    {
        var authority = _configuration["AzureAd:Jwt:Authority"];
        var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>($"{authority}.well-known/openid-configuration", new OpenIdConnectConfigurationRetriever());
        var openIdConfig = await configurationManager.GetConfigurationAsync(CancellationToken.None);

        if (openIdConfig.SigningKeys == null || !openIdConfig.SigningKeys.Any()) {
            throw new Exception("Unable to retrieve signing keys from OpenID configuration.");
        }
        // Valid SigningKeys from .well-known/openid-configuration
        _tokenValidationParameters.IssuerSigningKeys = openIdConfig.SigningKeys;

        //var jwtToken = new JwtSecurityToken(token);
        var tokenHandler = new JwtSecurityTokenHandler();

        // Verify token based on validationParameters (see also appsettings.json)
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

