(()=>{'use strict';
function enhance(){const footer=document.querySelector('.footer');if(!footer||footer.dataset.accordionReady==='true')return;footer.dataset.accordionReady='true';footer.classList.add('home-footer-accordion');
const grid=footer.querySelector('.footgrid');if(!grid)return;const columns=[...grid.children];
if(columns[0]){columns[0].classList.add('footer-intro');const intro=columns[0].querySelector('p');if(intro)intro.textContent='Price details will be confirmed on WhatsApp.';const chatLink=columns[0].querySelector('.whatsapp-link');if(chatLink)chatLink.remove();}
if(columns[1]){const col=columns[1],heading=col.querySelector('h3'),nav=col.querySelector('nav');if(heading&&nav){const d=document.createElement('details');d.className='footer-accordion';const summary=document.createElement('summary');summary.textContent='Quick Menu';d.append(summary);nav.classList.add('links');d.append(nav);col.replaceWith(d);}}
const social=footer.querySelector('.footer-social-wrap');if(social){const oldHeading=social.querySelector('h3'),nav=social.querySelector('.footer-social'),note=social.querySelector('.social-review-note');const d=document.createElement('details');d.className='footer-accordion';const summary=document.createElement('summary');summary.textContent=oldHeading?.textContent?.trim()||'Follow Us';d.append(summary);if(nav)d.append(nav);if(note)d.append(note);social.replaceChildren(d);}
}
function start(){if(window.SITE_SHELL_READY&&typeof window.SITE_SHELL_READY.then==='function')window.SITE_SHELL_READY.then(enhance);else enhance();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
