const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('nav');
menuBtn?.addEventListener('click',()=>{nav.style.display=nav.style.display==='flex'?'none':'flex';nav.style.position='absolute';nav.style.top='78px';nav.style.left='0';nav.style.right='0';nav.style.padding='25px';nav.style.background='#090909';nav.style.flexDirection='column';nav.style.alignItems='center';});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{if(innerWidth<=800)nav.style.display='none'}));


// Cinematic floating embers — no image/video required
const emberLayer = document.getElementById("embers");
if (emberLayer) {
  const count = window.innerWidth < 700 ? 45 : 90;
  for (let i = 0; i < count; i++) {
    const e = document.createElement("span");
    e.className = "ember";
    e.style.left = Math.random() * 100 + "%";
    e.style.top = (65 + Math.random() * 45) + "%";
    e.style.setProperty("--drift", ((Math.random() - .5) * 180) + "px");
    e.style.animationDuration = (7 + Math.random() * 11) + "s";
    e.style.animationDelay = (-Math.random() * 14) + "s";
    e.style.opacity = (0.25 + Math.random() * .7).toFixed(2);
    const size = (1 + Math.random() * 3.2).toFixed(1);
    e.style.width = size + "px";
    e.style.height = size + "px";
    emberLayer.appendChild(e);
  }
}

// Cursor movement/parallax effect removed.

// Multi-page style event interface
const eventTabs = document.querySelectorAll(".event-tab");
const eventPanels = document.querySelectorAll(".event-panel");

eventTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    eventTabs.forEach(t => t.classList.remove("active"));
    eventPanels.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.category)?.classList.add("active");
  });
});
