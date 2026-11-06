/* Shared helpers — PEDA Secret Santa 2026 */
const ORGANISER_EMAIL = "enrique.ezquerra@eursc.eu";
const EVENT = { date:"Thursday 17 December 2026", time:"12:15", place:"Lunch area -1", budget:"€20 maximum", deadline:"Friday 13 November",
  start:new Date("2026-12-17T12:15:00+01:00"), startUTC:"2026-12-17T11:15:00Z", endUTC:"2026-12-17T13:00:00Z",
  subject:"PEDA Secret Santa – lunch & gift exchange 🎁",
  body:"Lunch together and Secret Santa gift exchange with the Pedagogical Development Unit. Don't forget your gift (max €20)!" };

const $ = s => document.querySelector(s);
const el = (t,a={},...kids)=>{const e=document.createElement(t);for(const[k,v]of Object.entries(a)){if(k==="class")e.className=v;else if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else if(v!==false&&v!=null)e.setAttribute(k,v===true?"":v)}for(const c of kids.flat()){if(c==null||c==="")continue;e.append(c.nodeType?c:document.createTextNode(c))}return e};

/* ---- crypto (AES-GCM, key travels only inside personal links / organiser key) ---- */
const b64u = {
  enc: buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""),
  dec: s => { s=s.replace(/-/g,"+").replace(/_/g,"/"); while(s.length%4) s+="="; return Uint8Array.from(atob(s),c=>c.charCodeAt(0)); }
};
async function importKey(k){ return crypto.subtle.importKey("raw", b64u.dec(k), "AES-GCM", false, ["encrypt","decrypt"]); }
async function decryptJSON(key, blob){ const b=b64u.dec(blob); const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:b.slice(0,12)}, key, b.slice(12)); return JSON.parse(new TextDecoder().decode(pt)); }
async function encryptJSON(key, obj){ const iv=crypto.getRandomValues(new Uint8Array(12)); const ct=await crypto.subtle.encrypt({name:"AES-GCM",iv}, key, new TextEncoder().encode(JSON.stringify(obj))); const out=new Uint8Array(12+ct.byteLength); out.set(iv); out.set(new Uint8Array(ct),12); return b64u.enc(out); }
async function loadRoster(k){ const key=await importKey(k); const r=await decryptJSON(key, ROSTER_ENC); return {key, people:r.people, byKey:Object.fromEntries(r.people.map(p=>[p.key,p]))}; }

function avatar(p, cls="av"){ return p.photo ? el("img",{class:cls,src:p.photo,alt:p.first}) : el("div",{class:cls+" init"},p.first[0]+p.last[0]); }

/* ---- calendar ---- */
function outlookLink(){ const q=new URLSearchParams({path:"/calendar/action/compose",rru:"addevent",subject:EVENT.subject,startdt:EVENT.startUTC,enddt:EVENT.endUTC,location:EVENT.place,body:EVENT.body}); return "https://outlook.office.com/calendar/0/deeplink/compose?"+q.toString(); }
function icsUrl(){ const f=d=>d.replace(/[-:]/g,"").replace(/\.\d+/,""); const esc=t=>t.replace(/([,;\\])/g,"\\$1");
  const ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//PEDA//Secret Santa//EN","METHOD:PUBLISH","BEGIN:VEVENT","UID:peda-secret-santa-2026@eursc","DTSTAMP:"+f(new Date().toISOString()),
    "DTSTART:"+f(EVENT.startUTC),"DTEND:"+f(EVENT.endUTC),"SUMMARY:"+esc(EVENT.subject),"LOCATION:"+esc(EVENT.place),"DESCRIPTION:"+esc(EVENT.body),
    "BEGIN:VALARM","TRIGGER:-P1D","ACTION:DISPLAY","DESCRIPTION:Secret Santa tomorrow – bring your gift!","END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
  return URL.createObjectURL(new Blob([ics],{type:"text/calendar"})); }
function calendarBlock(){
  return el("div",{style:"margin-top:22px;display:flex;flex-direction:column;align-items:center;gap:8px"},
    el("div",{style:"font-weight:700"},`Save the date: Thu 17 Dec · ${EVENT.time} · ${EVENT.place}`),
    el("div",{style:"display:flex;gap:10px;flex-wrap:wrap;justify-content:center"},
      el("a",{class:"btn small",href:outlookLink(),target:"_blank",rel:"noopener"},"📅 Add to Outlook"),
      el("a",{class:"btn ghost small",href:icsUrl(),download:"PEDA-Secret-Santa.ics"},"📅 Download .ics (Outlook desktop)")));
}
function infoBlock(){
  const dl=el("dl");
  for(const[k,v] of [["Date",EVENT.date],["Time",EVENT.time],["Place",EVENT.place],["Gift budget",EVENT.budget],["Sign up by",EVENT.deadline]]) dl.append(el("dt",{},k),el("dd",{},v));
  const c=el("div",{class:"count"});
  const tick=()=>{const ms=EVENT.start-new Date(); if(ms<=0){c.replaceChildren(el("div",{},el("b",{},"🎄"),el("span",{},"It's today!")));return;}
    const d=Math.floor(ms/864e5),h=Math.floor(ms/36e5)%24,mi=Math.floor(ms/6e4)%60;
    c.replaceChildren(...[[d,"days"],[h,"hours"],[mi,"min"]].map(([n,l])=>el("div",{},el("b",{},String(n)),el("span",{},l))));};
  tick(); setInterval(tick,30000);
  return el("section",{class:"card info"},el("h3",{style:"font-size:20px;margin-bottom:10px"},"The big day"),dl,c);
}

/* ---- effects ---- */
function snow(){ const c=$("#snow"); if(!c) return; const x=c.getContext("2d"); let W,H,f=[];
  const size=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;f=Array.from({length:Math.round(W/12)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.2+.6,s:Math.random()*.6+.25,d:Math.random()*6}))};
  size(); addEventListener("resize",size);
  (function loop(){x.clearRect(0,0,W,H);x.fillStyle="rgba(255,255,255,.75)";for(const p of f){p.y+=p.s;p.d+=.01;p.x+=Math.sin(p.d)*.3;if(p.y>H){p.y=-4;p.x=Math.random()*W}x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()}requestAnimationFrame(loop)})(); }
function confetti(){ const c=$("#confetti"),x=c.getContext("2d");c.width=innerWidth;c.height=innerHeight;
  const cols=["#c8323b","#e3b55b","#17453a","#fbf6ec","#1f5a4b"];
  const ps=Array.from({length:160},()=>({x:innerWidth/2,y:innerHeight/2.2,vx:(Math.random()-.5)*14,vy:Math.random()*-14-4,r:Math.random()*6+3,c:cols[Math.random()*5|0],a:Math.random()*6}));
  let t=0;(function loop(){x.clearRect(0,0,c.width,c.height);for(const p of ps){p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.a+=.2;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r/2,-p.r/4,p.r,p.r/2);x.restore()}if(++t<140)requestAnimationFrame(loop);else x.clearRect(0,0,c.width,c.height)})(); }

/* ---- intro video ---- */
function setupIntro(){
  const box=$("#intro"), v=$("#introVideo"), play=$("#introPlay"), skip=$("#introSkip"); if(!box) return;
  const close=()=>{box.classList.add("hide");try{v.pause();}catch(e){}try{localStorage.setItem("peda-santa-intro","1");}catch(e){}};
  const start=()=>{v.muted=false;v.currentTime=0;v.play().catch(()=>{v.muted=true;v.play().catch(()=>{});});play.textContent="Enter 🎁";play.onclick=close;};
  window.openIntro=()=>{box.classList.remove("hide");v.currentTime=0;play.textContent="▶ Play with sound";play.classList.remove("enter");play.onclick=start;};
  play.onclick=start; skip.onclick=close; v.addEventListener("ended",()=>play.classList.add("enter"));
}
