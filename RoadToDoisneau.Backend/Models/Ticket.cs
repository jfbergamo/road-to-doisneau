namespace RoadToDoisneau.Backend.Models;

//CREATE TABLE tickets(
//    ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//    holder_first_name VARCHAR(75) NOT NULL,
//    holder_last_name VARCHAR(75) NOT NULL,
//    holder_mail VARCHAR(100) NOT NULL,
//    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//    expires_at TIMESTAMP DEFAULT(CURRENT_TIMESTAMP + INTERVAL '6 months'),
//    has_booklet BOOL NOT NULL DEFAULT False,
//    fk_price_id INT NOT NULL REFERENCES prices(price_id),
//    fk_order_id INT NOT NULL REFERENCES orders(order_id)
//);

public class Ticket
{
    public Guid Id { get; set; }
    public string HolderName { get; set => field = value.Substring(0, Math.Min(75, value.Length)); } = default!;
    public string HolderEmail { get; set => field = value.Substring(0, Math.Min(100, value.Length)); } = default!;
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool HasBooklet { get; set; }
    public int PriceId { get; set; }
    public int OrderId { get; set; }

    public decimal Price { get; set; }
}
