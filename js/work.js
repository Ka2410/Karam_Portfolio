(function(){
/* ───────────── DATA ───────────── */
var P=[
{n:'Megawrat',ty:'Web app · PWA',ch:'Apps',c:'#A8FF1F',b:'#14130F',s:'mega',u:'https://megawrat.online',
 d:'A local super-app for 10th of Ramadan City: sell and buy by district, hire rated tradesmen, report lost and found. Installs from the browser, no store.',
 k:[['Coverage','44 districts · 90 blocks'],['Install','PWA, no APK'],['Language','Arabic-first']],
 f:['Classifieds by district across 7 categories','Rated services directory with direct contact','Push notifications on Android and iOS','Browse freely, sign in only to post or contact']},
{n:'Human Machines',ty:'Member platform',ch:'Apps',c:'#FF1D37',b:'#0D0D0F',s:'hm',zf:'84% 50%',u:'https://team-hm.com/login',
 d:'A coaching platform that keeps a client’s diet, training and progress in one place. The system lives behind a secure login, so this is its front door.',
 k:[['Access','Phone sign-in'],['Language','AR / EN'],['Theme','Dark / Light']],
 f:['Phone-number login with remember-me','Password recovery flow','One dashboard for diet, training and progress','Language and theme switch on the login screen']},
{n:'EGO',ty:'Fashion storefront',ch:'Commerce',c:'#C6FF00',b:'#080808',s:'ego',u:'https://ka2410.github.io/EGO/',
 d:'A streetwear store that plays like a game. A chrome character models each look, you drag to switch, and the interface stays quiet so the clothes make the noise.',
 k:[['Pieces','15'],['Looks','8 character-select'],['Made in','Egypt']],
 f:['Character-select hero with drag to explore','Shop filters, bag and wishlist','Lookbook and size guide','Single-page app with hash routing']},
{n:'Off Plan',ty:'Property portal',ch:'Real estate',c:'#A3B36A',b:'#1C2314',s:'off',u:'https://off-plan.sa/',
 d:'A guide to off-plan property in Saudi Arabia. Search projects, see deals and resale listings, and send an enquiry. Mobile apps are announced next.',
 k:[['Market','Saudi Arabia'],['Language','AR / EN'],['Next','iOS + Android']],
 f:['Search by price, area and sale or rent','Map view and project cards','Deals and Resale sections','Off Plan+ request form and floating call / WhatsApp']},
{n:'Alzamiliah',ty:'Corporate website',ch:'Real estate',c:'#D79A68',b:'#2A1A14',s:'alz',u:'https://alzamiliah.com/ar',
 d:'The site of a Saudi real-estate development and investment company. It opens on a rendered aerial of its own project, then shows live availability.',
 k:[['Hero','Cinematic video'],['Projects','6 listed'],['Language','AR / EN']],
 f:['Full-screen video hero with project aerial','Status per project: available or coming soon','Map pin and detail page per project','Company profile download and contact form']},
{n:'Tower Top',ty:'Corporate website',ch:'Real estate',c:'#C8324B',b:'#17100F',s:'tt',u:'https://towertop-eg.com',
 d:'A website for a construction and finishing company. It sells craft first: a full-bleed luxury interior, then the company profile, strengths and services.',
 k:[['Sector','Construction & finishing'],['Language','EN / AR'],['Goal','Request a quote']],
 f:['Full-bleed hero: “We build the details”','Menus: profile, advantages, core strengths, services','Request-a-quote and Consult-our-experts calls to action','Floating WhatsApp, Facebook, TikTok, Instagram and email on mobile']},
{n:'KOVA Café',ty:'Brand experience',ch:'Hospitality',c:'#D9AE62',b:'#2A080C',s:'kova',zf:'66% 56%',u:'https://ka2410.github.io/KOVA-CAFE/',
 d:'A luxury café in Cairo told as an atmosphere: video, ambient sound and a bilingual story, ending in a table reservation confirmed on WhatsApp.',
 k:[['Mood','Video + ambient audio'],['Language','AR / EN'],['Flow','Table reservation']],
 f:['Video hero with sound toggle','K·O·V·A brand story','Menu: coffee, non-coffee, desserts','Reservation by date, time and guests']}];
/* projects that have a phone screenshot */
P.forEach(function(p){p.hasM=({mega:1,hm:1,alz:1,ego:1,tt:1,off:1,kova:1})[p.s]||0;});

var root=document.getElementById('work'),page=document.getElementById('portfolio');if(!root)return;
var wk=root.querySelector('.wk'),rail=root.querySelector('.wk-rail ul'),main=root.querySelector('.wk-main');
var N=P.length,pad=function(i){return (i<9?'0':'')+(i+1);};
var host=function(u){return u.replace(/^https?:\/\/(www\.)?/,'').replace(/\/$/,'');};
var st=function(p){return '--p:'+p.c+';--b:'+p.b;};
var img=function(p,k,alt){return '<img src="img/work/'+p.s+'-'+k+'.webp" alt="'+p.n+' '+alt+'" loading="lazy" decoding="async">';};

/* ───────────── RAIL (grouped by category) ───────────── */
var prev=null,railH='';
P.forEach(function(p,i){
  if(p.ch!==prev){railH+='<li class="wk-rcat">'+p.ch+'</li>';prev=p.ch;}
  railH+='<li data-i="'+i+'" style="--c:'+p.c+'"><b>'+pad(i)+'</b><span>'+p.n+'</span></li>';
});
rail.innerHTML=railH;

/* ───────────── DESKTOP SECTIONS ───────────── */
main.innerHTML=P.map(function(p,i){
  var ty=p.ty.split(' · ');
  return '<section class="wk-sc'+(p.hasM?'':' wk-solo')+'" id="sc'+i+'" style="'+st(p)+'">'+
   '<div class="wk-block"></div><div class="wk-glow"></div>'+
   '<div class="wk-vis"><div class="wk-frame">'+
     '<div class="wk-ghost">'+p.n.split(' ').join('<br>')+'</div>'+
     '<div class="wk-stage"><div class="wk-win"><div class="wk-bar"><s></s><s></s><s></s><em>'+host(p.u)+'</em></div>'+img(p,'d','desktop')+'</div></div>'+
     (p.hasM?'<div class="wk-phw">'+img(p,'m','mobile')+'</div>':'<div class="wk-zoom" role="img" aria-label="'+p.n+' detail" style="background-image:url(img/work/'+p.s+'-d.webp);background-position:'+(p.zf||'60% 50%')+'"></div>')+
   '</div></div>'+
   '<div class="wk-info">'+
     '<div class="wk-eyebrow">'+p.ch+'<u></u><i>'+p.ty+'</i></div>'+
     '<h3 class="wk-name">'+p.n+'</h3>'+
     '<p class="wk-desc">'+p.d+'</p>'+
     '<div class="wk-facts">'+p.k.map(function(k){return '<div><em>'+k[0]+'</em>'+k[1]+'</div>';}).join('')+'</div>'+
     '<ul class="wk-ft">'+p.f.map(function(f){return '<li>'+f+'</li>';}).join('')+'</ul>'+
     '<div class="wk-act"><a class="wk-btn" role="button" tabindex="0" data-go="'+i+'"><span>Enter the project</span><span class="wk-btn-i fa fa-arrow-right"></span></a>'+
     '<a class="wk-live" href="'+p.u+'" target="_blank" rel="noopener">Open live ↗</a></div>'+
     '<div class="wk-count"><b>'+pad(i)+'</b> / '+pad(N-1)+'</div>'+
   '</div></section>';
}).join('');

/* ───────────── MOBILE FEED ───────────── */
var feed=document.createElement('div');feed.className='wk-feed';
prev=null;
feed.innerHTML='<div class="wk-head"><small>Selected work</small><h2>Portfolio</h2><p>'+N+' projects built end-to-end, from the first screen to the live product.</p></div>'+
P.map(function(p,i){
  var cat='';if(p.ch!==prev){cat='<div class="wk-mcat">'+p.ch+'</div>';prev=p.ch;}
  var win='<div class="wk-mwin'+(p.hasM?'':' solo')+'"><div class="wk-bar"><s></s><s></s><s></s></div>'+img(p,'d','desktop')+'</div>';
  var ph=p.hasM?'<img class="wk-mph" src="img/work/'+p.s+'-m.webp" alt="'+p.n+' mobile" loading="lazy" decoding="async">':'';
  return cat+'<article class="wk-card" style="'+st(p)+'">'+
    '<div class="wk-atm"><div class="wk-chips"><span class="n">'+pad(i)+' / '+pad(N-1)+'</span><span class="c">'+p.ch+'</span></div>'+
    '<div class="wk-ghost">'+p.n.split(' ')[0]+'</div>'+win+ph+'</div>'+
    '<div class="wk-line"></div>'+
    '<div class="wk-body">'+
      '<div class="wk-tags">'+p.ty.split(' · ').map(function(t){return '<i>'+t+'</i>';}).join('')+'</div>'+
      '<h3>'+p.n+'</h3><p>'+p.d+'</p>'+
      '<div class="wk-mstats">'+p.k.map(function(k){return '<div><em>'+k[0]+'</em>'+k[1]+'</div>';}).join('')+'</div>'+
      '<div class="wk-mbtns"><a class="wk-btn" role="button" tabindex="0" data-go="'+i+'"><span>Enter project</span><span class="wk-btn-i fa fa-arrow-right"></span></a>'+
      '<a class="wk-live" href="'+p.u+'" target="_blank" rel="noopener">Live ↗</a></div>'+
    '</div></article>';
}).join('');
wk.appendChild(feed);

/* ───────────── LIVE OVERLAY ───────────── */
var live=document.createElement('div');live.className='wk-live-ov';
live.innerHTML='<header><span></span><a target="_blank" rel="noopener">Open in new tab ↗</a><button type="button">Close ✕</button></header><iframe title="Live preview"></iframe>';
document.body.appendChild(live);
var fr=live.querySelector('iframe');
function openLive(i){var p=P[i];live.style.setProperty('--c',p.c);live.querySelector('span').textContent=p.n+' · LIVE';live.querySelector('a').href=p.u;fr.src=p.u;live.classList.add('on');}
function closeLive(){live.classList.remove('on');fr.src='about:blank';}
live.querySelector('button').addEventListener('click',closeLive);
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLive();});
wk.addEventListener('click',function(e){var b=e.target.closest('[data-go]');if(b){e.preventDefault();openLive(+b.dataset.go);}});
wk.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){var b=e.target.closest('[data-go]');if(b){e.preventDefault();openLive(+b.dataset.go);}}});

/* ───────────── RAIL: click + scroll-spy ───────────── */
var items=[].slice.call(rail.querySelectorAll('li[data-i]'));
rail.addEventListener('click',function(e){var li=e.target.closest('li[data-i]');if(li)document.getElementById('sc'+li.dataset.i).scrollIntoView({behavior:'smooth'});});
var io=new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.intersectionRatio>.35){e.target.classList.add('in');
    items.forEach(function(l,j){l.classList.toggle('on','sc'+j===e.target.id);});}
});},{root:page,threshold:[.35,.6]});
[].forEach.call(main.querySelectorAll('.wk-sc'),function(s){io.observe(s);});

/* mobile cards: reveal on scroll */
var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io2.unobserve(e.target);}});},{root:page,threshold:.12});
[].forEach.call(feed.querySelectorAll('.wk-card'),function(c){io2.observe(c);});

/* subtle pointer parallax on the desktop frame (mouse only) */
if(window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  [].forEach.call(main.querySelectorAll('.wk-sc'),function(s){
    var f=s.querySelector('.wk-frame');
    s.addEventListener('mousemove',function(e){var r=s.getBoundingClientRect();
      f.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));
      f.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3));});
    s.addEventListener('mouseleave',function(){f.style.setProperty('--mx',0);f.style.setProperty('--my',0);});
  });
}
})();
