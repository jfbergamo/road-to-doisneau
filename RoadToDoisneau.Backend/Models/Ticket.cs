namespace RoadToDoisneau.Backend.Models;

//CREATE TABLE tickets(
//    ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//    holder_name VARCHAR(75) NOT NULL,
//    holder_email VARCHAR(100) NOT NULL,
//    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//    expires_at TIMESTAMP DEFAULT(CURRENT_TIMESTAMP + INTERVAL '6 months'),
//    has_booklet BOOL NOT NULL DEFAULT False,
//    price DECIMAL NOT NULL,
//    discount_code CHAR(4),
//    fk_order_id INT NOT NULL REFERENCES orders(order_id)
//);

public class Ticket
{
    private static decimal BOOKLET_PRICE = 0;

    public Guid Id { get; set; }
    public string HolderName { get; set => field = value.Substring(0, Math.Min(75, value.Length)); } = default!;
    public string HolderEmail { get; set => field = value.Substring(0, Math.Min(100, value.Length)); } = default!;
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool HasBooklet { get; set; }
    public decimal Price { get; set; }
    public string? DiscountCode { get; set => field = value?.Substring(0, Math.Min(4, value.Length)); }
    public int OrderId { get; set; }

    public void ApplyDiscount()
    {
        switch (DiscountCode)
        {
            case "FREE": Price =  0.00M; break;
            case "STUD": Price =  5.00M; break;
            case "OVER": Price =  9.00M; break;
            case "FULL":
            default:     Price = 12.00M; break;
        }
        if (HasBooklet) Price += BOOKLET_PRICE;
    }
}
