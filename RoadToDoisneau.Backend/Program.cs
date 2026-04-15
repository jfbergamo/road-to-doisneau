using RoadToDoisneau.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddScoped<IArticlesService, ArticlesService>();
builder.Services.AddScoped<IOrdersService, OrdersService>();
builder.Services.AddScoped<IPhotosService, PhotosService>();
builder.Services.AddScoped<IPricesService, PricesService>();
builder.Services.AddScoped<ITicketsService, TicketsService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(opt =>
    {
        opt.SwaggerEndpoint("/openapi/v1/openapi.json", "RoadToDoisneau API v1");
    });
}

app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/status", () => new { Status = "Running" });

app.Run();