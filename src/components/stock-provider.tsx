import { createContext,useContext,useEffect,useState,type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
export type Item=Database['public']['Tables']['items']['Row'];
export type Sale=Database['public']['Tables']['sales']['Row'];
type Stock={items:Item[];sales:Sale[];user:User|null;loading:boolean;refresh:()=>Promise<void>};
const Context=createContext<Stock>({items:[],sales:[],user:null,loading:true,refresh:async()=>{}});
export const useStock=()=>useContext(Context);
export function StockProvider({children}:{children:ReactNode}) {
 const [user,setUser]=useState<User|null>(null),[items,setItems]=useState<Item[]>([]),[sales,setSales]=useState<Sale[]>([]),[loading,setLoading]=useState(true);
 async function refresh(){const session=await supabase.auth.getUser();const u=session.data.user;setUser(u);if(!u){setItems([]);setSales([]);setLoading(false);return;}try{const allItems:Item[]=[],allSales:Sale[]=[];for(let start=0;;start+=1000){const {data,error}=await supabase.from('items').select('*').eq('deleted',false).order('created_at',{ascending:false}).range(start,start+999);if(error)throw error;allItems.push(...data);if(data.length<1000)break;}for(let start=0;;start+=1000){const {data,error}=await supabase.from('sales').select('*').order('date',{ascending:false}).order('created_at',{ascending:false}).range(start,start+999);if(error)throw error;allSales.push(...data);if(data.length<1000)break;}setItems(allItems);setSales(allSales);}catch{toast.error('Could not load records. Please try again.');}finally{setLoading(false);}}
 useEffect(()=>{void refresh();const {data}=supabase.auth.onAuthStateChange((event)=>{if(event==='SIGNED_IN'||event==='SIGNED_OUT')void refresh();});return()=>data.subscription.unsubscribe();},[]);
 return <Context.Provider value={{items,sales,user,loading,refresh}}>{children}</Context.Provider>;
}