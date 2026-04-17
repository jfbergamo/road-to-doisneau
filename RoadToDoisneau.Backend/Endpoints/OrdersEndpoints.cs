using Microsoft.AspNetCore.Http.HttpResults;
using RoadToDoisneau.Backend.Models;
using RoadToDoisneau.Backend.Services;

namespace RoadToDoisneau.Backend.Endpoints;

public static class OrdersEndpoints
{
    public static void MapOrdersEndpoints(this IEndpointRouteBuilder route, bool isDevel)
    {
        var group = route.MapGroup("/orders").WithTags("Orders");

        group.MapGet("", GetOrdersAsync)
             .WithName("GetOrders");
        group.MapGet("{id:int}", GetOrderAsync)
             .WithName("GetOrder");
        group.MapPost("", InsertOrderAsync)
             .WithName("InsertOrder");

        if (isDevel)
        {
            group.MapPut("{id:int}", UpdateOrderAsync)
                 .WithName("UpdateOrder");
            group.MapDelete("{id:int}", DeleteOrderAsync)
                 .WithName("DeleteOrder");
        }
    }

    private static async Task<Ok<IEnumerable<Order>>> GetOrdersAsync(IOrdersService srvc)
    {
        return TypedResults.Ok(await srvc.GetListAsync());
    }

    private static async Task<Results<Ok<Order>,NotFound>> GetOrderAsync(int id, IOrdersService srvc)
    {
        var order = await srvc.GetByIdAsync(id);
        if (order is not null) return TypedResults.Ok(order);
        return TypedResults.NotFound();
    }

    private static async Task<Created<Order>> InsertOrderAsync(Order order, IOrdersService srvc)
    {
        await srvc.InsertAsync(order);
        return TypedResults.Created($"/orders/{order.Id}", order);
    }

    private static async Task<Results<NoContent, NotFound>> UpdateOrderAsync(int id, Order order, IOrdersService srvc)
    {
        order.Id = id;
        if (await srvc.UpdateAsync(order)) return TypedResults.NoContent();
        return TypedResults.NotFound();
    }

    private static async Task<Results<NoContent, NotFound>> DeleteOrderAsync(int id, IOrdersService srvc)
    {
        if (await srvc.DeleteAsync(id)) return TypedResults.NoContent();
        return TypedResults.NotFound();
    }
}
