import { describe,it,expect } from 'vitest';
import { categories,profit,validateStock,itemSchema,money,photoError,maxPhotoBytes } from '../lib/inventory';
describe('inventory rules',()=>{
 it('uses exactly the requested categories',()=>expect(categories).toEqual(['Necklaces','Chain','Ring','Earrings Jumka','Earrings Hangi','Bangles','Earrings Studs','Bracelets','Other']));
 it('calculates profit from actual unit price',()=>expect(profit(850,500,3)).toBe(1050));
 it('rejects sales exceeding available stock',()=>expect(()=>validateStock(10,8,3)).toThrow());
 it('allows selling exactly the available units',()=>expect(()=>validateStock(10,8,2)).not.toThrow());
 it('rejects negative quantity',()=>expect(()=>validateStock(10,0,-1)).toThrow());
 it('rejects negative purchase price',()=>expect(itemSchema.safeParse({name:'Ring',category:'Ring',purchased:2,purchase_price:-1,selling_price:100,notes:''}).success).toBe(false));
 it('groups INR in the Indian system',()=>expect(money(123456)).toBe('₹1,23,456.00'));
});