const model=JSON.parse(document.querySelector('#experience-data').textContent);
const header=document.querySelector('.site-header');
const menuToggle=document.querySelector('#menu-toggle');
const mobileMenu=document.querySelector('#mobile-menu');
function setMenuOpen(open){header.classList.toggle('menu-open',open);menuToggle.setAttribute('aria-expanded',String(open));}
menuToggle.addEventListener('click',()=>setMenuOpen(menuToggle.getAttribute('aria-expanded')!=='true'));
mobileMenu.addEventListener('click',event=>{if(event.target.closest('a'))setMenuOpen(false);});
addEventListener('keydown',event=>{if(event.key==='Escape')setMenuOpen(false);});
let goal=0;
function selectGoal(index){goal=(index+model.objectives.length)%model.objectives.length;const g=model.objectives[goal];document.querySelectorAll('[data-goal]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.goal)===goal)));document.querySelector('#goal-number').textContent='0'+(goal+1);document.querySelector('#goal-title').textContent=g.title;document.querySelector('#goal-text').textContent=g.description;}
document.querySelectorAll('[data-goal]').forEach(b=>b.addEventListener('click',()=>selectGoal(Number(b.dataset.goal))));document.querySelector('[data-goal-prev]').addEventListener('click',()=>selectGoal(goal-1));document.querySelector('[data-goal-next]').addEventListener('click',()=>selectGoal(goal+1));
let stage=0;
function selectStage(index){stage=(index+model.stages.length)%model.stages.length;const s=model.stages[stage];document.querySelectorAll('[data-stage]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.stage)===stage)));document.querySelector('#stage-number').textContent='Peringkat '+(stage+1)+':';document.querySelector('#stage-title').textContent=s.title;document.querySelector('#stage-description').textContent=s.description;}
document.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>selectStage(Number(b.dataset.stage))));document.querySelector('[data-stage-prev]').addEventListener('click',()=>selectStage(stage-1));document.querySelector('[data-stage-next]').addEventListener('click',()=>selectStage(stage+1));
let ticking=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function updateScroll(){const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;header.classList.toggle('scrolled',y>80);document.querySelector('.header-progress').style.transform=`scaleX(${max>0?Math.min(1,y/max):0})`;if(!reduced.matches&&y<innerHeight*1.4)document.querySelector('.arrival-background img').style.transform=`scale(1.03) translateY(${Math.min(y*.12,120)}px)`;ticking=false;}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll);}},{passive:true});updateScroll();

const cityFocus=document.querySelectorAll('[data-focus-city]');
const cityRings=document.querySelectorAll('[data-city]');
function selectCity(city){cityFocus.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.focusCity===city)));cityRings.forEach(ring=>{ring.dataset.active=String(ring.dataset.city===city);ring.setAttribute('aria-pressed',String(ring.dataset.city===city));});}
cityFocus.forEach(button=>button.addEventListener('click',()=>selectCity(button.dataset.focusCity)));
