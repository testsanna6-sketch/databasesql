-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(500) DEFAULT 'https://placehold.co/400x300?text=No+Image',
    category VARCHAR(100) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data with working image URLs
INSERT INTO products (name, description, price, image, category, stock) VALUES

-- Electronics
('iPhone 15 Pro', 'Apple iPhone 15 Pro with A17 Pro chip, titanium design and 48MP camera system.', 999.99,
 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop&auto=format', 'Electronics', 50),

('Samsung Galaxy S24', 'Flagship Android phone with Galaxy AI, 200MP camera and Snapdragon 8 Gen 3.', 899.99,
 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop&auto=format', 'Electronics', 40),

('MacBook Air M2', 'Ultra-thin laptop powered by Apple M2 chip, 13.6-inch Liquid Retina display.', 1099.99,
 'https://images.unsplash.com/photo-1611186871525-7c21b6c2afea?w=400&h=300&fit=crop&auto=format', 'Electronics', 25),

('Sony WH-1000XM5 Headphones', 'Industry-leading noise cancelling wireless headphones with 30-hour battery life.', 349.99,
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format', 'Electronics', 60),

('iPad Pro 12.9"', 'Apple iPad Pro with M2 chip, Liquid Retina XDR display and Apple Pencil support.', 1099.00,
 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&auto=format', 'Electronics', 35),

('Canon EOS R50 Camera', 'Mirrorless camera with 24.2MP sensor, 4K video and built-in Wi-Fi for creators.', 679.99,
 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop&auto=format', 'Electronics', 20),

-- Clothing
('Nike Air Max 270', 'Lightweight running shoes with large Air unit for all-day comfort and style.', 129.99,
 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format', 'Clothing', 100),

('Adidas Classic T-Shirt', 'Breathable cotton sports t-shirt with iconic three-stripe design.', 29.99,
 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop&auto=format', 'Clothing', 200),

('Levi\'s 501 Jeans', 'Original straight fit jeans made from heavyweight denim, timeless classic style.', 79.99,
 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=300&fit=crop&auto=format', 'Clothing', 150),

('Winter Jacket', 'Warm and waterproof winter jacket with hood, perfect for cold weather adventures.', 149.99,
 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=300&fit=crop&auto=format', 'Clothing', 80),

('Running Cap', 'Lightweight breathable sports cap with UV protection and adjustable strap.', 24.99,
 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop&auto=format', 'Clothing', 250),

('Sports Backpack', 'Durable 30L backpack with laptop compartment, water bottle pocket and padded straps.', 59.99,
 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&auto=format', 'Clothing', 120),

-- Books
('Harry Potter Box Set', 'Complete 7-book series by J.K. Rowling — Sorcerer\'s Stone to Deathly Hallows.', 59.99,
 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=300&fit=crop&auto=format', 'Books', 75),

('The Alchemist', 'A philosophical novel by Paulo Coelho about following your dreams and finding destiny.', 14.99,
 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&auto=format', 'Books', 120),

('Atomic Habits', 'James Clear\'s proven framework for building good habits and breaking bad ones daily.', 18.99,
 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop&auto=format', 'Books', 90),

('The Great Gatsby', 'F. Scott Fitzgerald\'s classic novel about wealth, love and the American Dream.', 12.99,
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format', 'Books', 110),

('Rich Dad Poor Dad', 'Robert Kiyosaki\'s personal finance classic about money, investing and financial freedom.', 15.99,
 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&auto=format', 'Books', 95),

('1984 by George Orwell', 'Dystopian novel about a totalitarian society, surveillance and the power of truth.', 11.99,
 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=300&fit=crop&auto=format', 'Books', 85),

-- Food
('Premium Coffee Beans', 'Single-origin Arabica beans from Ethiopia, medium roast, 500g pack.', 19.99,
 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop&auto=format', 'Food', 300),

('Japanese Green Tea (24 pack)', 'Premium Matcha green tea bags, rich in antioxidants and natural flavor.', 9.99,
 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&auto=format', 'Food', 500),

('Belgian Dark Chocolate Box', 'Assorted Belgian dark chocolate selection, 70% cocoa, 200g gift box.', 14.99,
 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop&auto=format', 'Food', 200),

('Premium Mixed Nuts', 'Roasted mixed nuts — almonds, cashews, walnuts and pistachios, 1kg bag.', 24.99,
 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop&auto=format', 'Food', 180),

('Organic Honey Jar', 'Pure wildflower honey, cold-extracted and unfiltered, 500ml glass jar.', 12.99,
 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&auto=format', 'Food', 150),

('Pasta & Sauce Bundle', 'Italian durum wheat pasta with homestyle tomato basil sauce, serves 4.', 7.99,
 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop&auto=format', 'Food', 400),

-- Games
('FIFA 25', 'The latest football simulation game with updated rosters, Ultimate Team and Career Mode.', 69.99,
 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop&auto=format', 'Games', 60),

('Minecraft', 'Open world sandbox game — build, explore and survive in an infinite blocky world.', 29.99,
 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop&auto=format', 'Games', 80),

('PlayStation 5 Controller', 'DualSense wireless controller with haptic feedback and adaptive triggers for PS5.', 69.99,
 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop&auto=format', 'Games', 45),

('Nintendo Switch OLED', 'Nintendo Switch OLED model with vibrant 7-inch screen and enhanced audio.', 349.99,
 'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=400&h=300&fit=crop&auto=format', 'Games', 55),

('Gaming Keyboard RGB', 'Mechanical gaming keyboard with Cherry MX switches, RGB backlight and anti-ghosting.', 89.99,
 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop&auto=format', 'Games', 70),

('Gaming Mouse', 'High-precision optical gaming mouse, 16000 DPI, programmable buttons and RGB lighting.', 49.99,
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop&auto=format', 'Games', 90);
