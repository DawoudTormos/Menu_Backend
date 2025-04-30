ALTER TABLE owners
ALTER COLUMN logo_path SET DEFAULT 'nonset';

-- 2
ALTER TABLE owners
RENAME COLUMN name TO lname;
ALTER TABLE owners
Rename COLUMN frame to fname;
ALTER TABLE owners
ALTER COLUMN fname SET NOT NULL ;

-- 3
ALTER TABLE owners
ALTER COLUMN restaurant_name SET Default 'Restaurant' ;