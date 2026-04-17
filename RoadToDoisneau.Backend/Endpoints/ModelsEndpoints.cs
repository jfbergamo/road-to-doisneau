namespace RoadToDoisneau.Backend.Endpoints;

public static class ModelsEndpoints
{
    public static void MapModelsEndpoints(this IEndpointRouteBuilder route, bool isDevel)
    {
        route.MapArticlesEndpoints(isDevel);
        route.MapOrdersEndpoints(isDevel);
        route.MapPhotosEndpoints(isDevel);
        route.MapTicketsEndpoints(isDevel);
    }
}
