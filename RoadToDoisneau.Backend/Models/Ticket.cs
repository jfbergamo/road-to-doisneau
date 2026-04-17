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
    private const decimal DEFAULT_PRICE = 12;

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
        decimal discount = 0;
        switch (DiscountCode)
        {
            case "FREE": discount = 1.00M; /* Sconto: 100% => €0    */ break;
            case "STUD": discount = 0.60M; /* Sconto:  60% => €4.80 */ break;
            case "OVER": discount = 0.25M; /* Sconto:  25% => €9.00 */ break;
            case "FULL": /* Sconto: 0% => €12.00 */
            default: break;
        }
        Price = DEFAULT_PRICE * (1 - discount);
    }
}
