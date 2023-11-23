using Xunit;
using GotQuotes.Data;
using GotQuotes.Models;

namespace GotQuotes.Tests;

public class QuoteDataTests
{
    [Fact]
    public void InitializeQuotes_WithNonNullList_SetsQuotes()
    {
        var mockQuotes = new List<Quote> 
        { 
            new() { Id = "Quote:", Title = "Test Quote 1" }, 
            new() { Id = "Quote:", Title = "Test Quote 2" } 
        };
        QuoteData.InitializeQuotes(mockQuotes);
        Assert.Equal(mockQuotes, QuoteData.Quotes);
    }

    [Fact]
    public void InitializeQuotes_Missing_UsesDefaultQuotes()
    {
        Assert.True(QuoteData.Quotes.Count == 13);
    }
}