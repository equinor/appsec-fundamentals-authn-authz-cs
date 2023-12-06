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
    public async Task IsValidToken_ProvideInvalidToken_ReturnsFalse()
    {
        var validRoles = new string[] { "IAM_ROLE" };
        var validAudience = "IAM_AUDIENCE";
        var validIssuer = "IAM_ISSUER";
        var jwtTokenDescriptor = CreateJwtTokenDescriptor(validRoles, true, validAudience, validIssuer);
        var jwt = new JwtSecurityTokenHandler().CreateJwtSecurityToken(jwtTokenDescriptor);
        TokenValidationParameters validationParameters = new()
        {
            ValidAudience = validAudience,
            ValidIssuer = validIssuer,
            IssuerSigningKey = jwtTokenDescriptor.SigningCredentials.Key
        };

        var config = new ConfigurationBuilder().AddInMemoryCollection().Build();
        config["AzureAd:Jwt:TokenValidationParameters:ValidIssuer"] = validIssuer;
        config["AzureAd:Jwt:TokenValidationParameters:ValidAudience"] = validAudience;

        var mockLogger = new Mock<ILogger<TokenValidator>>();
        var mockConfiguration = new Mock<IConfiguration>();
        var tokenValidator = new TokenValidator(mockConfiguration.Object, mockLogger.Object);

        // Act
        var result = tokenValidator.IsValidToken(jwt.RawData, validationParameters);

        // Assert
        Assert.False(result);
    }
    private static SecurityTokenDescriptor CreateJwtTokenDescriptor(string[] appRoles, bool signed, string aud, string iss)
    {
        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Expires = DateTime.UtcNow.AddSeconds(60),
            Claims = new Dictionary<string, object>() {
                { "roles", new List<string>(appRoles) },
                { "aud", aud },
                { "iss", iss }
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