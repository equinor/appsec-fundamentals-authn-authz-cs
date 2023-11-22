using GotQuotes.Routes;
using GotQuotes.Utils;

var builder = WebApplication.CreateBuilder(args);

// https://aka.ms/aspnetcore/swashbuckle
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

