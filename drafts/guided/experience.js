const model=JSON.parse(document.querySelector('#experience-data').textContent);
const header=document.querySelector('.site-header'),menuButton=document.querySelector('#menu-toggle'),mobileMenu=document.querySelector('#mobile-menu');
function closeMenu(){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');}
menuButton.addEventListener('click',()=>{mobileMenu.hidden=!mobileMenu.hidden;menuButton.setAttribute('aria-expanded',String(!mobileMenu.hidden));});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const spaces={iman:{title:'Ruang Ibadah',label:'Mekah · Iman',text:model.pillars[0].focus},ilmu:{title:'Serambi Ilmu',label:'Keilmuan · Pendidikan',text:model.objectives[3].description},muafakat:{title:'Laman Muafakat',label:'Madinah · Muafakat',text:model.pillars[1].focus},sejahtera:{title:'Ruang Khidmat',label:'Baitul Maqdis · Sejahtera',text:model.pillars[2].focus},sahabat:{title:'Sahabat Masjid',label:'Sepuluh peranan · Satu gerakan',text:'Penyertaan masyarakat mengikut kepakaran dan keperluan kariah. Setiap bakat ada tempat untuk menyumbang.'}};
document.querySelectorAll('[data-space]').forEach(b=>b.addEventListener('click',()=>{
 const id=b.dataset.space,s=spaces[id];document.querySelectorAll('[data-space]').forEach(other=>other.setAttribute('aria-pressed',String(other.dataset.space===id)));
 document.querySelector('#space-eyebrow').textContent=s.label;document.querySelector('#space-title').textContent=s.title;document.querySelector('#space-description').textContent=s.text;
 const link=document.querySelector('#space-link');link.href='#'+id;link.textContent='Melangkah ke '+s.title+' ↗';
}));
let goal=0;
function selectGoal(index){goal=(index+5)%5;const g=model.objectives[goal];document.querySelectorAll('[data-goal]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.goal)===goal)));document.querySelector('#goal-number').textContent='0'+(goal+1);document.querySelector('#goal-title').textContent=g.title;document.querySelector('#goal-text').textContent=g.description;}
document.querySelectorAll('[data-goal]').forEach(b=>b.addEventListener('click',()=>selectGoal(Number(b.dataset.goal))));
document.querySelector('[data-goal-prev]').addEventListener('click',()=>selectGoal(goal-1));document.querySelector('[data-goal-next]').addEventListener('click',()=>selectGoal(goal+1));
document.querySelectorAll('[data-role]').forEach(b=>b.addEventListener('click',()=>{
 const p=model.portfolios.find(p=>p.id===b.dataset.role);document.querySelectorAll('[data-role]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));
 document.querySelector('#role-title').textContent='Sahabat '+p.title;document.querySelector('#role-description').textContent=p.description;
 const ul=document.querySelector('#role-areas');ul.replaceChildren();p.areas.forEach(a=>{const li=document.createElement('li');li.textContent=a;ul.append(li);});
 if(innerWidth<650)document.querySelector('.role-story').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
}));
let stage=0;
function selectStage(index){stage=(index+4)%4;const s=model.stages[stage];document.querySelectorAll('[data-stage]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.stage)===stage)));document.querySelector('#stage-number').textContent='PERINGKAT 0'+(stage+1);document.querySelector('#stage-title').textContent=s.title;document.querySelector('#stage-description').textContent=s.description;}
document.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>selectStage(Number(b.dataset.stage))));document.querySelector('[data-stage-prev]').addEventListener('click',()=>selectStage(stage-1));document.querySelector('[data-stage-next]').addEventListener('click',()=>selectStage(stage+1));
const walkLinks=[...document.querySelectorAll('.walk-nav a')];
const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){walkLinks.forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-20% 0px -55% 0px'});
walkLinks.forEach(a=>{const el=document.querySelector(a.hash);if(el)observer.observe(el);});
let ticking=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function updateScroll(){const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;header.classList.toggle('scrolled',y>80);document.querySelector('.header-progress').style.transform=`scaleX(${max>0?Math.min(1,y/max):0})`;if(!reduced.matches&&y<innerHeight*1.4)document.querySelector('.arrival-background img').style.transform=`scale(1.03) translateY(${Math.min(y*.12,120)}px)`;ticking=false;}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll);}},{passive:true});updateScroll();
