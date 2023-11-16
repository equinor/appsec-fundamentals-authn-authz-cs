using Microsoft.AspNetCore.Mvc;
using GotQuotes.Data;
using GotQuotes.Models;

namespace GotQuotes.Controllers;
public static class QuoteController
{
    [Produces(typeof(Quote))]
    public static IResult GetRandomQuote()
    {
        var random = new Random();
        int index = random.Next(QuoteData.demoQuotes.Count);
        return TypedResults.Ok(QuoteData.demoQuotes[index]);
    }

    [Produces(typeof(string))]
    public static IResult GetPublicPage()
    {
        string welcomeMsg = "Welcome, now visit /swagger";
        return TypedResults.Ok(welcomeMsg);
    }

}
