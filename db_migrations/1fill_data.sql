-- Insert an owner
INSERT INTO public.owners (fname, lname, restaurant_name, logo_path, username, password)
VALUES ('John', 'Doe', 'Tasty Bites', '/logos/tasty-bites.png', 'johndoe', 'hashed_password_123');

-- Get the owner ID (assuming it's 1 since it's the first entry)
-- Insert 3 categories
INSERT INTO public.categories (owner_id, name)
VALUES 
(1, 'Appetizers'),
(1, 'Main Courses'),
(1, 'Desserts');

-- Insert some tags
INSERT INTO public.tags (name, color)
VALUES
('Spicy', '#FF0000'),
('Vegetarian', '#00AA00'),
('Gluten-Free', '#0000FF'),
('Chef''s Recommendation', '#FFA500'),
('New', '#FF69B4');

-- Insert items for each category
-- Appetizers
INSERT INTO public.items (name, description, price, category_id)
VALUES
('Bruschetta', 'Toasted bread topped with tomatoes, garlic, and fresh basil', 8.99, 1),
('Calamari', 'Crispy fried squid served with marinara sauce', 10.99, 1),
('Spinach Artichoke Dip', 'Creamy dip with spinach, artichokes, and melted cheese, served with tortilla chips', 9.50, 1);

-- Main Courses
INSERT INTO public.items (name, description, price, category_id)
VALUES
('Grilled Salmon', 'Fresh Atlantic salmon with lemon butter sauce, served with seasonal vegetables', 22.99, 2),
('Filet Mignon', '8oz tender beef filet with mashed potatoes and asparagus', 34.99, 2),
('Vegetable Lasagna', 'Layers of pasta, ricotta, mozzarella, and fresh vegetables', 18.50, 2);

-- Desserts
INSERT INTO public.items (name, description, price, category_id)
VALUES
('Chocolate Lava Cake', 'Warm chocolate cake with a molten center, served with vanilla ice cream', 9.99, 3),
('Tiramisu', 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream', 8.50, 3),
('Cheesecake', 'New York style cheesecake with strawberry topping', 7.99, 3);

-- Assign tags to items
INSERT INTO public.item_tag (item_id, tag_id)
VALUES
(1, 2),  -- Bruschetta is Vegetarian
(1, 3),  -- Bruschetta is Gluten-Free (assuming gluten-free bread)
(2, 1),  -- Calamari is Spicy
(3, 2),  -- Spinach Artichoke Dip is Vegetarian
(4, 4),  -- Grilled Salmon is Chef's Recommendation
(5, 4),  -- Filet Mignon is Chef's Recommendation
(6, 2),  -- Vegetable Lasagna is Vegetarian
(6, 3),  -- Vegetable Lasagna is Gluten-Free (assuming gluten-free pasta)
(7, 5),  -- Chocolate Lava Cake is New
(8, 4),  -- Tiramisu is Chef's Recommendation
(9, 5);  -- Cheesecake is New

-- Insert images for items
INSERT INTO public.images (item_id, ismain, image_url)
VALUES
-- Bruschetta
(1, true, '/images/items/bruschetta-main.jpg'),
(1, false, '/images/items/bruschetta-alt1.jpg'),
-- Calamari
(2, true, '/images/items/calamari-main.jpg'),
-- Spinach Artichoke Dip
(3, true, '/images/items/spinach-dip-main.jpg'),
(3, false, '/images/items/spinach-dip-alt1.jpg'),
-- Grilled Salmon
(4, true, '/images/items/salmon-main.jpg'),
-- Filet Mignon
(5, true, '/images/items/filet-main.jpg'),
(5, false, '/images/items/filet-alt1.jpg'),
-- Vegetable Lasagna
(6, true, '/images/items/lasagna-main.jpg'),
-- Chocolate Lava Cake
(7, true, '/images/items/lava-cake-main.jpg'),
-- Tiramisu
(8, true, '/images/items/tiramisu-main.jpg'),
(8, false, '/images/items/tiramisu-alt1.jpg'),
-- Cheesecake
(9, true, '/images/items/cheesecake-main.jpg');

-- Insert color themes
INSERT INTO public.color_themes (name, data)
VALUES
('Classic Red', '{"primary": "#E53935", "secondary": "#EF5350", "accent": "#FFCDD2"}'),
('Ocean Blue', '{"primary": "#1976D2", "secondary": "#2196F3", "accent": "#BBDEFB"}'),
('Earth Green', '{"primary": "#388E3C", "secondary": "#4CAF50", "accent": "#C8E6C9"}');