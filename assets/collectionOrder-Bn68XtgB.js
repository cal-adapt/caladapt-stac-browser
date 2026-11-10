function i(r){return typeof r?.id=="string"?r.id:typeof r?.href=="string"?r.href.split("/").filter(Boolean).pop():null}function l(r,n){if(!Array.isArray(n)||n.length===0)return r;const e=t=>{const o=n.indexOf(i(t));return o===-1?n.length:o};return r.slice().sort((t,o)=>e(t)-e(o))}export{l as o};
//# sourceMappingURL=collectionOrder-Bn68XtgB.js.map
