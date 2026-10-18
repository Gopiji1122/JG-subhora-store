(()=>{'use strict';
const root=document.getElementById('all-products');if(!root)return;
const base=document.body.dataset.base||'';
const seen=new Set();
const items=(window.STORE_PRODUCTS||[]).filter(p=>{
 if(!p||!p.path||p.listed===false||!p.image||seen.has(p.path))return false;
 seen.add(p.path);return true;
});
const fmt=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
root.innerHTML=items.map(p=>`<article class="card product-card"><a class="card-main" href="${base}${esc(p.path)}"><div class="frame"><img src="${base}${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" width="600" height="600" style="width:100%;height:100%;object-fit:contain"></div><div class="info"><h3>${esc(p.name)}</h3><div class="price">${p.price==null?'Price to be confirmed':fmt(p.price)+' + shipping'}</div></div></a><div class="card-actions"><a class="btn btn-outline" href="${base}${esc(p.path)}">View details</a></div></article>`).join('');
if(!items.length)root.innerHTML='<p>No products are currently listed.</p>';
})();