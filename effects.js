/* ALE performance-safe interaction engine */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer:fine)').matches;

  const style = document.createElement('style');
  style.id = 'ale-performance-effects';
  style.textContent = `
    :root{--ale-c1:#70f4e2;--ale-c2:#9c8cff;--ale-gold:#ffcf70}
    .ale-progress{position:fixed;top:0;left:0;width:var(--scroll-progress,0%);height:2px;z-index:10000;pointer-events:none;background:linear-gradient(90deg,var(--ale-c1),var(--ale-c2),var(--ale-gold));}
    .ale-vignette{position:fixed;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(circle at 50% 35%,transparent 28%,rgba(0,0,0,.10) 72%,rgba(0,0,0,.28));}
    .ale-ribbon{position:fixed;width:38vw;height:8vw;min-width:240px;border-radius:50%;border:1px solid rgba(112,244,226,.08);pointer-events:none;z-index:0;opacity:.7;animation:aleRibbon 18s ease-in-out infinite alternate;}
    .ale-ribbon.r1{top:10%;left:-12%;transform:rotate(-10deg)}.ale-ribbon.r2{right:-12%;bottom:12%;transform:rotate(15deg);animation-delay:-9s;border-color:rgba(156,140,255,.08)}
    .ale-spark{position:fixed;width:2px;height:2px;border-radius:50%;background:#fff0bb;box-shadow:0 0 6px rgba(255,220,140,.6);pointer-events:none;z-index:1;animation:aleSpark var(--dur) linear infinite;contain:layout paint;}
    .ale-click-ring{position:fixed;width:16px;height:16px;border:1px solid var(--ale-c1);border-radius:50%;pointer-events:none;z-index:10003;transform:translate(-50%,-50%);animation:aleClick .45s ease-out forwards;}
    .ripple{position:absolute!important;width:10px!important;height:10px!important;border-radius:50%!important;background:rgba(255,255,255,.38)!important;transform:translate(-50%,-50%) scale(0)!important;animation:aleRipple .5s ease-out forwards!important;pointer-events:none!important;z-index:5!important;}
    .btn,.buttons a,button,.menu-btn,.event-tab{position:relative;isolation:isolate;overflow:hidden;}
    .btn::after,.buttons a::after,button::after,.event-tab::after{content:'';position:absolute;inset:0;background:linear-gradient(115deg,transparent 44%,rgba(255,255,255,.12) 50%,transparent 56%);transform:translateX(-120%);transition:transform .45s ease;pointer-events:none;z-index:2;}
    .btn:hover::after,.buttons a:hover::after,button:hover::after,.event-tab:hover::after{transform:translateX(120%)}
    @keyframes aleRibbon{from{translate:-2vw 0;rotate:-2deg}to{translate:7vw 3vh;rotate:5deg}}
    @keyframes aleSpark{0%{opacity:0;transform:translateY(25px)}15%{opacity:.55}80%{opacity:.2}100%{opacity:0;transform:translate(var(--sx),-110px)}}
    @keyframes aleRipple{to{transform:translate(-50%,-50%) scale(22)!important;opacity:0}}
    @keyframes aleClick{to{width:70px;height:70px;opacity:0}}
    @media(max-width:800px){.ale-ribbon{opacity:.35}.ale-spark{display:none}}
    @media(prefers-reduced-motion:reduce){.ale-ribbon,.ale-spark{display:none!important}}
  `;
  document.head.appendChild(style);

  const progress=document.createElement('div'); progress.className='ale-progress'; document.body.appendChild(progress);
  const vignette=document.createElement('div'); vignette.className='ale-vignette'; document.body.appendChild(vignette);

  let ticking=false;
  const update=()=>{
    ticking=false;
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    document.documentElement.style.setProperty('--scroll-progress',`${Math.min(100,scrollY/max*100)}%`);
  };
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  addEventListener('resize',update,{passive:true}); update();

  if(!reduce){
    const r1=document.createElement('div'); r1.className='ale-ribbon r1'; document.body.appendChild(r1);
    const r2=document.createElement('div'); r2.className='ale-ribbon r2'; document.body.appendChild(r2);
    if(innerWidth > 700){
      const count=12;
      for(let i=0;i<count;i++){
        const s=document.createElement('i'); s.className='ale-spark';
        s.style.left=Math.random()*100+'vw'; s.style.top=(30+Math.random()*65)+'vh';
        s.style.setProperty('--sx',(-50+Math.random()*100)+'px'); s.style.setProperty('--dur',(5+Math.random()*5)+'s');
        s.style.animationDelay=(-Math.random()*7)+'s'; document.body.appendChild(s);
      }
    }
  }

  // Lightweight click feedback only; no cursor tracking, tilt, spotlight, or per-frame DOM work.
  document.addEventListener('click',e=>{
    const target=e.target.closest('.btn,.buttons a,button,.menu-btn,.event-tab,.navbar a,header a');
    if(!target || reduce) return;
    const b=target.getBoundingClientRect();
    const ripple=document.createElement('span'); ripple.className='ripple';
    ripple.style.left=(e.clientX-b.left)+'px'; ripple.style.top=(e.clientY-b.top)+'px'; target.appendChild(ripple);
    setTimeout(()=>ripple.remove(),520);
    if(fine){const ring=document.createElement('span'); ring.className='ale-click-ring'; ring.style.left=e.clientX+'px'; ring.style.top=e.clientY+'px'; document.body.appendChild(ring); setTimeout(()=>ring.remove(),480);}
  },{passive:true});

  // Ensure videos resume correctly after browser back/forward cache restores.
  addEventListener('pageshow',()=>document.querySelectorAll('video').forEach(v=>{if(!v.paused) return; v.play().catch(()=>{});}));
  addEventListener('pagehide',()=>document.querySelectorAll('video').forEach(v=>{v.pause();}));
})();
