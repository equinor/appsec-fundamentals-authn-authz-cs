using Microsoft.Extensions.Configuration;
using GotQuotes.Utils;
using Moq;
using Microsoft.Extensions.Logging;


public class TokenValidatorTests
{
    [Fact(Skip = "Skipping for now")]
    public async Task IsValidToken_WithValidToken_ReturnsTrue()
    {
        // Arrange
        var mockConfiguration = new Mock<IConfiguration>();
        mockConfiguration.Setup(c => c["AzureAd:Jwt:Authority"]).Returns("valid_authority");
        var mockLogger = new Mock<ILogger<TokenValidator>>();
        var tokenValidator = new TokenValidator(mockConfiguration.Object, mockLogger.Object);
        
        var validToken = "valid_token"; // Replace with a valid token

        // Act
        var result = await tokenValidator.IsValidToken(validToken);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task IsValidToken_WithInvalidToken_ReturnsFalse()
    {
        // Arrange
        var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        var mockLogger = new Mock<ILogger<TokenValidator>>();
        var tokenValidator = new TokenValidator(config, mockLogger.Object);
        var invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJhdWQiOiJVbml0VGVzdCJ9.1NjVHdIqik-lFoY-bgXRUyDTFcuVRvkr0pcU5JEy1Ys";

        // Act
        var result = await tokenValidator.IsValidToken(invalidToken);

        // Assert
        Assert.False(result);
    }
}