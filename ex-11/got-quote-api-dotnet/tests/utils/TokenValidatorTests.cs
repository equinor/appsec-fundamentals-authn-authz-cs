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
    private readonly string _validScopes = "Quote.Read";
    private readonly string _validAudience = "IAM_AUDIENCE";
    private readonly string _validIssuer = "IAM_ISSUER";


    [Fact]
    public void IsValidToken_WithValidToken_ReturnsTrue()
    {
        // Arrange
        var jwtTokenDescriptor = CreateJwtTokenDescriptor(_validScopes, true, _validAudience, _validIssuer);
        var jwt = new JwtSecurityTokenHandler().CreateJwtSecurityToken(jwtTokenDescriptor);
        TokenValidationParameters validTokenValidationParams = new()
        {
            ValidAudience = _validAudience,
            ValidIssuer = _validIssuer,
            IssuerSigningKeys = [jwtTokenDescriptor.SigningCredentials.Key]
        };
        var mockLogger = new Mock<ILogger<TokenValidator>>();
        var mockConfiguration = new Mock<IConfiguration>();
        var tokenValidator = new TokenValidator(mockConfiguration.Object, mockLogger.Object);

        // Act
        var result = tokenValidator.IsValidToken(jwt.RawData, validTokenValidationParams);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsValidToken_WithInValidToken_ReturnsFalse()
    {
        // Arrange
        var jwtTokenDescriptor = CreateJwtTokenDescriptor(_validScopes, true, "IAM_NOT_RIGHT_AUDIENCE", _validIssuer);
        var jwt = new JwtSecurityTokenHandler().CreateJwtSecurityToken(jwtTokenDescriptor);
        TokenValidationParameters validTokenValidationParams = new()
        {
            ValidAudience = _validAudience,
            ValidIssuer = _validIssuer,
            IssuerSigningKeys = [jwtTokenDescriptor.SigningCredentials.Key]
        };
        var mockLogger = new Mock<ILogger<TokenValidator>>();
        var mockConfiguration = new Mock<IConfiguration>();
        var tokenValidator = new TokenValidator(mockConfiguration.Object, mockLogger.Object);

        // Act
        var result = tokenValidator.IsValidToken(jwt.RawData, validTokenValidationParams);

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