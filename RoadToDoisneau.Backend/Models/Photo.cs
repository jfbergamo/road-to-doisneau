namespace RoadToDoisneau.Backend.Models;

// CREATE TABLE photos (
//     photo_id SERIAL PRIMARY KEY,
//     url VARCHAR(255) NOT NULL,
//     title VARCHAR(75) NOT NULL,
//     location VARCHAR(75),
//     description TEXT,
//     shooting_year INTEGER NOT NULL
// );
public class Photo
{
    public int Id { get; set; }
    public string Url { get; set => field = value.Substring(0, Math.Min(255, value.Length)); } = default!;
    public string Title { get; set => field = value.Substring(0, Math.Min(75, value.Length)); } = default!;
    public string? Location { get; set => field = value?.Substring(0, Math.Min(75, value.Length)); }
    public string? Description { get; set; }
    public int ShootingYear { get; set; }
}
