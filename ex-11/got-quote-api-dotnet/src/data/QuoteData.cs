namespace GotQuotes.Data;
using GotQuotes.Models;

public static class QuoteData
{
    private static readonly List<Quote> defaultQuotes = new List<Quote>
    {
        new() {Id = "Quote:", Title = "... a mind needs books as a sword needs a whetstone, if it is to keep its edge." },
        new() {Id = "Quote:", Title = "Fear cuts deeper than swords." },
        new() {Id = "Quote:", Title = "Some old wounds never truly heal, and bleed again at the slightest word." },
        new() {Id = "Quote:", Title = "Winter is Coming" },
        new() {Id = "Quote:", Title = "When you play a game of thrones you win or you die." },
        new() {Id = "Quote:", Title = "The things we love destroy us every time, lad. Remember that." },
        new() {Id = "Quote:", Title = "If I look back I am lost." },
        new() {Id = "Quote:", Title = "Death is so terribly final, while life is full of possibilities." },
        new() {Id = "Quote:", Title = "Nothing burns like the cold." },
        new() {Id = "Quote:", Title = "Different roads sometimes lead to the same castle." },
        new() {Id = "Quote:", Title = "A bruise is a lesson... and each lesson makes us better." },
        new() {Id = "Quote:", Title = "The man who fears losing has already lost." },
        new() {Id = "Quote:", Title = "The things I do for love." },
    };

    public static List<Quote> Quotes { get; private set; } = defaultQuotes;

    public static void InitializeQuotes(List<Quote> assignedQuotes)
    {
        Quotes = assignedQuotes ?? defaultQuotes;
    }    

}
