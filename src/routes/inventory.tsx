import { createFileRoute } from '@tanstack/react-router';
import { Inventory } from '@/components/manager-views';
export const Route=createFileRoute('/inventory')({head:()=>({meta:[{title:'Inventory | Aureya Jewels — Stock Manager'},{name:'description',content:'Manage inventory for your Aureya Jewels collection.'},{property:'og:title',content:'Inventory — Aureya Jewels'},{property:'og:description',content:'Manage inventory for your jewellery collection.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Inventory});
