namespace RoadToDoisneau.Backend.Models;

//CREATE TABLE orders(
//    order_id SERIAL PRIMARY KEY,
//    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//);

public class Order
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
}
