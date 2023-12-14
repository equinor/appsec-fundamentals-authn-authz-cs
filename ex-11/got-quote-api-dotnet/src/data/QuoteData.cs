namespace GotQuotes.Data;
using GotQuotes.Models;

public static class QuoteData
{
    private static readonly List<Quote> defaultQuotes =
    [
        new() {Title = "... a mind needs books as a sword needs a whetstone, if it is to keep its edge." },
        new() {Title = "Fear cuts deeper than swords." },
        new() {Title = "Some old wounds never truly heal, and bleed again at the slightest word." },
        new() {Title = "Winter is Coming" },
        new() {Title = "When you play a game of thrones you win or you die." },
        new() {Title = "The things we love destroy us every time, lad. Remember that." },
        new() {Title = "If I look back I am lost." },
        new() {Title = "Death is so terribly final, while life is full of possibilities." },
        new() {Title = "Nothing burns like the cold." },
        new() {Title = "Different roads sometimes lead to the same castle." },
        new() {Title = "A bruise is a lesson... and each lesson makes us better." },
        new() {Title = "The man who fears losing has already lost." },
        new() {Title = "The things I do for love." },
    ];

    public static List<Quote> Quotes { get; private set; } = defaultQuotes;

    public static void InitializeQuotes(List<Quote> assignedQuotes)
    {
        Quotes = assignedQuotes ?? defaultQuotes;
    }    

}
