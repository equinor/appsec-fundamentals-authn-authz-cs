using Microsoft.AspNetCore.Mvc;

public static class QuoteController
{
    [Produces(typeof(Quote))]
    public static IResult GetRandomQuote()
    {
        var random = new Random();
        int index = random.Next(GotQuotes.demoQuotes.Count);
        return TypedResults.Ok(GotQuotes.demoQuotes[index]);
    }

    [Produces(typeof(string))]
    public static IResult GetPublicPage()
    {
        string welcomeMsg = "Welcome, now visit /swagger";
        return TypedResults.Ok(welcomeMsg);
    }

}
