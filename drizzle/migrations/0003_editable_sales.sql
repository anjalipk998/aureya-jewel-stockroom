GRANT UPDATE, DELETE ON public.sales TO authenticated;

CREATE POLICY update_own_sales ON public.sales FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY delete_own_sales ON public.sales FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.adjust_stock_sale() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  product public.items;
BEGIN
  IF NEW.user_id <> OLD.user_id THEN
    RAISE EXCEPTION 'Sale owner cannot change';
  END IF;
  IF NEW.date > (now() AT TIME ZONE 'Asia/Kolkata')::date THEN
    RAISE EXCEPTION 'Sale date cannot be in the future';
  END IF;

  -- Lock and return stock on the previous item.
  SELECT * INTO product FROM public.items WHERE id = OLD.item_id FOR UPDATE;
  IF FOUND THEN
    UPDATE public.items SET sold = sold - OLD.quantity WHERE id = OLD.item_id;
  END IF;

  -- Lock and deduct stock on the (possibly new) item.
  SELECT * INTO product FROM public.items WHERE id = NEW.item_id AND user_id = auth.uid() FOR UPDATE;
  IF NOT FOUND OR product.deleted THEN
    RAISE EXCEPTION 'Item is unavailable';
  END IF;
  IF NEW.quantity > product.purchased - product.sold THEN
    RAISE EXCEPTION 'Not enough stock available';
  END IF;
  NEW.item_name := product.name;
  NEW.item_code := product.code;
  NEW.category := product.category;
  NEW.cost_price := product.purchase_price;
  UPDATE public.items SET sold = sold + NEW.quantity WHERE id = product.id;
  RETURN NEW;
END $$;

CREATE TRIGGER sale_stock_update BEFORE UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.adjust_stock_sale();

CREATE OR REPLACE FUNCTION public.restore_stock_sale() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  UPDATE public.items SET sold = sold - OLD.quantity WHERE id = OLD.item_id;
  RETURN OLD;
END $$;

CREATE TRIGGER sale_stock_delete AFTER DELETE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.restore_stock_sale();