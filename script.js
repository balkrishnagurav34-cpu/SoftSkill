/* ---------- content ---------- */
const PLN=['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune'];
const skills=[
 ["Communication","Speak clearly, listen fully.","Say your main point in one sentence first, then add details. Ask one follow-up question before you reply.",90],
 ["Leadership & Teamwork","Guide the team, win together.","Clarify who does what and by when. Give people the why behind a task, and celebrate a teammate’s win out loud.",85],
 ["Personality Development","Build confidence and presence.","Fix one small habit each week: posture, eye contact or a calm tone. Write down three wins every night.",80],
 ["Public Speaking","Own the stage.","Open with a story or a question, keep to three key points, and rehearse out loud twice before you present.",88],
 ["Resume Builder","Turn your story into a one-page pitch.","Start each bullet with an action verb and add a number. Keep it to one page and tailor it to every job.",92],
 ["LinkedIn Profile Optimisation","Be found by the right recruiters.","Write a headline with your role plus key skills, use a clear photo, and fill About with a short story and keywords.",84],
 ["HR Interview Preparation","Answer with clarity, not panic.","Prepare a 60-second “tell me about yourself”. Use the STAR method (Situation, Task, Action, Result) for every example.",90],
 ["Project Skills","Plan, build and present real work.","Break a project into small milestones. Keep a simple progress log and finish with a short demo of what you learned.",78]
];
const grid=document.getElementById('grid');
const cards=[];
if(grid)skills.forEach((s,i)=>{
  const d=document.createElement('div');d.className='card';d.tabIndex=0;d.setAttribute('role','button');d.style.setProperty('--w',s[3]+'%');
  d.innerHTML='<div class="pn">STOP '+String(i+1).padStart(2,'0')+' · '+PLN[i].toUpperCase()+'</div><h4>'+s[0].toUpperCase()+'</h4><p class="p">'+s[1]+'</p><div class="tip">'+s[2]+'</div><div class="bar"><i></i></div>';
  const go=()=>{d.scrollIntoView({behavior:'smooth',block:'center'});blip(880)};
  d.onclick=go;d.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}};
  d.onmouseenter=()=>blip(660,.03);
  grid.appendChild(d);cards.push(d);
});
/* ---------- shared layout: header + footer on every page ---------- */
const page=document.body.dataset.page;
const isHome=page==='home';
const NAV=[['home','Home','index.html#home'],['about','About Us','index.html#about'],['skills','Skills','index.html#skills'],['review','Review','review.html'],['contact','Contact','index.html#contact']];
const hdr=document.createElement('header');
hdr.innerHTML='<a class="brand" href="'+(isHome?'#home':'index.html')+'"><span class="lg">🪐</span><h1>Skillverse <span>by Mohit Sir</span></h1></a>'
 +'<button id="menu" aria-label="Menu" aria-expanded="false">☰</button>'
 +'<nav id="nav">'+NAV.map(n=>'<a data-s="'+n[0]+'" href="'+(isHome?n[2].replace('index.html',''):n[2])+'">'+n[1]+'</a>').join('')+'</nav>';
document.body.insertBefore(hdr,document.body.firstChild);

function fbHTML(full){
 return '<div class="frow"><input name="n" placeholder="Your name" maxlength="60" autocomplete="name" aria-label="Your name">'
 +(full?'<input name="e" type="email" placeholder="Email (optional, never shown)" maxlength="100" autocomplete="email" aria-label="Email">':'')+'</div>'
 +'<div class="stars" role="group" aria-label="Rating"><span>Your rating</span>'+[1,2,3,4,5].map(i=>'<button type="button" data-v="'+i+'" aria-label="'+i+' star'+(i>1?'s':'')+'" aria-pressed="false">★</button>').join('')+'</div>'
 +'<textarea name="m" rows="'+(full?5:3)+'" maxlength="500" placeholder="Write your feedback..." aria-label="Your feedback"></textarea>'
 +'<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'
 +'<div class="frow"><button class="btn" type="submit">Send Feedback</button><p class="fstat" role="status"></p></div>';
}
const ft=document.createElement('footer');
ft.innerHTML='<div class="ffb"><div><h4>SHARE YOUR <span>FEEDBACK</span></h4><p>Tell us how Skillverse helped you. Your feedback appears on the Review page.</p><a href="'+'review.html">Read all reviews →</a></div><form class="fbform" novalidate>'+fbHTML(false)+'</form></div>'
 +'<div class="fgrid">'
 +'<div><h4>Skillverse <span>BY MOHIT SIR</span></h4><p>Build the people skills that careers are made of.</p></div>'
 +'<div><h4>QUICK LINKS</h4>'+NAV.map(n=>'<a href="'+(isHome?n[2].replace('index.html',''):n[2])+'">'+n[1]+'</a>').join('')+'<a href="feedback.html">Give Feedback</a></div>'
 +'<div><h4>CONTACT</h4><p>📧 pathakmohit0463@gmail.com</p><p>📞 +91 7972390509</p><p>📍 Hadpser Pune</p></div></div>'
 +'<div class="fbar">©2026 BG Tech. All Rights Reserved.Developed with ❤️ by Balkrishna Gurav 🚀 · <a href="'+(isHome?'#home':'#')+'" id="totop">Back to top ↑</a></div>';
document.querySelector('main').after(ft);
document.getElementById('totop').onclick=e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'})};

/* ---------- feedback: save + load (Google Sheet, or this browser as a fallback) ---------- */
const LKEY='ssReviews';
function localList(){try{return JSON.parse(localStorage.getItem(LKEY)||'[]')}catch(e){return[]}}
async function saveFeedback(d){
 const rec={time:new Date().toISOString(),name:d.name,email:d.email||'',rating:d.rating,message:d.message};
 if(SHEET_URL){
  await fetch(SHEET_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(rec)});
 }else{
  const l=localList();l.unshift({time:rec.time,name:rec.name,rating:rec.rating,message:rec.message});
  localStorage.setItem(LKEY,JSON.stringify(l.slice(0,200)));
 }
}
const CKEY='ssContacts';
async function saveContact(d){
 const rec={type:'contact',time:new Date().toISOString(),name:d.name,email:d.email,phone:d.phone,message:d.message};
 if(SHEET_URL){
  await fetch(SHEET_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(rec)});
  return true;
 }
 let l=[];try{l=JSON.parse(localStorage.getItem(CKEY)||'[]')}catch(e){}
 l.unshift(rec);localStorage.setItem(CKEY,JSON.stringify(l.slice(0,200)));
 return false;
}
async function loadReviews(){
 if(SHEET_URL){const r=await fetch(SHEET_URL);const j=await r.json();if(!j.ok)throw new Error('bad response');return j.reviews||[]}
 return localList();
}
function wireForm(f){
 let rating=0;const st=f.querySelector('.fstat'),btns=[...f.querySelectorAll('.stars button')],sb=f.querySelector('button[type=submit]');
 const msg=(t,ok)=>{st.textContent=t;st.className='fstat '+(ok?'ok':'err')};
 const paint=()=>btns.forEach(x=>{const on=+x.dataset.v<=rating;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
 btns.forEach(b=>b.onclick=()=>{rating=+b.dataset.v;paint()});
 f.onsubmit=async ev=>{
  ev.preventDefault();
  const g=n=>f.elements[n]?f.elements[n].value.trim():'';
  if(g('website')){msg('Thank you!',true);return}
  const d={name:g('n'),email:g('e'),rating,message:g('m')};
  if(!d.name)return msg('Please enter your name.',false);
  if(!rating)return msg('Please choose a star rating.',false);
  if(d.message.length<3)return msg('Please write a short message.',false);
  if(d.email&&!/^\S+@\S+\.\S+$/.test(d.email))return msg('Please enter a valid email or leave it empty.',false);
  sb.disabled=true;msg('Sending…',true);
  try{await saveFeedback(d);f.reset();rating=0;paint();msg('Thank you! Your feedback has been saved.',true)}
  catch(err){msg('Could not send right now. Please try again.',false)}
  sb.disabled=false;
 };
}
wireForm(ft.querySelector('form'));
const host=document.getElementById('fbhost');
if(host){host.innerHTML=fbHTML(true);wireForm(host)}

/* ---------- review page ---------- */
const rl=document.getElementById('rlist');
if(rl){
 const sum=document.getElementById('rsum'),note=document.getElementById('rnote');
 if(!SHEET_URL)note.hidden=false;
 const say2=t=>{rl.textContent='';const p=document.createElement('p');p.className='dimmsg';p.textContent=t;rl.appendChild(p)};
 const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
 loadReviews().then(list=>{
  if(!list.length){sum.textContent='';say2('No reviews yet. Be the first to share your feedback!');return}
  const avg=list.reduce((a,r)=>a+(+r.rating||0),0)/list.length;
  sum.textContent=avg.toFixed(1)+' ★ average · '+list.length+(list.length>1?' reviews':' review');
  rl.textContent='';
  list.forEach(r=>{
   const c=document.createElement('article');c.className='panel rv';
   const top=document.createElement('div');top.className='rtop';
   const nm=document.createElement('h4');nm.textContent=r.name;
   const n=Math.max(0,Math.min(5,Math.round(+r.rating||0)));
   const sr=document.createElement('span');sr.className='rs';sr.textContent=stars(n);sr.setAttribute('aria-label',n+' out of 5');
   top.append(nm,sr);
   const p=document.createElement('p');p.textContent=r.message;
   const dt=document.createElement('small'),d=new Date(r.time);dt.textContent=isNaN(d)?'':d.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
   c.append(top,p,dt);rl.appendChild(c);
  });
 }).catch(()=>say2('Could not load reviews right now. Please try again later.'));
}

/* ---------- nav behaviour ---------- */
const nav=document.getElementById('nav');
const navLinks=[...nav.querySelectorAll('a')];
const mark=k=>navLinks.forEach(a=>a.classList.toggle('on',a.dataset.s===k));
if(isHome){
 const secs=['home','about','skills','contact'].map(id=>document.getElementById(id));
 const spy=()=>{let cur='home';secs.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.4)cur=s.id});mark(cur)};
 addEventListener('scroll',spy);spy();
}else mark(page);
const menuBtn=document.getElementById('menu');
menuBtn.onclick=()=>menuBtn.setAttribute('aria-expanded',nav.classList.toggle('open'));
navLinks.forEach(a=>a.onclick=()=>{nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');blip(740,.05)});
const cf=document.getElementById('cf');
if(cf){
 const st=cf.querySelector('.fstat'),sb=cf.querySelector('button[type=submit]');
 const msg=(t,ok)=>{st.textContent=t;st.className='fstat '+(ok?'ok':'err')};
 cf.onsubmit=async ev=>{
  ev.preventDefault();
  const g=n=>cf.elements[n]?cf.elements[n].value.trim():'';
  if(g('website')){msg('Thank you!',true);return}
  const d={name:g('n'),email:g('e'),phone:g('p'),message:g('m')};
  const digits=d.phone.replace(/[\s\-().]/g,'');
  if(!d.name)return msg('Please enter your name.',false);
  if(!d.email&&!d.phone)return msg('Please add an email or a phone number so we can reach you.',false);
  if(d.email&&!/^\S+@\S+\.\S+$/.test(d.email))return msg('Please enter a valid email.',false);
  if(d.phone&&!/^\+?\d{7,15}$/.test(digits))return msg('Please enter a valid phone number (7 to 15 digits).',false);
  sb.disabled=true;msg('Sending…',true);
  try{const shared=await saveContact(d);cf.reset();msg(shared?'Thank you! Your contact has been saved. We will get back to you soon.':'Saved in this browser (demo mode). Add your Google Sheet link in config.js to receive contacts.',true)}
  catch(err){msg('Could not send right now. Please try again.',false)}
  sb.disabled=false;
 };
}

/* ---------- audio (synthesized) ---------- */
let ctx,master;
let lb=0;
function blip(f,v){if(!ctx||ctx.state==='closed')return;const n=performance.now();if(n-lb<80)return;lb=n;
 const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain(),lp=ctx.createBiquadFilter(),F=f||700;
 o.type='sine';o.frequency.setValueAtTime(F,t);o.frequency.exponentialRampToValueAtTime(F*1.5,t+.07);
 lp.type='lowpass';lp.frequency.value=2400;
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(Math.min(v||.12,.14),t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+.22);
 o.connect(lp);lp.connect(g);g.connect(master);o.start(t);o.stop(t+.25)}
function liteAudio(){if(ctx)return;try{ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.8;const c=ctx.createDynamicsCompressor();master.connect(c);c.connect(ctx.destination)}catch(e){}}
document.addEventListener('click',e=>{if(!ctx)liteAudio();if(e.target.closest('button,a,.card'))blip(700,.1)});
function launchAudio(){
 try{
  ctx=new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume().catch(()=>{});master=ctx.createGain();master.gain.value=.8;
  const comp=ctx.createDynamicsCompressor();master.connect(comp);comp.connect(ctx.destination);
  const t=ctx.currentTime;
  const dl=ctx.createDelay(1);dl.delayTime.value=.32;const fb=ctx.createGain();fb.gain.value=.38;const wet=ctx.createGain();wet.gain.value=.35;
  dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(comp);
  const tone=(f,s,du,v,type)=>{const o=ctx.createOscillator(),g=ctx.createGain(),l=ctx.createBiquadFilter();o.type=type||'sine';o.frequency.value=f;l.type='lowpass';l.frequency.value=2200;
   g.gain.setValueAtTime(.0001,t+s);g.gain.linearRampToValueAtTime(v,t+s+du*.35);g.gain.exponentialRampToValueAtTime(.0001,t+s+du);
   o.connect(l);l.connect(g);g.connect(master);g.connect(dl);o.start(t+s);o.stop(t+s+du+.1)};
  [110,164.8,220,329.6,493.9].forEach((f,i)=>{tone(f,0,6.5,.05-.004*i,'sine');tone(f*1.005,0,6.5,.03,'triangle')});
  const len=ctx.sampleRate*6,buf=ctx.createBuffer(1,len,ctx.sampleRate),dd=buf.getChannelData(0);let b=0;
  for(let i=0;i<len;i++){b=.97*b+.03*(Math.random()*2-1);dd[i]=b*5}
  const n=ctx.createBufferSource();n.buffer=buf;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(200,t);lp.frequency.exponentialRampToValueAtTime(2600,t+3.9);lp.frequency.exponentialRampToValueAtTime(250,t+6);
  const ng=ctx.createGain();ng.gain.setValueAtTime(.0001,t);ng.gain.linearRampToValueAtTime(.35,t+3.8);ng.gain.exponentialRampToValueAtTime(.0001,t+6);
  n.connect(lp);lp.connect(ng);ng.connect(master);n.start(t);
  const sw=ctx.createOscillator();sw.type='sine';sw.frequency.setValueAtTime(90,t);sw.frequency.exponentialRampToValueAtTime(700,t+3.9);
  const sg=ctx.createGain();sg.gain.setValueAtTime(.0001,t);sg.gain.linearRampToValueAtTime(.12,t+3.7);sg.gain.exponentialRampToValueAtTime(.0001,t+4.2);
  sw.connect(sg);sg.connect(master);sg.connect(dl);sw.start(t);sw.stop(t+4.3);
  const b2=ctx.createOscillator();b2.type='sine';b2.frequency.setValueAtTime(90,t+3.95);b2.frequency.exponentialRampToValueAtTime(40,t+5.2);
  const bg=ctx.createGain();bg.gain.setValueAtTime(.0001,t+3.95);bg.gain.linearRampToValueAtTime(.55,t+4.02);bg.gain.exponentialRampToValueAtTime(.0001,t+5.4);
  b2.connect(bg);bg.connect(master);b2.start(t+3.95);b2.stop(t+5.5);
  [523.25,659.25,783.99,987.77,1318.5].forEach((f,i)=>tone(f,4.05+i*.18,2.2,.1,'sine'));
  [0,1.3,2.7].forEach((k,i)=>tone([440,523.25,659.25][i],k,.7,.12,'sine'));
 }catch(e){}
}


/* ---------- procedural textures ---------- */
const rnd=Math.random;
function cvs(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function tex(c){const t=new THREE.CanvasTexture(c);return t}
function bands(pal){const c=cvs(512,256),x=c.getContext('2d');x.fillStyle=pal[0];x.fillRect(0,0,512,256);
 for(let y=0;y<256;){const h=3+rnd()*16;x.globalAlpha=.55;x.fillStyle=pal[(rnd()*pal.length)|0];x.fillRect(0,y,512,h);y+=h}
 x.globalAlpha=.08;for(let i=0;i<260;i++){x.fillStyle=rnd()<.5?'#000':'#fff';x.beginPath();x.ellipse(rnd()*512,rnd()*256,8+rnd()*30,2+rnd()*5,0,0,6.3);x.fill()}
 return tex(c)}
function rock(base){const c=cvs(512,256),x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,512,256);
 for(let i=0;i<700;i++){const r=1+rnd()*12;x.globalAlpha=.1+rnd()*.15;x.fillStyle=rnd()<.6?'#000':'#fff';x.beginPath();x.arc(rnd()*512,rnd()*256,r,0,6.3);x.fill()}
 return tex(c)}
function earth(){const c=cvs(512,256),x=c.getContext('2d');x.fillStyle='#14509f';x.fillRect(0,0,512,256);
 for(let k=0;k<14;k++){const cx=rnd()*512,cy=40+rnd()*176;x.fillStyle=rnd()<.7?'#2f8a3c':'#8a7b45';
  for(let i=0;i<26;i++){x.globalAlpha=.9;x.beginPath();x.arc(cx+(rnd()-.5)*70,cy+(rnd()-.5)*36,6+rnd()*14,0,6.3);x.fill()}}
 x.fillStyle='#eef6ff';x.globalAlpha=.9;x.fillRect(0,0,512,14);x.fillRect(0,242,512,14);
 x.globalAlpha=.35;for(let i=0;i<90;i++){x.beginPath();x.ellipse(rnd()*512,rnd()*256,10+rnd()*40,3+rnd()*8,0,0,6.3);x.fill()}
 return tex(c)}
function sunTex(){const c=cvs(512,256),x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#ff9a1a');g.addColorStop(.5,'#ffd25a');g.addColorStop(1,'#ff9a1a');x.fillStyle=g;x.fillRect(0,0,512,256);
 for(let i=0;i<500;i++){x.globalAlpha=.12;x.fillStyle=rnd()<.5?'#c53b00':'#fff3b0';x.beginPath();x.arc(rnd()*512,rnd()*256,3+rnd()*16,0,6.3);x.fill()}
 return tex(c)}
function glowTex(r,g,b,s){const c=cvs(256,256),x=c.getContext('2d'),gr=x.createRadialGradient(128,128,4,128,128,128);
 gr.addColorStop(0,`rgba(${r},${g},${b},${s})`);gr.addColorStop(.4,`rgba(${r},${g},${b},${s*.3})`);gr.addColorStop(1,`rgba(${r},${g},${b},0)`);x.fillStyle=gr;x.fillRect(0,0,256,256);return tex(c)}
function atmo(r,col,k){return new THREE.Mesh(new THREE.SphereGeometry(r*k,32,32),new THREE.ShaderMaterial({uniforms:{c:{value:new THREE.Color(col)}},vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform vec3 c;varying vec3 n;void main(){float i=pow(.72-dot(n,vec3(0.,0.,1.)),3.);gl_FragColor=vec4(c,1.)*i;}',side:THREE.BackSide,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}))}
function label(t){const c=cvs(256,64),x=c.getContext('2d');x.font='600 30px Orbitron,sans-serif';x.fillStyle='rgba(200,230,255,.95)';x.textAlign='center';x.fillText(t.toUpperCase(),128,42);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(c),transparent:true,depthTest:false,opacity:.7}));s.scale.set(9,2.25,1);return s}

/* ---------- scene ---------- */
const cv=document.getElementById('c');
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new THREE.Scene();S.background=new THREE.Color(0x01020a);
const cam=new THREE.PerspectiveCamera(60,1,.1,3500);S.add(cam);

// stars, two colours
[[0xffffff,3000],[0xaad4ff,800],[0xffd9a0,600]].forEach(([col,n])=>{const p=new Float32Array(n*3);
 for(let i=0;i<n;i++){const r=600+rnd()*1200,a=rnd()*6.283,b=Math.acos(2*rnd()-1);p[i*3]=r*Math.sin(b)*Math.cos(a);p[i*3+1]=r*Math.sin(b)*Math.sin(a);p[i*3+2]=r*Math.cos(b)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
 S.add(new THREE.Points(g,new THREE.PointsMaterial({color:col,size:1.7,sizeAttenuation:false})))});
// nebula clouds
[[120,60,255],[40,160,255],[255,70,140],[60,220,200],[160,90,255]].forEach((c,i)=>{
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(c[0],c[1],c[2],.55),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:.45}));
 const a=i*1.3+.5;s.position.set(Math.cos(a)*900,(rnd()-.5)*500,Math.sin(a)*900);s.scale.set(1100,1100,1);S.add(s)});

// warp streaks
const NS=600,sp=new Float32Array(NS*6),sx=[],sy=[],sz=[];
for(let i=0;i<NS;i++){const a=rnd()*6.283,r=3+rnd()*55;sx.push(Math.cos(a)*r);sy.push(Math.sin(a)*r);sz.push(-rnd()*300)}
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
const sm=new THREE.LineBasicMaterial({color:0xaeeaff,transparent:true,opacity:0});
const streaks=new THREE.LineSegments(sg,sm);streaks.frustumCulled=false;cam.add(streaks);

// sun + corona
const sun=new THREE.Mesh(new THREE.SphereGeometry(7,64,64),new THREE.MeshBasicMaterial({map:sunTex(),color:0xcc9a66}));S.add(sun);
const glow1=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(255,190,80,.45),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));glow1.scale.set(50,50,1);sun.add(glow1);
const glow2=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(255,120,30,.2),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));glow2.scale.set(110,110,1);sun.add(glow2);
S.add(new THREE.PointLight(0xffe8c0,1.6,0,0));S.add(new THREE.AmbientLight(0x3a4a70,.8));
// sun light rays
const rays=(function(){const c=cvs(512,512),x=c.getContext('2d');x.translate(256,256);for(let i=0;i<28;i++){x.rotate(6.283/28);const g=x.createLinearGradient(0,0,256,0);g.addColorStop(0,'rgba(255,210,120,.55)');g.addColorStop(1,'rgba(255,160,60,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,-3-rnd()*5);x.lineTo(256*(.5+rnd()*.5),0);x.lineTo(0,3+rnd()*5);x.fill()}
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(c),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:.28}));s.scale.set(95,95,1);sun.add(s);return s})();
// twinkling stars
const tn=500,tp=new Float32Array(tn*3),tph=new Float32Array(tn);for(let i=0;i<tn;i++){const r=300+rnd()*900,a=rnd()*6.283,b=Math.acos(2*rnd()-1);tp[i*3]=r*Math.sin(b)*Math.cos(a);tp[i*3+1]=r*Math.sin(b)*Math.sin(a);tp[i*3+2]=r*Math.cos(b);tph[i]=rnd()*6.28}
const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.BufferAttribute(tp,3));tg.setAttribute('ph',new THREE.BufferAttribute(tph,1));
const tw=new THREE.ShaderMaterial({uniforms:{t:{value:0}},vertexShader:'attribute float ph;uniform float t;varying float a;void main(){a=.3+.7*sin(t*2.+ph);gl_PointSize=3.+6.*a;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying float a;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(1.,.95,.85,a*(1.-d*2.));}',transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
S.add(new THREE.Points(tg,tw));
// shooting stars
const shoot=[];for(let i=0;i<3;i++){const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(-60,9,0)]);const m=new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0});const l=new THREE.Line(g,m);l.frustumCulled=false;S.add(l);shoot.push({l,m,t:-1-i*2,d:1.2})}
// wormhole tunnel (3D rings flying past during warp)
const tun=new THREE.Group();cam.add(tun);const tr=[];
for(let i=0;i<22;i++){const m=new THREE.MeshBasicMaterial({color:new THREE.Color().setHSL(.5+i*.02,.9,.6),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
 const r=new THREE.Mesh(new THREE.TorusGeometry(12+(i%3)*2,.14,8,72),m);r.position.z=-i*14;tun.add(r);tr.push({r,m})}
// arrival shockwave
const shock=new THREE.Mesh(new THREE.RingGeometry(.9,1,96),new THREE.MeshBasicMaterial({color:0x9fe8ff,transparent:true,opacity:0,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));shock.rotation.x=-Math.PI/2;S.add(shock);

// planets
const defs=[
 ['Mercury',1.1,14,()=>rock('#9a9084'),null],
 ['Venus',1.7,19,()=>bands(['#e8c27a','#d9a85e','#f0d49a','#c99a5a']),0xffb060],
 ['Earth',1.9,26,earth,0x4da6ff],
 ['Mars',1.4,33,()=>rock('#c1502e'),0xff7a50],
 ['Jupiter',4.2,47,()=>bands(['#d9a86c','#b9835a','#efd9b4','#9c6b45','#f3e6cc']),0xffcf90],
 ['Saturn',3.6,61,()=>bands(['#e6cf94','#d4b878','#f2e3b8','#c9a96a']),0xffe3a0],
 ['Uranus',2.5,73,()=>bands(['#7fe0e8','#9aeef2','#6cd0da']),0x7fe8ff],
 ['Neptune',2.4,84,()=>bands(['#3f5fe0','#2f4fd0','#5a7bff','#2a40b0']),0x5f7fff]
];
const pls=[];let moonPiv;
defs.forEach((d,i)=>{
 const piv=new THREE.Object3D();piv.rotation.y=rnd()*6.283;S.add(piv);
 const g=new THREE.Object3D();g.position.x=d[2];piv.add(g);
 const m=new THREE.Mesh(new THREE.SphereGeometry(d[1],48,48),new THREE.MeshStandardMaterial({map:d[3](),roughness:.85,metalness:.02}));g.add(m);
 if(d[4])g.add(atmo(d[1],d[4],1.28));
 const lb=label(d[0]);lb.position.y=d[1]+3.2;g.add(lb);
 if(d[0]==='Saturn'){
  const inn=d[1]*1.4,out=d[1]*2.5,rg=new THREE.RingGeometry(inn,out,128,1),pos=rg.attributes.position,uv=rg.attributes.uv,v=new THREE.Vector3();
  for(let k=0;k<pos.count;k++){v.fromBufferAttribute(pos,k);uv.setXY(k,(v.length()-inn)/(out-inn),1)}
  const c=cvs(256,2),x=c.getContext('2d');for(let k=0;k<256;k++){x.fillStyle=`rgba(${200+rnd()*40|0},${175+rnd()*40|0},${120+rnd()*30|0},${(k>90&&k<100)?.05:.45+rnd()*.5})`;x.fillRect(k,0,1,2)}
  const ring=new THREE.Mesh(rg,new THREE.MeshBasicMaterial({map:tex(c),side:THREE.DoubleSide,transparent:true}));ring.rotation.x=Math.PI/2.2;g.add(ring)}
 if(d[0]==='Earth'){moonPiv=new THREE.Object3D();g.add(moonPiv);const mo=new THREE.Mesh(new THREE.SphereGeometry(.5,24,24),new THREE.MeshStandardMaterial({map:rock('#b5b5b5'),roughness:1}));mo.position.x=3.6;moonPiv.add(mo)}
 const ring=new THREE.Mesh(new THREE.RingGeometry(d[2]-.07,d[2]+.07,160),new THREE.MeshBasicMaterial({color:0x6fa0ff,side:THREE.DoubleSide,transparent:true,opacity:.3}));ring.rotation.x=-Math.PI/2;S.add(ring);
 pls.push({piv,m,g,w:.75/Math.sqrt(d[2])})});

// asteroid belt
const belt=(function(){const n=2200,p=new Float32Array(n*3);for(let i=0;i<n;i++){const a=rnd()*6.283,r=38+rnd()*5;p[i*3]=Math.cos(a)*r;p[i*3+1]=(rnd()-.5)*1.6;p[i*3+2]=Math.sin(a)*r}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));const o=new THREE.Points(g,new THREE.PointsMaterial({color:0xa09886,size:1.6,sizeAttenuation:false}));S.add(o);return o})();

function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
addEventListener('resize',size);size();
let px=0,py=0;const cg=document.getElementById('cg'),ip=document.getElementById('intro');addEventListener('pointermove',e=>{px=e.clientX/innerWidth-.5;py=e.clientY/innerHeight-.5;cg.style.left=e.clientX+'px';cg.style.top=e.clientY+'px';if(ip){ip.style.setProperty('--px',px);ip.style.setProperty('--py',py)}});

/* ---------- scroll-driven planet traversal (works on scroll down and scroll up) ---------- */
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const skillsEl=document.getElementById('skills');
const V0=new THREE.Vector3(),V1=new THREE.Vector3(),FOC=new THREE.Vector3(),FP=new THREE.Vector3(),LK=new THREE.Vector3();
let fidx=0,tIdx=0,tW=0,fw=0,lastK=-1;
let hud=null;
if(cards.length){hud=document.createElement('div');hud.id='hud';hud.setAttribute('aria-hidden','true');document.body.appendChild(hud)}
function calcFocus(){
 if(!cards.length||!skillsEl)return;
 const mid=innerHeight*.5,c=cards.map(el=>{const r=el.getBoundingClientRect();return r.top+r.height/2});
 let idx;
 if(mid<=c[0])idx=0;
 else if(mid>=c[c.length-1])idx=c.length-1;
 else{let i=0;while(mid>c[i+1])i++;idx=i+(mid-c[i])/(c[i+1]-c[i])}
 tIdx=idx;
 const sr=skillsEl.getBoundingClientRect();
 tW=Math.max(0,Math.min(1,Math.min(innerHeight*.75-sr.top,sr.bottom-innerHeight*.25)/(innerHeight*.35)));
 const k=Math.round(idx);
 if(k!==lastK){lastK=k;cards.forEach((el,i)=>el.classList.toggle('act',i===k));if(hud)hud.textContent='◉ NOW VISITING · '+PLN[k].toUpperCase()+' — '+skills[k][0].toUpperCase();blip(520+k*70,.05)}
 if(hud)hud.classList.toggle('show',tW>.3);
}
addEventListener('scroll',calcFocus,{passive:true});addEventListener('resize',calcFocus);
calcFocus();setTimeout(calcFocus,600);setTimeout(calcFocus,2200);

/* ---------- loop ---------- */
let started=0,ang=0,last=performance.now(),entered=false;
const skip=!document.getElementById('intro')||document.documentElement.classList.contains('skip');
if(skip){entered=true;setTimeout(()=>document.body.classList.add('in'),60)}
const BASE=105,TOT=5200;
function frame(now){
 const dt=Math.min((now-last)/1000,.05);last=now;
 sun.rotation.y+=dt*.08;const pl=1+Math.sin(now*.0015)*.04;glow1.scale.set(50*pl,50*pl,1);glow2.scale.set(110/pl,110/pl,1);
 pls.forEach(p=>{p.piv.rotation.y+=p.w*dt;p.m.rotation.y+=dt*.5});
 moonPiv.rotation.y+=dt*1.2;belt.rotation.y+=dt*.02;
 tw.uniforms.t.value=now*.001;rays.material.rotation+=dt*.05;
 const wv=started?Math.max(0,1-(now-started)/TOT*1.3):0;
 tun.visible=wv>.02;if(tun.visible){tr.forEach((o,i)=>{o.r.position.z+=dt*(120+260*wv);if(o.r.position.z>5)o.r.position.z-=308;o.r.rotation.z+=dt*(.5+i*.03);o.m.opacity=Math.min(.75,wv*1.3)*(1-Math.min(1,-o.r.position.z/320))})}
 if(started){const k=(now-started-3950)/1800;if(k>0&&k<1){shock.material.opacity=.8*(1-k);shock.scale.setScalar(5+k*170)}else shock.material.opacity=0}
 shoot.forEach(s=>{s.t+=dt;if(s.t>s.d){s.t=-rnd()*6;s.d=1+rnd()*.8;s.l.position.set((rnd()-.5)*600,60+rnd()*200,(rnd()-.5)*600);s.l.rotation.set(0,rnd()*6.28,0)}if(s.t>0){s.l.translateX(320*dt);s.l.translateY(-50*dt);s.m.opacity=1-s.t/s.d}else s.m.opacity=0});
 ang+=dt*(.045+(started?Math.max(0,1-(now-started)/TOT*1.3)*1.2:0));
 let p=started?Math.min(1,(now-started)/TOT):(skip?1:0);
 const e=1-Math.pow(1-p,3),warp=started?Math.max(0,1-p*1.3):0;
 fidx+=(tIdx-fidx)*Math.min(1,dt*3.5);
 fw+=((p>=1&&!RM?tW:0)-fw)*Math.min(1,dt*2.5);
 const r=BASE*(.28+.72*e),h=(26+Math.min(scrollY,1500)*.012)*(.35+.65*e);
 cam.position.set(Math.sin(ang+px*.4)*r,h+py*10*e,Math.cos(ang+px*.4)*r);
 if(fw>.003){
  S.updateMatrixWorld();
  const i0=Math.max(0,Math.min(7,Math.floor(fidx))),i1=Math.min(7,i0+1),f=Math.max(0,Math.min(1,fidx-i0));
  pls[i0].g.getWorldPosition(V0);pls[i1].g.getWorldPosition(V1);
  // glide along the orbits (never through the Sun): blend orbit radius and take the short way round
  const R0=Math.hypot(V0.x,V0.z),R1=Math.hypot(V1.x,V1.z),a0=Math.atan2(V0.x,V0.z);
  let da=Math.atan2(V1.x,V1.z)-a0;da-=6.2832*Math.round(da/6.2832);
  const R=R0+(R1-R0)*f,an=a0+da*f;
  FOC.set(Math.sin(an)*R,0,Math.cos(an)*R);
  const rad=defs[i0][1]*(1-f)+defs[i1][1]*f,dist=rad*3.2+6,ox=Math.sin(an),oz=Math.cos(an);
  FP.set(FOC.x-ox*dist*.7-oz*dist*.7,rad*.6+1.2,FOC.z-oz*dist*.7+ox*dist*.7);
  const k=fw*fw*(3-2*fw);
  cam.position.lerp(FP,k);LK.copy(FOC).multiplyScalar(k);cam.lookAt(LK);
  if(innerWidth>innerHeight*1.1)cam.translateX(-dist*.42*k);else cam.translateY(-dist*.28*k);
 }else cam.lookAt(0,0,0);
 if(warp>.05){cam.position.x+=(rnd()-.5)*warp*.6;cam.position.y+=(rnd()-.5)*warp*.6}
 cam.rotateZ(warp*(.5*Math.sin(now*.002)+.25));
 cam.fov=60+50*warp;cam.updateProjectionMatrix();
 sm.opacity=Math.min(1,warp*1.4);
 if(warp>0){const L=55*warp;
  for(let i=0;i<NS;i++){sz[i]+=dt*300*(.3+warp);if(sz[i]>0)sz[i]=-300;
   const o=i*6;sp[o]=sx[i];sp[o+1]=sy[i];sp[o+2]=sz[i];sp[o+3]=sx[i];sp[o+4]=sy[i];sp[o+5]=sz[i]-L}
  sg.attributes.position.needsUpdate=true}
 R.render(S,cam);requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

const wt=document.getElementById('wt');
function say(t){wt.textContent=t;wt.classList.remove('show');void wt.offsetWidth;wt.classList.add('show')}
function startLaunch(){
 if(entered)return;entered=true;
 try{sessionStorage.setItem('ssIn','1')}catch(e){}
 launchAudio();started=performance.now();
 document.getElementById('intro').classList.add('gone');
 say('ENGINES ONLINE');
 setTimeout(()=>say('WARP DRIVE ENGAGED'),1300);
 setTimeout(()=>say('ENTERING Skillverse GALAXY'),2700);
 setTimeout(()=>{document.getElementById('flash').classList.add('go');document.body.classList.add('in')},4000);
}
/* auto-launch: 5-second countdown, then the warp sequence runs and lands on Home */
const cdEl=document.getElementById('cd');
if(cdEl&&!skip){
 let n=5;
 const show=v=>{cdEl.textContent=v;cdEl.classList.remove('tick');void cdEl.offsetWidth;cdEl.classList.add('tick')};
 show(n);
 const tick=()=>{n--;show(n);if(n<=0)startLaunch();else setTimeout(tick,1000)};
 setTimeout(tick,1000);
}
