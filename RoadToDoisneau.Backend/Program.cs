using RoadToDoisneau.Backend.Endpoints;
using RoadToDoisneau.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.AllowTrailingCommas = true;
});

builder.Services.AddScoped<IArticlesService, ArticlesService>();
builder.Services.AddScoped<IOrdersService, OrdersService>();
builder.Services.AddScoped<IPhotosService, PhotosService>();
builder.Services.AddScoped<ITicketsService, TicketsService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "cors",
                      policy =>
                      {
                          policy.WithOrigins("*");
                          policy.WithMethods("GET", "POST");
                          policy.WithHeaders("Content-Type");
                      });
});

var app = builder.Build();

var isDevel = app.Environment.IsDevelopment();

if (isDevel)
{
    app.MapOpenApi();
    app.UseSwaggerUI(opt =>
    {
        opt.SwaggerEndpoint("/openapi/v1.json", "RoadToDoisneau API v1");
    });

    app.UseHttpsRedirection();
}

app.UseCors("cors");

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapModelsEndpoints(isDevel);

app.MapGet("/api/status", () => new { Status = "Running" });
app.MapGet("/api/admin", () => "flag{U_r_n0W_aN_4dm1n}");

app.Run();