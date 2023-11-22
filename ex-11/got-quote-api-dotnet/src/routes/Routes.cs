using GotQuotes.Controllers;
using GotQuotes.Middleware;

namespace GotQuotes.Routes;

public static class Routes
{
    public static void ConfigureApi(this WebApplication app)
    {
        app.UseMiddleware<JwtMiddleware>();

        app.MapGet("/", QuoteController.GetPublicPage);
        app.MapGet("/api/quote", QuoteController.GetRandomQuote);
    }
}

