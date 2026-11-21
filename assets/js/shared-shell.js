(()=>{'use strict';
const body=document.body;
const base=body?.dataset.base||'';
const replaceBase=html=>html.replaceAll('__BASE__',base);
async function loadInto(selector,path){const host=document.querySelector(selector);if(!host)return;const response=await fetch(base+path,{credentials:'same-origin'});if(!response.ok)throw new Error('Shared component request failed: '+path);host.outerHTML=replaceBase(await response.text());}
window.SITE_SHELL_READY=Promise.all([
 loadInto('[data-shared-header]','assets/components/header.html'),
 loadInto('[data-shared-footer]','assets/components/footer.html')
]).catch(error=>{console.error('Could not load shared site components.',error);});
})();
