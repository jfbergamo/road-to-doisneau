namespace RoadToDoisneau.Backend.Endpoints;

public static class ArticlesEndpoints
{
    public static void MapArticlesEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/articles").WithTags("Articles");

        group.MapGet("", GetArticlesAsync)
             .WithName("GetArticles");
    }

    private static async Task<Typed>
}
