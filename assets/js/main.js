(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const base=document.body.dataset.base||''; const products=window.STORE_PRODUCTS||[]; const phone=window.STORE_WHATSAPP||'919216289916';
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(n);
const getCart=()=>{try{return JSON.parse(localStorage.getItem('jgks-cart')||'{}')}catch{return {}}};
const saveCart=c=>{try{localStorage.setItem('jgks-cart',JSON.stringify(c))}catch{}updateCount();renderCartIfPresent();if($('#cart-drawer')?.classList.contains('open'))renderCartDrawer()};
const productById=id=>products.find(p=>p.id===id);
function updateCount(){const c=getCart(),n=Object.values(c).reduce((s,q)=>s+(Number(q)||0),0);$$('[data-cart-count]').forEach(el=>el.textContent=n)}
function add(id){const p=productById(id);if(!p)return;const c=getCart();c[id]=Math.max(0,Number(c[id])||0)+1;saveCart(c);const status=$('[data-cart-status]');if(status){status.textContent=p.name+' added to cart.';status.classList.add('show')}else{let toast=$('.toast');if(!toast){toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');document.body.append(toast)}toast.textContent=p.name+' added to cart';toast.classList.add('visible');clearTimeout(toast._timer);toast._timer=setTimeout(()=>toast.classList.remove('visible'),2400)}}
function updatePrices(){products.forEach(p=>$$('[data-product-price="'+p.id+'"]').forEach(el=>el.textContent=p.price==null?'Price to be confirmed':money(p.price)))}
function renderCartIfPresent(){const root=$('#cart-content');if(!root)return;const c=getCart(),entries=Object.entries(c).filter(([id,q])=>productById(id)&&Number(q)>0);if(!entries.length){root.innerHTML='<div class="empty-state"><div class="empty-icon">🛒</div><h2>Your cart is empty</h2><p>Browse the catalogue and add products you are interested in.</p><a class="btn" href="'+base+'index.html#categories">Explore categories</a></div>';return}
let knownTotal=0,allPriced=true;const rows=entries.map(([id,q])=>{const p=productById(id),qty=Number(q),line=p.price==null?null:p.price*qty;if(line==null)allPriced=false;else knownTotal+=line;const image=p.image?'<img src="'+base+p.image+'" alt="" width="96" height="96">':'<div class="mini-placeholder">JG</div>';return '<article class="cart-item" data-cart-item="'+id+'"><div class="cart-thumb">'+image+'</div><div class="cart-item-info"><a class="cart-product-name" href="'+base+p.path+'">'+p.name+'</a><p>'+p.category+'</p><div class="cart-unit-price">'+(p.price==null?'Price to be confirmed':money(p.price))+'</div><div class="quantity-control"><button type="button" data-qty="-1" data-id="'+id+'" aria-label="Decrease quantity of '+p.name+'">−</button><span>'+qty+'</span><button type="button" data-qty="1" data-id="'+id+'" aria-label="Increase quantity of '+p.name+'">+</button><button class="remove-item" type="button" data-remove="'+id+'">Remove</button></div></div><strong class="cart-line-total">'+(line==null?'Confirm price':money(line))+'</strong></article>'}).join('');
root.innerHTML='<div class="cart-items">'+rows+'</div><aside class="cart-summary"><h2>Order summary</h2><div class="summary-line"><span>Items</span><strong>'+entries.reduce((s,[,q])=>s+Number(q),0)+'</strong></div><div class="summary-line"><span>Subtotal</span><strong>'+(allPriced?money(knownTotal):'To be confirmed')+'</strong></div><p class="small-muted">Shipping, availability and final prices will be confirmed on WhatsApp.</p><button type="button" class="btn whatsapp-checkout" id="whatsapp-checkout">Send order enquiry on WhatsApp ↗</button><p class="small-muted">WhatsApp will open with a message for you to review and send. Your order is not confirmed until we reply.</p><button type="button" class="text-button" id="clear-cart">Clear cart</button></aside>';
$$('[data-qty]',root).forEach(b=>b.addEventListener('click',()=>{const cart=getCart(),id=b.dataset.id;cart[id]=Math.max(0,(Number(cart[id])||0)+Number(b.dataset.qty));if(!cart[id])delete cart[id];saveCart(cart)}));
$$('[data-remove]',root).forEach(b=>b.addEventListener('click',()=>{const cart=getCart();delete cart[b.dataset.remove];saveCart(cart)}));
$('#clear-cart',root)?.addEventListener('click',()=>saveCart({}));
$('#whatsapp-checkout',root)?.addEventListener('click',()=>{const now=getCart();const items=Object.entries(now).filter(([id,q])=>productById(id)&&Number(q)>0);if(!items.length)return;let lines=['Hello, I would like to enquire/order these products from JG Subhora Store:'];let subtotal=0,all=true;items.forEach(([id,q])=>{const p=productById(id);lines.push('- '+p.name+' | Qty: '+q+' | '+(p.price==null?'Price to be confirmed':money(p.price)));if(p.price==null)all=false;else subtotal+=p.price*Number(q)});lines.push('Subtotal: '+(all?money(subtotal):'Please confirm prices'));lines.push('Please confirm availability, delivery charges and final total.');lines.push('Website: '+location.href.replace(/cart\/?(?:\?.*)?$/,'') );window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener')});}
function renderSearch(){const root=$('#search-results');if(!root)return;const input=$('#search-query');const params=new URLSearchParams(location.search);if(input)input.value=params.get('q')||'';const q=(params.get('q')||'').trim().toLowerCase();const results=products.filter(p=>!q||(p.name+' '+p.category).toLowerCase().includes(q));const status=$('#search-status');if(status)status.textContent=results.length+' product'+(results.length===1?'':'s')+' found'+(q?' for “'+q+'”':'');root.innerHTML=results.length?results.map(p=>{const img=p.image?'<img src="'+base+p.image+'" alt="'+p.name+'" width="800" height="800" loading="lazy">':'<div class="placeholder">Product photo<br>will be added</div>';return '<article class="card product-card"><a class="card-main" href="'+base+p.path+'"><div class="frame">'+img+'</div><div class="info"><p class="card-category">'+p.category+'</p><h3>'+p.name+'</h3><div class="price">'+(p.price==null?'Price to be confirmed':money(p.price))+'</div></div></a><div class="card-actions"><a class="btn btn-outline" href="'+base+p.path+'">View details</a><button class="btn add-to-cart" type="button" data-add-to-cart="'+p.id+'">Add to cart</button></div></article>'}).join(''):'<div class="empty-state"><h2>No products found</h2><p>Try a broader term such as kalash, thali or katori.</p></div>';}
function setupTheme(){const btn=$('.theme-toggle');const saved=localStorage.getItem('jgks-theme');const preferred=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';const set=t=>{document.documentElement.dataset.theme=t;if(btn){btn.textContent=t==='dark'?'☀':'☾';btn.setAttribute('aria-label',t==='dark'?'Switch to light mode':'Switch to dark mode')}};set(saved||preferred);btn?.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';localStorage.setItem('jgks-theme',next);set(next)})}
function setupHeader(){
  // Header search remains inline on desktop. On mobile, the compact search button opens the panel below the header.
  const menuButton=$('.toggle'), menuDrawer=$('.drawer');
  if(menuButton && menuDrawer){
    if(menuDrawer.parentElement!==document.body)document.body.append(menuDrawer);
    menuButton.setAttribute('aria-controls','category-side-menu');
    menuDrawer.id='category-side-menu';
    menuButton.addEventListener('click',()=>openPanel('menu'));
  }
  $$('.search-form').forEach(form=>{
    form.action=base+'search/';
    form.addEventListener('submit',e=>{
      const input=$('input[name="q"]',form);
      if(window.matchMedia('(max-width: 760px)').matches){
        e.preventDefault(); openSearchPanel(); return;
      }
      if(!input || !input.value.trim()){
        e.preventDefault(); input?.focus();
      }
    });
  });
}
function openPanel(which){
  const menu=$('.drawer'), cart=$('#cart-drawer'), backdrop=$('.panel-backdrop');
  closePanels(false);
  if(which==='menu' && menu){menu.classList.add('open');menu.setAttribute('aria-hidden','false');$('.toggle')?.setAttribute('aria-expanded','true');}
  if(which==='cart' && cart){renderCartDrawer();cart.classList.add('open');cart.setAttribute('aria-hidden','false');}
  if(backdrop){backdrop.classList.add('visible');backdrop.setAttribute('aria-hidden','false');}
  document.body.classList.add('panel-open');
}
function openSearchPanel(){
  const panel=$('#mobile-search-panel'); if(!panel)return;
  closePanels(false); panel.classList.add('open');panel.setAttribute('aria-hidden','false');
  document.body.classList.add('panel-open');
  const headerInput=$('.search-form input[name="q"]'); const mobileInput=$('#mobile-search-query');
  if(mobileInput){mobileInput.value=headerInput?.value||new URLSearchParams(location.search).get('q')||'';setTimeout(()=>mobileInput.focus(),40);}
}
function closePanels(resetFocus=true){
  const menu=$('.drawer'), cart=$('#cart-drawer'), search=$('#mobile-search-panel'), backdrop=$('.panel-backdrop');
  [menu,cart,search].forEach(el=>{if(el){el.classList.remove('open');el.setAttribute('aria-hidden','true')}});
  backdrop?.classList.remove('visible');backdrop?.setAttribute('aria-hidden','true');document.body.classList.remove('panel-open');
  $('.toggle')?.setAttribute('aria-expanded','false');
  if(resetFocus) $('.toggle')?.focus({preventScroll:true});
}
function renderCartDrawer(){
  const root=$('#cart-drawer-content'); if(!root)return;
  const c=getCart(), entries=Object.entries(c).filter(([id,q])=>productById(id)&&Number(q)>0);
  if(!entries.length){root.innerHTML='<div class="drawer-empty"><div class="empty-icon">🛍</div><h3>Your bag is waiting</h3><p>Explore our traditional puja essentials and add your favourites here.</p><a class="btn" href="'+base+'index.html#best-products">Explore products</a></div>';return;}
  let knownTotal=0,allPriced=true;
  const rows=entries.map(([id,q])=>{const p=productById(id),qty=Number(q),line=p.price==null?null:p.price*qty;if(line==null)allPriced=false;else knownTotal+=line;const image=p.image?'<img src="'+base+p.image+'" alt="" width="76" height="76">':'<div class="mini-placeholder">JG</div>';return '<article class="drawer-cart-item"><div class="drawer-cart-thumb">'+image+'</div><div class="drawer-cart-info"><a href="'+base+p.path+'">'+p.name+'</a><small>'+p.category+'</small><strong>'+(p.price==null?'Price to be confirmed':money(p.price))+'</strong><div class="drawer-quantity"><button type="button" data-drawer-qty="-1" data-id="'+id+'" aria-label="Decrease '+p.name+'">−</button><span>'+qty+'</span><button type="button" data-drawer-qty="1" data-id="'+id+'" aria-label="Increase '+p.name+'">+</button><button type="button" data-drawer-remove="'+id+'" class="drawer-remove">Remove</button></div></div></article>';}).join('');
  root.innerHTML='<div class="drawer-cart-list">'+rows+'</div><div class="drawer-cart-summary"><div class="summary-line"><span>Items</span><strong>'+entries.reduce((n,[,q])=>n+Number(q),0)+'</strong></div><div class="summary-line"><span>Subtotal</span><strong>'+(allPriced?money(knownTotal):'To be confirmed')+'</strong></div><p>Final prices, availability and delivery charges are confirmed on WhatsApp.</p><button class="btn drawer-checkout" type="button" data-drawer-checkout>Continue on WhatsApp ↗</button><button class="text-button" type="button" data-drawer-clear>Clear bag</button></div>';
}
function sendCartWhatsApp(){
 const now=getCart(),items=Object.entries(now).filter(([id,q])=>productById(id)&&Number(q)>0);if(!items.length)return;
 const lines=['Hello, I would like to enquire about these products from JG Subhora Store:'];let subtotal=0,all=true;
 items.forEach(([id,q])=>{const p=productById(id);lines.push('- '+p.name+' | Qty: '+q+' | '+(p.price==null?'Price to be confirmed':money(p.price)));if(p.price==null)all=false;else subtotal+=p.price*Number(q)});
 lines.push('Subtotal: '+(all?money(subtotal):'Please confirm prices'));lines.push('Please confirm availability, delivery charges and final total.');lines.push('Website: https://subhora.in/');window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener');
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-add-to-cart]');if(b){add(b.dataset.addToCart);b.textContent='Added ✓';setTimeout(()=>{if(b.isConnected)b.textContent='Add to cart'},1300)}});

document.addEventListener('click',e=>{
 const searchLink=e.target.closest('[data-open-search]'); if(searchLink && window.matchMedia('(max-width: 760px)').matches){e.preventDefault();openSearchPanel();return;}
 const openCart=e.target.closest('[data-open-cart]'); if(openCart){e.preventDefault();openPanel('cart');return;}
 if(e.target.closest('[data-close-panels]')||e.target.closest('[data-close-search]')){closePanels();return;}
 if(e.target.closest('[data-drawer-qty]')){const b=e.target.closest('[data-drawer-qty]'),c=getCart(),id=b.dataset.id;c[id]=Math.max(0,(Number(c[id])||0)+Number(b.dataset.drawerQty));if(!c[id])delete c[id];saveCart(c);renderCartDrawer();return;}
 if(e.target.closest('[data-drawer-remove]')){const id=e.target.closest('[data-drawer-remove]').dataset.drawerRemove,c=getCart();delete c[id];saveCart(c);renderCartDrawer();return;}
 if(e.target.closest('[data-drawer-clear]')){saveCart({});renderCartDrawer();return;}
 if(e.target.closest('[data-drawer-checkout]')){sendCartWhatsApp();return;}
});
$('#mobile-search-panel form')?.addEventListener('submit',e=>{const input=$('#mobile-search-query');if(!input?.value.trim()){e.preventDefault();input?.focus();return;}e.preventDefault();const url=new URL(base+'search/',location.href);url.searchParams.set('q',input.value.trim());location.href=url.href;});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('panel-open'))closePanels();});
setupTheme();setupHeader();$$('.drawer a').forEach(a=>a.addEventListener('click',()=>closePanels(false)));updateCount();updatePrices();renderCartIfPresent();renderCartDrawer();renderSearch();
})();