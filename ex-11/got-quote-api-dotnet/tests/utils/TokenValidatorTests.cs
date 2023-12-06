using Microsoft.Extensions.Configuration;
using GotQuotes.Utils;
using Moq;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;

namespace GotQuotes.Tests.Utils;

public class TokenValidatorTests
{
    [Fact]
    public void IsValidToken_WithValidToken_ReturnsTrue()
    {
        var validScopes = "Quote.Read";
        var validAudience = "IAM_AUDIENCE";
        var validIssuer = "IAM_ISSUER";
        var jwtTokenDescriptor = CreateJwtTokenDescriptor(validScopes, true, validAudience, validIssuer);
        var jwt = new JwtSecurityTokenHandler().CreateJwtSecurityToken(jwtTokenDescriptor);
        TokenValidationParameters validationParameters = new()
        {
            ValidAudience = validAudience,
            ValidIssuer = validIssuer,
            IssuerSigningKeys = [jwtTokenDescriptor.SigningCredentials.Key]
        };

        var config = new ConfigurationBuilder().AddInMemoryCollection().Build();

        var mockLogger = new Mock<ILogger<TokenValidator>>();
        var mockConfiguration = new Mock<IConfiguration>();
        var tokenValidator = new TokenValidator(mockConfiguration.Object, mockLogger.Object);

        // Act
        var result = tokenValidator.IsValidToken(jwt.RawData, validationParameters);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsValidToken_WithInValidToken_ReturnsFalse()
    {
        var validScopes = "Quote.Read";
        var validAudience = "IAM_AUDIENCE";
        var validIssuer = "IAM_ISSUER";
        var jwtTokenDescriptor = CreateJwtTokenDescriptor(validScopes, true, validAudience, validIssuer);
        var jwt = new JwtSecurityTokenHandler().CreateJwtSecurityToken(jwtTokenDescriptor);
        TokenValidationParameters validationParameters = new()
        {
            ValidAudience = "IAM_NOT_RIGHT_AUDIENCE",
            ValidIssuer = validIssuer,
            IssuerSigningKeys = [jwtTokenDescriptor.SigningCredentials.Key]
        };

        var config = new ConfigurationBuilder().AddInMemoryCollection().Build();

        var mockLogger = new Mock<ILogger<TokenValidator>>();
        var mockConfiguration = new Mock<IConfiguration>();
        var tokenValidator = new TokenValidator(mockConfiguration.Object, mockLogger.Object);

        // Act
        var result = tokenValidator.IsValidToken(jwt.RawData, validationParameters);

        // Assert
        Assert.False(result);
    }

    private static SecurityTokenDescriptor CreateJwtTokenDescriptor(string scopes, bool signed, string aud, string iss)
    {
        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Expires = DateTime.UtcNow.AddSeconds(60),
            Audience = aud,
            Issuer = iss,
            Claims = new Dictionary<string, object>() {
                { "scp", scopes},
            }
        };
        if (signed)
        {
            byte[] secret = new byte[64];
            RandomNumberGenerator.Create().GetBytes(secret);
            tokenDescriptor.SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(secret),
                SecurityAlgorithms.HmacSha256Signature,
                SecurityAlgorithms.Sha512Digest
            );
        };
        return tokenDescriptor;
        
    }    
}