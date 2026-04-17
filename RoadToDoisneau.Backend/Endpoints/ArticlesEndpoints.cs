using Microsoft.AspNetCore.Http.HttpResults;
using RoadToDoisneau.Backend.Models;
using RoadToDoisneau.Backend.Services;

namespace RoadToDoisneau.Backend.Endpoints;

public static class ArticlesEndpoints
{
    public static void MapArticlesEndpoints(this IEndpointRouteBuilder app, bool isDevel)
    {
        var group = app.MapGroup("/articles").WithTags("Articles");

        group.MapGet("", GetArticlesAsync)
             .WithName("GetArticles");
        group.MapGet("{id:int}", GetArticleAsync)
             .WithName("GetArticle");

        if (isDevel)
        {
            group.MapPost("", InsertArticleAsync)
                 .WithName("InsertArticle");
            group.MapPut("{id:int}", UpdateArticleAsync)
                 .WithName("UpdateArticle");
            group.MapDelete("{id:int}", DeleteArticleAsync)
                 .WithName("DeleteArticle");
        }
    }

    private static async Task<Ok<IEnumerable<Article>>> GetArticlesAsync(IArticlesService srvc)
    {
        return TypedResults.Ok(await srvc.GetListAsync());
    }

    private static async Task<Results<Ok<Article>, NotFound>> GetArticleAsync(int id, IArticlesService srvc)
    {
        var article = await srvc.GetByIdAsync(id);
        if (article is not null) return TypedResults.Ok(article);
        return TypedResults.NotFound();
    }

    private static async Task<Created<Article>> InsertArticleAsync(Article article, IArticlesService srvc)
    {
        await srvc.InsertAsync(article);
        return TypedResults.Created($"/articles/{article.Id}", article);
    }

    private static async Task<Results<NoContent, NotFound>> UpdateArticleAsync(int id, Article article, IArticlesService srvc)
    {
        article.Id = id;
        if (await srvc.UpdateAsync(article)) return TypedResults.NoContent();
        return TypedResults.NotFound();
    }

    private static async Task<Results<NoContent, NotFound>> DeleteArticleAsync(int id, IArticlesService srvc)
    {
        if (await srvc.DeleteAsync(id)) return TypedResults.NoContent();
        return TypedResults.NotFound();
    }
}
