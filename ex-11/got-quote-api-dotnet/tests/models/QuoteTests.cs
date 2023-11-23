using GotQuotes.Models;
using Xunit;

namespace GotQuotes.Tests
{
    public class QuoteTests
    {
        private readonly Quote _quote;

        public QuoteTests()
        {
            _quote = new Quote { Id = "Quote:", Title = "Default Title" };
        }

        [Fact]
        public void TestTitleProperty()
        {
            // Arrange
            var title = "Test Title";

            // Act
            _quote.Title = title;

            // Assert
            Assert.Equal(title, _quote.Title);
        }

        [Fact]
        public void TestTitleIsNotNullOrEmpty()
        {
            // Arrange
            var title = "Test Title";

            // Act
            _quote.Title = title;

            // Assert
            Assert.False(string.IsNullOrEmpty(_quote.Title));
        }
    }
}