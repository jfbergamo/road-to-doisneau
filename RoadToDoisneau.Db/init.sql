CREATE TABLE photos (
    photo_id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    title VARCHAR(75) NOT NULL,
    location VARCHAR(75),
    description TEXT,
    shooting_year INTEGER NOT NULL
);

CREATE TABLE prices (
	price_id SERIAL PRIMARY KEY,
	category VARCHAR(50) NOT NULL,
	price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
    ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    holder_name VARCHAR(75) NOT NULL,
    holder_email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '6 months'),
    has_booklet BOOL NOT NULL DEFAULT False,
    fk_price_id INT NOT NULL REFERENCES prices(price_id),
    fk_order_id INT NOT NULL REFERENCES orders(order_id)
);

CREATE TABLE articles (
	article_id SERIAL PRIMARY KEY,
	title VARCHAR(150) NOT NULL,
	description TEXT NOT NULL DEFAULT '',
	page VARCHAR(255) NOT NULL,
	date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	author VARCHAR(100),
	thumbnail VARCHAR(255) NOT NULL
);