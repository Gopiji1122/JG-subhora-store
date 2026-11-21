(()=>{'use strict';
const d=document,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* reveal on scroll */
const items=[...d.querySelectorAll('.reveal')];
if(!('IntersectionObserver' in window)||reduce){items.forEach(e=>e.classList.add('is-in'));}
else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}}),{rootMargin:'0px 0px -6% 0px',threshold:.06});items.forEach(e=>io.observe(e));}
/* reading progress */
const bar=d.querySelector('.blog-progress span'),post=d.querySelector('.blog-content');
if(bar&&post){const upd=()=>{const r=post.getBoundingClientRect(),total=Math.max(r.height-innerHeight*.5,1);const p=Math.min(1,Math.max(0,(innerHeight*.25-r.top)/total));bar.style.transform='scaleX('+p+')';};addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();}
/* table of contents */
const layout=d.querySelector('.blog-layout');
if(post&&layout){
 const heads=[...post.querySelectorAll('.blog-sec>h2')];
 if(heads.length>2){
  const used=new Set();
  const slug=t=>t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'section';
  heads.forEach(h=>{let s=slug(h.textContent),n=s,i=2;while(used.has(n)||d.getElementById(n))n=s+'-'+i++;used.add(n);h.id=n;});
  const nav=d.createElement('details');nav.className='blog-toc';nav.setAttribute('aria-label','In this guide');
  if(matchMedia('(min-width:1040px)').matches)nav.open=true;
  nav.innerHTML='<summary>In this guide</summary><ol>'+heads.map(h=>'<li><a href="#'+h.id+'">'+h.textContent.replace(/^\s*\d+\s*/,'').trim()+'</a></li>').join('')+'</ol>';
  layout.insertBefore(nav,layout.firstChild);
  if('IntersectionObserver' in window){
   const links=[...nav.querySelectorAll('a')];
   const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')==='#'+e.target.id));}}),{rootMargin:'-20% 0px -65% 0px'});
   heads.forEach(h=>so.observe(h));
  }
 }
}
})();
