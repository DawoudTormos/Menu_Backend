-- Add created_at to all tables missing it
ALTER TABLE public.color_themes ADD COLUMN created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.images ADD COLUMN created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.item_tag ADD COLUMN created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.tags ADD COLUMN created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP;

-- Add updated_at to specific tables
ALTER TABLE public.color_themes ADD COLUMN updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.images ADD COLUMN updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.tags ADD COLUMN updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP;

-- Create triggers for updated_at columns
CREATE TRIGGER update_color_themes_updated_at
BEFORE UPDATE ON public.color_themes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_images_updated_at
BEFORE UPDATE ON public.images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
BEFORE UPDATE ON public.tags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();