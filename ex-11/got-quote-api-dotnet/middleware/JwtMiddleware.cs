using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

public class JwtMiddleware(RequestDelegate next, IConfiguration configuration)
{
    private readonly RequestDelegate _next = next;
    private readonly IConfiguration _configuration = configuration;
    private readonly TokenValidationParameters _tokenValidationParameters = configuration.GetSection("AzureAd:Jwt:TokenValidationParameters").Get<TokenValidationParameters>();

    public async Task InvokeAsync(HttpContext context)
    {
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
        if (authHeader == null) {
                context.Response.StatusCode = 401;
                return;
        } else
        {
            var token = authHeader["Bearer ".Length..].Trim();

            // Validate the token
            if (!await IsValidToken(token, _tokenValidationParameters))
            {
                context.Response.StatusCode = 401; // Unauthorized
                return;
            }
        }

        await _next(context);
    }

    private async Task<bool> IsValidToken(string token, TokenValidationParameters validationParameters)
    {
        var authority = _configuration["AzureAd:Jwt:Authority"];
        var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>($"{authority}.well-known/openid-configuration", new OpenIdConnectConfigurationRetriever());
        var openIdConfig = await configurationManager.GetConfigurationAsync(CancellationToken.None);

        // Valid SigningKeys from .well-known/openid-configuration
        validationParameters.IssuerSigningKeys = openIdConfig.SigningKeys;

        var jwtToken = new JwtSecurityToken(token);
        var tokenHandler = new JwtSecurityTokenHandler();

        // Verify token based on validationParameters (see appsettings.json)
        try
        {
            tokenHandler.ValidateToken(token, validationParameters, out _);
            return true;
        }
        catch (Exception e)
        {
            return false;
        }
    }
}

