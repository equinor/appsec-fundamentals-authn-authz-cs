using GotQuotes.Data;
using GotQuotes.Models;
using GotQuotes.Controllers;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GotQuotes.Tests.Controllers;

public class QuoteControllerTests
{
    [Fact]
    public void GetRandomQuote_ReturnsQuoteFromList()
    {
        var result = QuoteController.GetRandomQuote();
        
        var okQuote = Assert.IsType<Ok<Quote>>(result);
        Assert.Contains(okQuote?.Value, QuoteData.Quotes);
    }

    [Fact]
    public void GetPublicPage_ReturnsWelcomeMessage()
    {
        var result = QuoteController.GetPublicPage();

        var okResult = Assert.IsType<Ok<string>>(result);
        Assert.Equal("Welcome, now visit /swagger", okResult?.Value);
    }
}