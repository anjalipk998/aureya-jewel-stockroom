import { createFileRoute } from '@tanstack/react-router';
import { RecordSale } from '@/components/manager-views';
export const Route=createFileRoute('/record-sale')({head:()=>({meta:[{title:'RecordSale | Aureya Jewels — Stock Manager'},{name:'description',content:'Manage record-sale for your Aureya Jewels collection.'},{property:'og:title',content:'RecordSale — Aureya Jewels'},{property:'og:description',content:'Manage record-sale for your jewellery collection.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:RecordSale});
