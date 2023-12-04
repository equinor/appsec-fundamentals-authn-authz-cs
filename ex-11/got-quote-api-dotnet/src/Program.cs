using GotQuotes.Routes;
using GotQuotes.Utils;

var builder = WebApplication.CreateBuilder(args);

// Prefer environment variables over appsettings.json
var TENANT_ID = Environment.GetEnvironmentVariable("TENANT_ID");
var QUOTES_API_URI = Environment.GetEnvironmentVariable("QUOTES_API_URI");

if (string.IsNullOrEmpty(TENANT_ID) || string.IsNullOrEmpty(QUOTES_API_URI)) {
    throw new Exception("TENANT_ID and QUOTES_API_URI must be set");
} else {
    builder.Configuration["AzureAd:Jwt:Authority"] = $"https://login.microsoftonline.com/{TENANT_ID}/v2.0/";
    builder.Configuration["AzureAd:Jwt:TokenValidationParameters:ValidIssuer"] = $"https://sts.windows.net/{TENANT_ID}/";
    builder.Configuration["AzureAd:Jwt:TokenValidationParameters:ValidAudience"] = $"api://{QUOTES_API_URI}";
} 

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<ITokenValidator, TokenValidator>();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.ConfigureApi();
app.Run();

