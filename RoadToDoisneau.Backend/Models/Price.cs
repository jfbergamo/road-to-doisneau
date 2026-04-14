namespace RoadToDoisneau.Backend.Models;


// CREATE TABLE prices (
//  price_id SERIAL PRIMARY KEY,
//  category VARCHAR(50) NOT NULL,
//  price DECIMAL(10, 2) NOT NULL
// );
public class Price
{
    public int Id { get; set; }
    public string Category { get => field; set => field = value.Substring(0, Math.Min(50, value.Length)); } = default!;
    public decimal PriceValue { get; set; }
}
