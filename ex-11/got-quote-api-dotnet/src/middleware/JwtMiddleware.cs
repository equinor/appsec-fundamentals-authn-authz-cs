using GotQuotes.Utils;

namespace GotQuotes.Middleware;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<JwtMiddleware> _logger;
    private readonly ITokenValidator _tokenValidator;

    public JwtMiddleware(RequestDelegate next, ITokenValidator tokenValidator, ILogger<JwtMiddleware> logger)
    {
        _next = next;
        _logger = logger;
        _tokenValidator = tokenValidator;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Protect the /api routes with JWT
        if (context.Request.Path.StartsWithSegments("/api")) {
            var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
            if (authHeader == null) {
                    context.Response.StatusCode = 401;
                    _logger.LogWarning("Missing Authorization header");
                    return;
            } else {
                var token = authHeader["Bearer ".Length..].Trim();

                // Validate the token before proceeding (next)
                if (!await _tokenValidator.IsValidToken(token))
                {
                    context.Response.StatusCode = 401; // Unauthorized
                    _logger.LogWarning("Invalid token");
                    return;
                }
            }
        }
        await _next(context);
    }
}
