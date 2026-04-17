using Microsoft.AspNetCore.Http.HttpResults;
using RoadToDoisneau.Backend.Models;
using RoadToDoisneau.Backend.Services;

namespace RoadToDoisneau.Backend.Endpoints;

public static class PhotosEndpoints
{
    public static void MapPhotosEndpoints(this IEndpointRouteBuilder route, bool isDevel)
    {
        var group = route.MapGroup("/api/photos").WithTags("Photos");

        group.MapGet("", GetPhotosAsync)
             .WithName("GetPhotos");
        group.MapGet("{id:int}", GetPhotoAsync)
             .WithName("GetPhoto");
        if (isDevel)
        {
            group.MapPost("", InsertPhotoAsync)
             .WithName("InsertPhoto");
            group.MapPut("{id:int}", UpdatePhotoAsync)
             .WithName("UpdatePhoto");
            group.MapDelete("{id:int}", DeletePhotoAsync)
             .WithName("DeletePhoto");
        }
    }

    private static async Task<Ok<IEnumerable<Photo>>> GetPhotosAsync(IPhotosService srvc)
    {
        return TypedResults.Ok(await srvc.GetListAsync());
    }

    private static async Task<Results<Ok<Photo>,NotFound>> GetPhotoAsync(int id, IPhotosService srvc)
    {
        var photo = await srvc.GetByIdAsync(id);
        if (photo is null) return TypedResults.NotFound();
        return TypedResults.Ok(photo);
    }

    private static async Task<Created<Photo>> InsertPhotoAsync(Photo photo, IPhotosService srvc)
    {
        await srvc.InsertAsync(photo);
        return TypedResults.Created($"/api/photos/{photo.Id}", photo);
    }

    private static async Task<Results<NoContent,NotFound>> UpdatePhotoAsync(int id, Photo photo, IPhotosService srvc)
    {
        photo.Id = id;
        if (await srvc.UpdateAsync(photo)) return TypedResults.NoContent();
        return TypedResults.NotFound();
    }

    private static async Task<Results<NoContent,NotFound>> DeletePhotoAsync(int id, IPhotosService srvc)
    {
        if (await srvc.DeleteAsync(id)) return TypedResults.NoContent();
        return TypedResults.NotFound();
    }
}
