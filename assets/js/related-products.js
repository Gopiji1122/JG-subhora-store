(()=>{'use strict';
const products=window.STORE_PRODUCTS||[];const base=document.body.dataset.base||'';
const current=(location.pathname.match(/\/products\/([^/]+)\//)||[])[1]||'';
const groups={
 'product-01':['karwachauth-special','wedding-combo-1'],
 'product-02':['product-01','product-03'],
 'product-03':['product-04','wedding-combo-1'],
 'product-04':['product-03','wedding-combo-1'],
 'wedding-combo-1':['product-01','product-04'],
 'karwachauth-special':['karwachauth-special-1','product-01'],
 'karwachauth-special-1':['karwachauth-special','product-01']
};
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const section=document.querySelector('section.related');if(!section||!current)return;
const list=(groups[current]||['product-01','product-04']).map(id=>products.find(p=>p.id===id)).filter(p=>p&&p.id!==current&&p.image&&p.listed!==false).filter((p,i,a)=>a.findIndex(x=>x.path===p.path)===i);
if(!list.length)return;
const grid=section.querySelector('.product-grid');if(!grid)return;
grid.innerHTML=list.map(p=>{const price=p.price==null?'Price to be confirmed':money(p.price)+' + shipping';return `<article class="card product-card" data-product-id="${esc(p.id)}"><a class="card-main" href="${base}${esc(p.path)}"><div class="frame"><img src="${base}${esc(p.image)}" alt="${esc(p.name)}" width="600" height="600" loading="lazy" decoding="async"></div><div class="info"><h3>${esc(p.name)}</h3><div class="price">${esc(price)}</div></div></a><div class="card-actions"><a class="btn btn-outline" href="${base}${esc(p.path)}">View details</a><a class="btn btn-whatsapp" href="https://wa.me/${esc(window.STORE_WHATSAPP||'919216289916')}?text=${encodeURIComponent('Hello, I am interested in '+p.name+'. Please confirm availability and delivery charges.')}">WhatsApp</a></div></article>`}).join('');
})();