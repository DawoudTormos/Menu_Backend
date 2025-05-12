-- First drop the existing constraint
ALTER TABLE images 
DROP CONSTRAINT images_item_id_fkey;

-- Then add it back with new actions
ALTER TABLE images 
ADD CONSTRAINT images_item_id_fkey 
FOREIGN KEY (item_id) 
REFERENCES items(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- First drop the existing constraint
ALTER TABLE items 
DROP CONSTRAINT items_category_id_fkey;

-- Then add it back with new actions
ALTER TABLE items 
ADD CONSTRAINT items_category_id_fkey 
FOREIGN KEY (category_id) 
REFERENCES categories(id)
ON DELETE CASCADE
ON UPDATE CASCADE;


-- First drop the existing constraint
ALTER TABLE categories 
DROP CONSTRAINT categories_owner_id_fkey;

-- Then add it back with new actions
ALTER TABLE categories 
ADD CONSTRAINT categories_owner_id_fkey 
FOREIGN KEY (owner_id) 
REFERENCES owners(id)
ON DELETE CASCADE
ON UPDATE CASCADE;