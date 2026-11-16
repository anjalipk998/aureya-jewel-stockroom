import { useEffect,useRef,useState } from 'react';
import { z } from 'zod';
import { Camera,Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStock,type Item } from './stock-provider';
import { categories,itemSchema,photoError } from '@/lib/inventory';
import { Button } from '@/components/ui/button';
import { Dialog,DialogContent,DialogTitle,DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

export function ItemForm({open,onOpenChange,item}:{open:boolean;onOpenChange:(v:boolean)=>void;item?:Item|undefined}){
 const {user,refresh}=useStock();
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const [file,setFile]=useState<File|null>(null),[preview,setPreview]=useState(''),[removePhoto,setRemovePhoto]=useState(false),[drag,setDrag]=useState(false);
 const inputRef=useRef<HTMLInputElement>(null),objectUrl=useRef('');
 useEffect(()=>{setFile(null);setRemovePhoto(false);setPreview('');setError('');
  if(item?.photo)void supabase.storage.from('jewellery-photos').createSignedUrl(item.photo,3600).then(({data})=>setPreview(data?.signedUrl??''));
  return()=>{if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);objectUrl.current='';};
 },[open,item?.id,item?.photo]);
 function pick(next:File|null){if(!next)return;
  if(!PHOTO_TYPES.includes(next.type)){setError('Choose a JPG, PNG or WebP photo.');return;}
  if(next.size>MAX_PHOTO_BYTES){setError('Photo must be 5 MB or smaller.');return;}
  setError('');setRemovePhoto(false);setFile(next);
  if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);
  objectUrl.current=URL.createObjectURL(next);setPreview(objectUrl.current);
 }
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setError('');if(!user){setError('Sign in before adding stock.');return;}setBusy(true);try{const form=new FormData(e.currentTarget);const values=itemSchema.parse(Object.fromEntries(form));if(values.purchased<(item?.sold??0))throw new Error(`Purchased quantity cannot be less than ${item?.sold} sold units.`);let photo=item?.photo??null;
  if(file){const ext=file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp';const path=`${user.id}/${crypto.randomUUID()}.${ext}`;const upload=await supabase.storage.from('jewellery-photos').upload(path,file);if(upload.error)throw upload.error;photo=path;}
  else if(removePhoto)photo=null;
  const result=item?await supabase.from('items').update({...values,photo}).eq('id',item.id):await supabase.from('items').insert({...values,photo});if(result.error)throw result.error;await refresh();toast.success(item?'Item updated':'Item added to inventory');onOpenChange(false);}catch(e){setError(e instanceof z.ZodError?e.issues[0]?.message??'Check the form':e instanceof Error?e.message:'Could not save item.');}finally{setBusy(false);}}
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="dialog-scroll"><DialogTitle className="font-display text-3xl">{item?'Edit item':'Add new item'}</DialogTitle><DialogDescription>{item?item.code:'A unique AJ item code will be assigned automatically.'}</DialogDescription><form onSubmit={submit} className="form-grid" key={item?.id??'new'}><div className="full"><label htmlFor="item-name">Item name *</label><input id="item-name" name="name" required maxLength={100} defaultValue={item?.name} placeholder="e.g. Pearl drop jhumka"/></div><div><label htmlFor="item-category">Category *</label><select id="item-category" name="category" defaultValue={item?.category??''} required><option value="" disabled>Select category</option>{categories.map(c=><option key={c}>{c}</option>)}</select></div><div><label htmlFor="item-quantity">Purchased quantity *</label><input id="item-quantity" name="purchased" type="number" min={item?.sold??0} max={1000000} step="1" required defaultValue={item?.purchased} placeholder="0"/></div><div><label htmlFor="purchase-price">Purchase price / unit (₹) *</label><input id="purchase-price" name="purchase_price" type="number" min="0" step="0.01" required defaultValue={item?.purchase_price} placeholder="0.00"/></div><div><label htmlFor="selling-price">Selling price / unit (₹) *</label><input id="selling-price" name="selling_price" type="number" min="0" step="0.01" required defaultValue={item?.selling_price} placeholder="0.00"/></div><div className="full"><label htmlFor="item-photo">Photo <span className="muted">(optional)</span></label><div className={`photo-picker${preview?' has-photo':''}${drag?' dragging':''}`} onClick={()=>inputRef.current?.click()} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);pick(e.dataTransfer.files?.[0]??null);}} aria-label="Product photo, drag and drop or click to browse">{preview?<img className="photo-preview" src={preview} alt="Selected product"/>:<div className="photo-empty"><Camera strokeWidth={1}/><span>Add a photo</span><small>Drag an image here</small></div>}<div className="photo-actions"><Button type="button" variant="outline" size="sm" onClick={e=>{e.stopPropagation();inputRef.current?.click();}}>{preview?'Change photo':'Choose photo'}</Button>{preview&&<Button type="button" variant="ghost" size="sm" onClick={e=>{e.stopPropagation();setFile(null);setPreview('');setRemovePhoto(true);}}><Trash2/>Remove</Button>}<p className="field-hint">JPG, PNG or WebP · up to 5 MB</p></div></div><input ref={inputRef} id="item-photo" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={e=>pick(e.target.files?.[0]??null)}/></div><div className="full"><label htmlFor="item-notes">Notes <span className="muted">(optional)</span></label><textarea id="item-notes" name="notes" maxLength={1000} rows={2} defaultValue={item?.notes} placeholder="Supplier, material or any other details"/></div>{error&&<p className="form-error full" role="alert">{error}</p>}<div className="full flex justify-end gap-2"><Button variant="outline" type="button" onClick={()=>onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={busy}>{busy?'Saving…':item?'Save changes':'Add item'}</Button></div></form></DialogContent></Dialog>;
}
