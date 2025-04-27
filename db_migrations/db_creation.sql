-- Owners table
CREATE TABLE owners (
    id SERIAL PRIMARY KEY,
    frame VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    restaurant_name VARCHAR(255) NOT NULL,
    logo_path VARCHAR(255),
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES owners(id),
    name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Color themes table
CREATE TABLE color_themes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    data TEXT NOT NULL
);

-- Items table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL
);

-- Images table
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES items(id),
    isMain BOOLEAN NOT NULL DEFAULT false,
    image_url VARCHAR(255) NOT NULL
);

-- Item-Tag junction table
CREATE TABLE item_tag (
    item_id INTEGER NOT NULL REFERENCES items(id),
    tag_id INTEGER NOT NULL REFERENCES tags(id),
    PRIMARY KEY (item_id, tag_id)
);



-- Create indexes for better performance
CREATE INDEX idx_categories_owner_id ON categories(owner_id);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_images_item_id ON images(item_id);
CREATE INDEX idx_item_tag_item_id ON item_tag(item_id);
CREATE INDEX idx_item_tag_tag_id ON item_tag(tag_id);

-- Add a function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for tables with updated_at columns
CREATE TRIGGER update_owners_updated_at
BEFORE UPDATE ON owners
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();