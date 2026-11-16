# Aureya Jewel Stockroom

Create "Aureya Jewels — Stock Manager", a clean responsive jewellery inventory and sales web app. Categories: Necklaces, Chain, Ring, Earrings Jumka, Earrings Hangi, Bangles, Earrings Studs, Bracelets, Other. Navigation: Dashboard, Inventory, Record Sale, Sales History. Inventory form: item name, category, quantity, purchase price, selling price, optional photo, optional notes; auto-generate unique code AJ-0001. Inventory list with photo, item code, name, category, purchased qty, sold qty, stock qty, purchase/selling price, status; search/filter; add/edit/delete with confirmation. Dashboard: unique items, purchased/sold/in-stock units, revenue, gross profit and category-wise in-stock/sold summary. Quick sale: item, quantity, actual unit selling price prefilled, Cash/GPay, date, note; validate stock, decrement quantity, calculate profit=(actual sale price-purchase price)*qty. Sales history with date/item/qty/price/total/payment mode/profit and filters. CSV export. Empty initial state, no demo data. Persist with cloud database if available, else localStorage. INR formatting, Indian number grouping, accessible validation and success/error feedback, no negative stock. Boutique design: ivory, champagne gold, charcoal, serif headings, clean sans-serif, spacious cards, responsive mobile-first, minimal options and easy for shop owner.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://aureya-jewel-stockroom.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e20c0a29-a634-4dc0-bbfc-d72bbdc5c889).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
