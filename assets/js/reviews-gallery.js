(()=>{'use strict';
const gallery=document.getElementById('customer-review-gallery');
const status=document.getElementById('reviews-gallery-status');
if(!gallery||!status)return;
const base=document.body.dataset.base||'../';
const folder=base+'assets/images/review/';
const dialog=document.getElementById('review-image-dialog');
const dialogImage=document.getElementById('review-dialog-image');
const closeButton=dialog?.querySelector('.review-dialog-close');
const imageExists=(number)=>new Promise(resolve=>{
  const img=new Image();
  img.onload=()=>resolve({number,src:folder+number+'.webp'});
  img.onerror=()=>resolve(null);
  img.src=folder+number+'.webp';
});
function addReview(item){
  const figure=document.createElement('figure');
  figure.className='customer-review-item';
  const button=document.createElement('button');
  button.type='button';button.className='customer-review-image-button';
  button.setAttribute('aria-label','View customer review screenshot '+item.number);
  const image=document.createElement('img');
  image.src=item.src;
  image.alt='Customer review screenshot '+item.number;
  image.loading=item.number<=8?'eager':'lazy';
  image.decoding='async';image.width=720;image.height=960;
  button.append(image);figure.append(button);gallery.append(figure);
  button.addEventListener('click',()=>{
    if(!dialog||!dialogImage)return;
    dialogImage.src=item.src;dialogImage.alt='Expanded customer review screenshot '+item.number;
    if(typeof dialog.showModal==='function')dialog.showModal();
  });
}
async function loadReviews(){
  let number=1,found=0,emptyBatch=false;
  while(!emptyBatch){
    const batch=await Promise.all(Array.from({length:10},(_,offset)=>imageExists(number+offset)));
    const available=batch.filter(Boolean).sort((a,b)=>a.number-b.number);
    if(!available.length){emptyBatch=true;break;}
    available.forEach(addReview);found+=available.length;number+=10;
    // Numbered files should be continuous. Continue probing later batches so the gallery has no fixed image limit.
    if(available.length<10){
      const nextStart=number;
      const nextBatch=await Promise.all(Array.from({length:10},(_,offset)=>imageExists(nextStart+offset)));
      if(nextBatch.some(Boolean)){
        nextBatch.filter(Boolean).sort((a,b)=>a.number-b.number).forEach(addReview);
        found+=nextBatch.filter(Boolean).length;number+=10;
      }else emptyBatch=true;
    }
  }
  gallery.setAttribute('aria-busy','false');
  if(found){status.textContent=found===1?'1 customer review shared.':' '+found+' customer reviews shared.';status.classList.add('has-reviews');}
  else{status.textContent='Customer reviews will appear here soon.';status.classList.add('is-empty');}
}
closeButton?.addEventListener('click',()=>dialog?.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
dialog?.addEventListener('close',()=>{if(dialogImage)dialogImage.removeAttribute('src');});
loadReviews().catch(()=>{gallery.setAttribute('aria-busy','false');status.textContent='Reviews could not be loaded. Please try again later.';});
})();
