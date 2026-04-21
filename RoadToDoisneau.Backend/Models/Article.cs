namespace RoadToDoisneau.Backend.Models;

// CREATE TABLE articles (
// 	article_id SERIAL PRIMARY KEY,
// 	title VARCHAR(150) NOT NULL,
// 	description TEXT NOT NULL DEFAULT '',
//  category VARCHAR(20) NOT NULL,
//  quote TEXT,
//  special BOOL DEFAULT FALSE,
// 	page VARCHAR(255) NOT NULL,
// 	thumbnail VARCHAR(255) NOT NULL
// );

public class Article
{
    public int Id { get; set; }
    public string Title { get; set => field = value.Substring(0, Math.Min(150, value.Length)); } = default!;
    public string Description { get; set; } = default!;
    public string Category { get; set => field = value.Substring(0, Math.Min(20, value.Length)); } = default!;
    public string? Quote { get; set; }
    public bool Special { get; set; }
    public string Page { get; set => field = value.Substring(0, Math.Min(255, value.Length)); } = default!;
    public string Thumbnail { get; set; } = default!;
}
