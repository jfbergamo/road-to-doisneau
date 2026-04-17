using Microsoft.AspNetCore.Http.HttpResults;
using RoadToDoisneau.Backend.Models;
using RoadToDoisneau.Backend.Services;
using System.Data;
using System.Net.NetworkInformation;

namespace RoadToDoisneau.Backend.Endpoints;

public static class TicketsEndpoints
{
    public static void MapTicketsEndpoints(this IEndpointRouteBuilder route, bool isDevel)
    {
        var group = route.MapGroup("/tickets").WithTags("Tickets");

        group.MapGet("", GetTicketsAsync)
             .WithName("GetTickets");
        group.MapGet("{id:int}", GetTicketAsync)
             .WithName("GetTicket");

        if (isDevel)
        {
            group.MapPost("", InsertTicketAsync)
                 .WithName("InsertTicket");
            group.MapPut("{id:int}", UpdateTicketAsync)
                 .WithName("UpdateTicket");
            group.MapDelete("{id:int}", DeleteTicketAsync)
                 .WithName("DeleteTicket");
        }
    }

    private static async Task<Ok<IEnumerable<Ticket>>> GetTicketsAsync(ITicketsService srvc)
    {
        return TypedResults.Ok(await srvc.GetListAsync());
    }

    private static async Task<Results<Ok<Ticket>,NotFound>> GetTicketAsync(Guid id, ITicketsService srvc)
    {
        var ticket = await srvc.GetByIdAsync(id);
        if (ticket is null) return TypedResults.NotFound();
        return TypedResults.Ok(ticket);
    }

    private static async Task<Created<Ticket>> InsertTicketAsync(Ticket ticket, ITicketsService srvc)
    {
        await srvc.InsertAsync(ticket);
        return TypedResults.Created($"/tickets/{ticket.Id}", ticket);
    }

    private static async Task<Results<NoContent,NotFound>> UpdateTicketAsync(Guid id, Ticket ticket, ITicketsService srvc)
    {
        ticket.Id = id;
        if (await srvc.UpdateAsync(ticket)) return TypedResults.NoContent();
        return TypedResults.NotFound();
    }

    private static async Task<Results<NoContent,NotFound>> DeleteTicketAsync(int id, ITicketsService srvc)
    {
        if (await srvc.DeleteAsync(id)) return TypedResults.NoContent();
        return TypedResults.NotFound();
    }
}
