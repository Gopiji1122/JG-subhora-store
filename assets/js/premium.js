(()=>{'use strict';const d=document,h=d.documentElement,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
h.classList.add('js');
const hb=d.querySelector('.hero-banner'),hd=()=>d.querySelector('.header'),pb=d.createElement('div'),tp=d.createElement('button');
if(!d.querySelector('.blog-progress')){pb.className='pm-progress';pb.setAttribute('aria-hidden','true');d.body.appendChild(pb)}
tp.className='pm-top';tp.type='button';tp.setAttribute('aria-label','Back to top');tp.textContent='↑';tp.onclick=()=>scrollTo({top:0,behavior:rm?'auto':'smooth'});d.body.appendChild(tp);
let t=0;const on=()=>{t=0;const y=scrollY,m=h.scrollHeight-innerHeight,H=hd();if(H)H.classList.toggle('scrolled',y>12);pb.style.transform='scaleX('+(m>0?y/m:0)+')';if(hb&&y<innerHeight*1.2)hb.style.setProperty('--py',(y*.08).toFixed(1)+'px');tp.classList.toggle('on',y>700)};
addEventListener('scroll',()=>{t||(t=requestAnimationFrame(on))},{passive:true});on();
if(rm||!('IntersectionObserver' in window))return;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px',threshold:.05});
const mark=()=>d.querySelectorAll('main .heading,main .brand-story,main .order-strip,main .card,main .trust-item,main .faq-section details,main .review-cta,main .product-content-section,main [data-r]').forEach((e,i)=>{if(e.dataset.rv||e.closest('.blog-post'))return;e.dataset.rv=1;e.style.setProperty('--d',(i%4)*.08+'s');const r=e.getBoundingClientRect();if(r.top<innerHeight*.9&&r.bottom>0)return;e.classList.add('rv');io.observe(e)});
mark();setTimeout(mark,900);
})();
