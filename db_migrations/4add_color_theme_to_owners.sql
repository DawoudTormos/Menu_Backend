ALter table public.owners
ADD COLUMN color_theme_id INTEGER NOT NULL DEFAULT 1;

ALter table public.owners
ADD Constraint owners_to_color_theme
FOREIGN KEY (color_theme_id) REFERENCES color_themes(id)
ON DELETE RESTRICT
ON update  RESTRICT;