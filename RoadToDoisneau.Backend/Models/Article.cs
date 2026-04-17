namespace RoadToDoisneau.Backend.Models;

//CREATE TABLE articles(
//  article_id SERIAL PRIMARY KEY,
//  title VARCHAR(150) NOT NULL,
//  description TEXT NOT NULL DEFAULT '',
//	page VARCHAR(255) NOT NULL,
//  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//	author VARCHAR(100),
//	thumbnail VARCHAR(255) NOT NULL
//);

public class Article
{
    public int Id { get; set; }
    public string Title { get; set => field = value.Substring(0, Math.Min(150, value.Length)); } = default!;
    public string Description { get; set; } = default!;
    public string Page { get; set => field = value.Substring(0, Math.Min(255, value.Length)); } = default!;
    public DateTime Date { get; set; }
    public string Author { get; set => field = value.Substring(0, Math.Min(100, value.Length)); } = default!;
    public string Thumbnail { get; set; } = default!;
}
