using Microsoft.Extensions.Configuration;
using GotQuotes.Utils;
using Moq;
using Microsoft.Extensions.Logging;

namespace GotQuotes.Tests.Utils;

public class TokenValidatorTests
{

    [Fact]
    public async Task IsValidToken_WithInvalidToken_ReturnsFalse()
    {
        
        var TENANT_ID = Environment.GetEnvironmentVariable("TENANT_ID");
        var QUOTES_API_URI = Environment.GetEnvironmentVariable("QUOTES_API_URI");

        var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").AddEnvironmentVariables().Build();

        if (string.IsNullOrEmpty(TENANT_ID) || string.IsNullOrEmpty(QUOTES_API_URI)) {
            throw new Exception("TENANT_ID and QUOTES_API_URI must be set");
        } else {    
            config["AzureAd:Jwt:Authority"] = $"https://login.microsoftonline.com/{TENANT_ID}/v2.0/";
            config["AzureAd:Jwt:TokenValidationParameters:ValidIssuer"] = $"https://sts.windows.net/{TENANT_ID}/";
            config["AzureAd:Jwt:TokenValidationParameters:ValidAudience"] = $"api://{QUOTES_API_URI}";        
        }

        var mockLogger = new Mock<ILogger<TokenValidator>>();
        var tokenValidator = new TokenValidator(config, mockLogger.Object);
        var invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJhdWQiOiJVbml0VGVzdCJ9.1NjVHdIqik-lFoY-bgXRUyDTFcuVRvkr0pcU5JEy1Ys";

        // Act
        var result = await tokenValidator.IsValidToken(invalidToken);

        // Assert
        Assert.False(result);
    }
}