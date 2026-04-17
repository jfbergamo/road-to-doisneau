using Microsoft.AspNetCore.Http.HttpResults;
using RoadToDoisneau.Backend.Models;
using RoadToDoisneau.Backend.Services;

namespace RoadToDoisneau.Backend.Endpoints;

public static class PricesEndpoints
{
    public static void MapPricesEndpoints(this IEndpointRouteBuilder route, bool isDevel)
    {
        var group = route.MapGroup("/prices").WithTags("Prices");

        group.MapGet("", GetPricesAsync)
             .WithName("GetPrices");
        group.MapGet("{id:int}", GetPriceAsync)
             .WithName("GetPrice");

        if (isDevel)
        {
            group.MapPost("", InsertPriceAsync)
                 .WithName("InsertPrice");
            group.MapPut("{id:int}", UpdatePriceAsync)
                 .WithName("UpdatePrice");
            group.MapDelete("{id:int}", DeletePriceAsync)
                 .WithName("DeletePrice");
        }
    }

    private static async Task<Ok<IEnumerable<Price>>> GetPricesAsync(IPricesService srvc)
    {
        return TypedResults.Ok(await srvc.GetListAsync());
    }

    private static async Task<Results<Ok<Price>,NotFound>> GetPriceAsync(int id, IPricesService srvc)
    {
        var price = await srvc.GetByIdAsync(id);
        if (price is null) return TypedResults.NotFound();
        return TypedResults.Ok(price);
    }

    private static async Task<Created<Price>> InsertPriceAsync(Price price, IPricesService srvc)
    {
        await srvc.InsertAsync(price);
        return TypedResults.Created($"/prices/{price.Id}", price);
    }

    private static async Task<Results<NoContent,NotFound>> UpdatePriceAsync(int id, Price price, IPricesService srvc)
    {
        price.Id = id;
        if (await srvc.UpdateAsync(price)) return TypedResults.NoContent();
        return TypedResults.NotFound();
    }

    private static async Task<Results<NoContent,NotFound>> DeletePriceAsync(int id, IPricesService srvc)
    {
        if (await srvc.DeleteAsync(id)) return TypedResults.NoContent();
        return TypedResults.NotFound();
    }
}
