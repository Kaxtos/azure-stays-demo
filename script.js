/* Azure Stays Cyprus - interactive demo (client-side, data saved in this browser) */
const site=document.querySelector('#site'),login=document.querySelector('#login'),dash=document.querySelector('#dashboard');
const show=x=>{[site,login,dash].forEach(v=>v.classList.add('hide'));x.classList.remove('hide');scrollTo(0,0)};
document.querySelectorAll('.login').forEach(b=>b.onclick=()=>{show(login);location.hash='login'});
document.addEventListener('click',e=>{if(e.target.closest('.back')){show(site);location.hash='home';renderSite()}});
document.querySelector('#loginform').onsubmit=e=>{e.preventDefault();show(dash);location.hash='dashboard';renderAll()};

/* ---------- helpers ---------- */
const TODAY='2026-09-20',CUR='2026-09',KEY='azureStaysDemo.v2',CLEAN_COST=58,FEE=0.15;
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONL=['January','February','March','April','May','June','July','August','September','October','November','December'];
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dt=s=>new Date(s+'T12:00:00');
const iso=d=>{const p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())};
const nights=(a,b)=>Math.round((dt(b)-dt(a))/864e5);
const money=n=>'€'+Math.round(n).toLocaleString('en-GB');
const fd=s=>{const d=dt(s);return d.getDate()+' '+MON[d.getMonth()]};
const range=(a,b)=>{const x=dt(a),y=dt(b);return x.getMonth()===y.getMonth()?x.getDate()+'-'+y.getDate()+' '+MON[y.getMonth()]:fd(a)+'-'+fd(b)};
const ymLabel=ym=>MONL[+ym.slice(5)-1]+' '+ym.slice(0,4);
const inMonth=(s,ym)=>s&&s.slice(0,7)===ym;

/* ---------- data ---------- */
function seed(){
  const B=(prop,guest,ref,start,end,guests,total,status='CONFIRMED')=>({id:ref,prop,guest,ref,start,end,guests,total,status,type:'guest'});
  const C=(prop,date,time,note,assignee,status,type='Turnover clean')=>({id:'c'+prop+date,prop,date,time,type,note,assignee,status});
  const I=(prop,title,desc,vendor,date,cost,status,priority='Normal')=>({id:'i'+prop+date,prop,title,desc,vendor,date,cost,status,priority});
  return{current:'vt',seq:1070,
  properties:[
    {id:'vt',name:'Villa Thalassa',area:'Coral Bay, Paphos',guests:6,beds:3,rate:240,img:'images/p1.jpg',rating:4.92,reviews:38,tag:'SEA VIEW',
     history:{'2026-04':{gross:5200,clean:174,maint:0},'2026-05':{gross:6800,clean:232,maint:140},'2026-06':{gross:8560,clean:232,maint:104},'2026-07':{gross:10100,clean:290,maint:65},'2026-08':{gross:9200,clean:290,maint:20}}},
    {id:'oh',name:'The Olive House',area:'Polis, Paphos',guests:4,beds:2,rate:185,img:'images/p2.jpg',rating:4.87,reviews:21,tag:'GUEST FAVOURITE',
     history:{'2026-04':{gross:2960,clean:116,maint:0},'2026-05':{gross:4070,clean:174,maint:0},'2026-06':{gross:5550,clean:232,maint:60},'2026-07':{gross:6290,clean:232,maint:0},'2026-08':{gross:6475,clean:232,maint:45}}}
  ],
  bookings:[
    B('vt','Markus Hoffmann','AZ-1031','2026-09-01','2026-09-05',2,1040),
    B('vt','Anna Georgiou','AZ-1036','2026-09-05','2026-09-11',5,1840),
    B('vt',"Liam O'Brien",'AZ-1039','2026-09-12','2026-09-15',2,1050),
    B('vt','Chloé Martin','AZ-1044','2026-09-16','2026-09-21',4,1280),
    B('vt','Elena Rossi','AZ-1048','2026-09-22','2026-09-27',4,1320),
    B('vt','James Walker','AZ-1052','2026-09-28','2026-10-05',6,1890),
    B('vt','Sofia Becker','AZ-1061','2026-10-08','2026-10-14',3,1460,'DEPOSIT PAID'),
    B('oh','Hannah Schmidt','AZ-1033','2026-09-03','2026-09-08',2,925),
    B('oh','Nikos Pavlou','AZ-1040','2026-09-10','2026-09-14',3,740),
    B('oh','Ruth Cohen','AZ-1046','2026-09-18','2026-09-23',2,925),
    B('oh','Mateo Ruiz','AZ-1058','2026-10-02','2026-10-06',4,740)
  ],
  cleans:[
    C('vt','2026-09-01','11:00','Before Markus Hoffmann','Maria K.','done'),
    C('vt','2026-09-05','11:00','After Markus Hoffmann · Before Anna Georgiou','Maria K.','done'),
    C('vt','2026-09-11','11:00','After Anna Georgiou','Eleni S.','done'),
    C('vt','2026-09-15','11:00',"After Liam O'Brien · Before Chloé Martin",'Maria K.','done'),
    C('vt','2026-09-21','11:00','After Chloé Martin · Before Elena Rossi','Eleni S.','assigned'),
    C('vt','2026-09-27','11:30','After Elena Rossi · Before James Walker · Linen, pool area, welcome pack','Maria K.','assigned'),
    C('vt','2026-10-05','11:00','After James Walker · Next check-in 8 Oct · Linen, deep kitchen, inventory','','scheduled'),
    C('oh','2026-09-08','11:00','After Hannah Schmidt','Eleni S.','done'),
    C('oh','2026-09-14','11:00','After Nikos Pavlou','Eleni S.','done'),
    C('oh','2026-09-23','11:00','After Ruth Cohen','Christos P.','assigned'),
    C('oh','2026-10-06','11:00','After Mateo Ruiz','','scheduled')
  ],
  issues:[
    I('vt','Pool pump inspection','Reduced pressure noticed during weekly service.','BlueWave Pools','2026-09-23',120,'in progress'),
    I('vt','Air-con annual service','Preventive service for all six indoor units.','CoolAir Paphos','2026-10-02',210,'scheduled'),
    I('vt','Garden irrigation repair','Replaced damaged line beside west terrace.','Green Island','2026-09-14',85,'completed'),
    I('oh','Terrace umbrella replacement','Wind damage to the large terrace umbrella.','Polis Outdoor','2026-09-25',95,'scheduled'),
    I('oh','Shower mixer tap replaced','Dripping tap in the main bathroom.','Paphos Plumbing','2026-09-09',60,'completed')
  ]};
}
let S;
try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!S||!S.properties)S=seed();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Could not save in this browser (storage full) - changes last until you reload.')}};
const nid=p=>p+(++S.seq);
const P=()=>S.properties.find(p=>p.id===S.current)||S.properties[0];
const mine=list=>list.filter(x=>x.prop===P().id);
function bStatus(b){if(b.status==='CANCELLED')return'CANCELLED';if(b.end<=TODAY)return'COMPLETED';if(b.start<=TODAY)return'IN HOUSE';return b.status}
const upcomingBookings=pid=>S.bookings.filter(b=>b.prop===pid&&b.status!=='CANCELLED'&&b.start>TODAY);
const openIssues=pid=>S.issues.filter(i=>i.prop===pid&&i.status!=='completed');

function statement(pid,ym){
  const p=S.properties.find(x=>x.id===pid);
  if(ym!==CUR){const h=(p.history||{})[ym];if(!h)return null;const fee=Math.round(h.gross*FEE);return{ym,gross:h.gross,fee,clean:h.clean,maint:h.maint,net:h.gross-fee-h.clean-h.maint,bookings:null,cleans:Math.round(h.clean/CLEAN_COST),archived:true}}
  const bk=S.bookings.filter(b=>b.prop===pid&&b.type==='guest'&&b.status!=='CANCELLED'&&inMonth(b.start,ym)).sort((a,b)=>a.start<b.start?-1:1);
  const gross=bk.reduce((s,b)=>s+(+b.total||0),0),fee=Math.round(gross*FEE);
  const cl=S.cleans.filter(c=>c.prop===pid&&c.status==='done'&&inMonth(c.date,ym));
  const mt=S.issues.filter(i=>i.prop===pid&&i.status==='completed'&&inMonth(i.date,ym));
  const clean=cl.length*CLEAN_COST,maint=mt.reduce((s,i)=>s+(+i.cost||0),0);
  return{ym,gross,fee,clean,maint,net:gross-fee-clean-maint,bookings:bk,cleans:cl.length,maintItems:mt};
}
function occupancy(pid,ym){
  const [y,m]=ym.split('-').map(Number),days=new Date(y,m,0).getDate(),start=ym+'-01',end=iso(new Date(y,m,1,12));
  let n=0;S.bookings.filter(b=>b.prop===pid&&b.status!=='CANCELLED').forEach(b=>{const a=b.start>start?b.start:start,z=b.end<end?b.end:end;if(z>a)n+=nights(a,z)});
  return{n,days,pct:Math.floor(n/days*100)};
}

/* ---------- UI plumbing ---------- */
let tabNow='overview';
function tab(id){tabNow=id;document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('nav [data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));scrollTo(0,0)}
document.addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(t){tab(t.dataset.tab)}});
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),3200)}
function modal(title,body,submit,onSubmit,extra=''){
  $('#modalBody').innerHTML=`<h3>${title}</h3><form id="mform" novalidate>${body}<p class="merr"></p><div class="mact">${extra}<button type="button" class="outline" data-action="close">Cancel</button>${submit?`<button class="primary">${submit}</button>`:''}</div></form>`;
  $('#modal').classList.remove('hide');
  const f=$('#mform');const first=f.querySelector('input:not([type=hidden]),select,textarea');if(first)setTimeout(()=>first.focus(),30);
  f.onsubmit=async e=>{e.preventDefault();if(!onSubmit)return closeModal();const data=Object.fromEntries(new FormData(f));let err;try{err=await onSubmit(data,f)}catch(x){err='Something went wrong: '+x.message}if(err){f.querySelector('.merr').textContent=err}else closeModal()};
}
function closeModal(){$('#modal').classList.add('hide');$('#modalBody').innerHTML=''}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
function download(name,blob){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
function readImg(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,900/im.width),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.78))};im.onerror=()=>rej(new Error('that file is not an image'));im.src=r.result};r.onerror=()=>rej(new Error('could not read file'));r.readAsDataURL(file)})}
const opt=(v,cur,label)=>`<option value="${esc(v)}"${String(v)===String(cur)?' selected':''}>${esc(label??v)}</option>`;
const field=(label,html,wide)=>`<label class="f${wide?' wide':''}"><span>${label}</span>${html}</label>`;

/* ---------- render ---------- */
function renderAll(){renderChrome();renderOverview();renderProperties();renderBookings();renderCleaning();renderMaintenance();renderStatements();tab(tabNow)}
function renderChrome(){
  const p=P(),opts=S.properties.map(x=>opt(x.id,p.id,x.name)).join('');
  document.querySelectorAll('.propSelect').forEach(s=>s.innerHTML=opts);
  $('#propArea').textContent=p.area;
  $('#nProps').textContent=S.properties.length;
  const u=upcomingBookings(p.id).length,o=openIssues(p.id).length,c=S.cleans.filter(x=>x.prop===p.id&&x.status!=='done'&&x.date>=TODAY).length;
  $('#nBook').textContent=u||'';$('#nMaint').textContent=o||'';$('#nClean').textContent=c||'';
}
function renderOverview(){
  const p=P(),st=statement(p.id,CUR),oc=occupancy(p.id,CUR),bk=st.bookings,nt=bk.reduce((s,b)=>s+nights(b.start,b.end),0);
  const months=['2026-04','2026-05','2026-06','2026-07','2026-08',CUR],vals=months.map(m=>m===CUR?st.gross:((p.history||{})[m]?.gross||0)),max=Math.max(...vals,1),ytd=vals.reduce((a,b)=>a+b,0);
  const ev=[];
  S.bookings.filter(b=>b.prop===p.id&&b.status!=='CANCELLED'&&b.start>=TODAY).forEach(b=>ev.push({date:b.start,k:b.type==='owner'?'OWNER STAY':'CHECK-IN',t:b.type==='owner'?'Owner stay · '+nights(b.start,b.end)+' nights':b.guest+' · '+nights(b.start,b.end)+' nights',s:b.guests+' guests · Booking #'+b.ref,time:'15:00',act:`data-action="booking" data-id="${b.id}"`}));
  S.cleans.filter(c=>c.prop===p.id&&c.status!=='done'&&c.date>=TODAY).forEach(c=>ev.push({date:c.date,k:'CLEANING',t:c.type,s:c.assignee?'Assigned to '+c.assignee:'Team pending',time:c.time,act:'data-tab="cleaning"'}));
  S.issues.filter(i=>i.prop===p.id&&i.status!=='completed'&&i.date>=TODAY).forEach(i=>ev.push({date:i.date,k:'MAINTENANCE',t:i.title,s:i.vendor||'Contractor to be assigned',time:'09:00',act:'data-tab="maintenance"'}));
  ev.sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0);
  $('#overview').innerHTML=`<div class="notice">✓　 <b>Your September statement is ready.</b> ${st.bookings.length} stays, ${money(st.gross)} gross revenue. <button data-tab="statements">View statement →</button></div>
  <div class="stats"><article><small>NET REVENUE · SEP</small><b>${money(st.net)}</b><p>after ${money(st.fee+st.clean+st.maint)} in fees & expenses</p></article><article><small>OCCUPANCY</small><b>${oc.pct}%</b><p>${oc.n} of ${oc.days} nights booked</p></article><article><small>AVG. NIGHTLY RATE</small><b>${nt?money(st.gross/nt):money(p.rate)}</b><p>${nt?'across '+bk.length+' stays this month':'listed rate · no stays yet'}</p></article><article><small>GUEST RATING　${p.rating?'★★★★★':''}</small><b>${p.rating?p.rating.toFixed(2):'New'}</b><p>${p.reviews?'from '+p.reviews+' guest reviews':'no reviews yet'}</p></article></div>
  <div class="quick"><button class="outline" data-action="add-booking">+ Add booking</button><button class="outline" data-action="add-clean">+ Request clean</button><button class="outline" data-action="add-issue">+ Report an issue</button><button class="outline" data-action="pdf" data-ym="${CUR}">↓ September statement</button><button class="outline" data-action="add-property">+ Add property</button></div>
  <div class="twocol"><article class="panel"><small>REVENUE PERFORMANCE · ${esc(p.name.toUpperCase())}</small><h3>${money(ytd)} <span>this year</span></h3><div class="chart">${vals.map((v,i)=>`<i style="height:${Math.max(3,Math.round(v/max*95))}%" title="${MON[i+3]}: ${money(v)}"></i>`).join('')}</div><div class="months">APR　　MAY　　JUN　　JUL　　AUG　　SEP</div></article>
  <article class="panel schedule"><small>UP NEXT</small><h3>Property schedule</h3>${ev.slice(0,4).map(e=>{const d=dt(e.date);return`<div class="clickable" ${e.act}><b>${d.getDate()}<br><small>${MON[d.getMonth()].toUpperCase()}</small></b><p><em>${e.k}</em><strong>${esc(e.t)}</strong><span>${esc(e.s)}</span></p><time>${esc(e.time)}</time></div>`}).join('')||'<p class="empty">Nothing scheduled yet. Add a booking to get started.</p>'}</article></div>`;
}
function renderProperties(){
  $('#properties').innerHTML=`<div class="pagetitle"><div><small>PORTFOLIO</small><h2>Properties</h2></div><button class="primary" data-action="add-property">+ Add property</button></div>
  <div class="propgrid">${S.properties.map(p=>{const st=statement(p.id,CUR),oc=occupancy(p.id,CUR);return`<article class="panel pcard${p.id===S.current?' cur':''}"><div class="pimg"><img src="${esc(p.img)}" alt="${esc(p.name)}"><span>${esc(p.tag||'NEW')}</span></div><h3>${esc(p.name)}</h3><p>${esc(p.area)} · ${p.guests} guests · ${p.beds} bedroom${p.beds==1?'':'s'} · ${money(p.rate)}/night</p><div class="pstats"><span><b>${money(st.gross)}</b>Sep revenue</span><span><b>${oc.pct}%</b>occupancy</span><span><b>${upcomingBookings(p.id).length}</b>upcoming</span><span><b>${openIssues(p.id).length}</b>open issues</span></div><div class="pact"><button class="primary" data-action="open-property" data-id="${p.id}">${p.id===S.current?'Viewing':'Open dashboard'}</button><button class="outline" data-action="edit-property" data-id="${p.id}">Edit</button></div></article>`}).join('')}
  <button class="panel addcard" data-action="add-property"><b>+</b>Add a property<small>Takes under a minute</small></button></div>`;
}
let bq='',bf='all';
function renderBookings(){
  $('#bookings').innerHTML=`<div class="pagetitle"><div><small>RESERVATIONS · ${esc(P().name.toUpperCase())}</small><h2>Bookings</h2></div><div class="btns"><button class="outline" data-action="csv">↓ Export CSV</button><button class="primary" data-action="add-booking">+ Add booking</button></div></div>
  <div class="toolbar"><input id="bsearch" placeholder="Search guest or booking #" value="${esc(bq)}"><select id="bfilter">${opt('all',bf,'All bookings')}${opt('upcoming',bf,'Upcoming')}${opt('IN HOUSE',bf,'In house')}${opt('COMPLETED',bf,'Completed')}${opt('CANCELLED',bf,'Cancelled')}</select></div>
  <div class="panel table"><table><thead><tr><th>Guest</th><th>Stay</th><th>Nights</th><th>Guests</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody id="btbody"></tbody></table></div><p class="hint">Click a booking to view details, change its status or cancel it.</p>`;
  renderBookingRows();
  $('#bsearch').oninput=e=>{bq=e.target.value;renderBookingRows()};
  $('#bfilter').onchange=e=>{bf=e.target.value;renderBookingRows()};
}
function renderBookingRows(){
  const q=bq.trim().toLowerCase();
  let list=mine(S.bookings).sort((a,b)=>a.start<b.start?1:-1);
  list=list.filter(b=>{const s=bStatus(b);if(bf==='upcoming'&&!(b.start>TODAY&&s!=='CANCELLED'))return false;if(bf!=='all'&&bf!=='upcoming'&&s!==bf)return false;return !q||(b.guest+' '+b.ref).toLowerCase().includes(q)});
  $('#btbody').innerHTML=list.map(b=>{const s=bStatus(b);return`<tr class="clickable" data-action="booking" data-id="${b.id}"><td><b>${esc(b.guest)}</b><small>#${esc(b.ref)}</small></td><td>${range(b.start,b.end)}</td><td>${nights(b.start,b.end)}</td><td>${b.guests}</td><td>${b.type==='owner'?'-':money(b.total)}</td><td><em class="s-${s.replace(/\s/g,'-').toLowerCase()}">${s}</em></td><td class="chev">›</td></tr>`}).join('')||`<tr><td colspan="7" class="empty">No bookings match. <a href="#" data-action="add-booking">Add one →</a></td></tr>`;
}
function renderCleaning(){
  const list=mine(S.cleans).sort((a,b)=>a.date<b.date?-1:1),up=list.filter(c=>c.status!=='done'),done=list.filter(c=>c.status==='done').reverse();
  const card=c=>`<article class="panel"><em class="s-${c.status}">${c.status==='done'?'DONE':c.assignee?'ASSIGNED':'SCHEDULED'}</em><h3>${fd(c.date).toUpperCase()} · ${esc(c.type)}</h3><p>${esc(c.note||'-')}</p><hr><b>${esc(c.assignee||'Team pending')}</b><p>${esc(c.time)}${c.status==='done'?' · '+money(CLEAN_COST)+' charged to statement':''}</p>${c.status!=='done'?`<div class="cact"><button class="outline sm" data-action="assign-clean" data-id="${c.id}">${c.assignee?'Reassign':'Assign cleaner'}</button><button class="primary sm" data-action="done-clean" data-id="${c.id}">✓ Mark done</button></div>`:''}</article>`;
  $('#cleaning').innerHTML=`<div class="pagetitle"><div><small>PROPERTY CARE · ${esc(P().name.toUpperCase())}</small><h2>Cleaning schedule</h2></div><button class="primary" data-action="add-clean">+ Request clean</button></div>
  <h4 class="sub">Upcoming (${up.length})</h4><div class="cards">${up.map(card).join('')||'<p class="empty">No cleans scheduled.</p>'}</div>
  <h4 class="sub">Completed (${done.length})</h4><div class="cards">${done.slice(0,4).map(card).join('')||'<p class="empty">None yet.</p>'}</div>`;
}
function renderMaintenance(){
  const order={'in progress':0,scheduled:1,reported:2,completed:3};
  const list=mine(S.issues).sort((a,b)=>order[a.status]-order[b.status]||(a.date<b.date?-1:1));
  $('#maintenance').innerHTML=`<div class="pagetitle"><div><small>PROPERTY CARE · ${esc(P().name.toUpperCase())}</small><h2>Maintenance</h2></div><button class="primary" data-action="add-issue">+ Report an issue</button></div>
  <div class="cards three">${list.map(i=>`<article class="panel"><em class="s-${i.status.replace(' ','-')}">${i.status.toUpperCase()}</em>${i.priority==='Urgent'?'<em class="s-urgent">URGENT</em>':''}<h3>${esc(i.title)}</h3><p>${esc(i.desc||'')}</p><hr><small>${esc((i.vendor||'Contractor to be assigned').toUpperCase())} · ${fd(i.date).toUpperCase()}</small><b>${i.cost?money(i.cost)+(i.status==='completed'?'':' est.'):'Quote pending'}</b>${i.status!=='completed'?`<div class="cact">${i.status!=='in progress'?`<button class="outline sm" data-action="issue-status" data-s="in progress" data-id="${i.id}">Start work</button>`:''}<button class="primary sm" data-action="issue-status" data-s="completed" data-id="${i.id}">✓ Mark completed</button></div>`:''}</article>`).join('')||'<p class="empty">No issues reported.</p>'}</div>`;
}
let stYm=CUR;
function renderStatements(){
  const p=P(),months=[CUR,...Object.keys(p.history||{}).sort().reverse()];if(!months.includes(stYm))stYm=CUR;
  const st=statement(p.id,stYm);
  const lines=[['Gross booking revenue',money(st.gross)],['Management fee (15%)','- '+money(st.fee)],[`Cleaning & supplies (${st.cleans} clean${st.cleans==1?'':'s'})`,'- '+money(st.clean)],['Maintenance','- '+money(st.maint)]];
  $('#statements').innerHTML=`<div class="pagetitle"><div><small>FINANCE · ${esc(p.name.toUpperCase())}</small><h2>Owner statements</h2></div><div class="btns"><select id="stmonth">${months.map(m=>opt(m,stYm,ymLabel(m))).join('')}</select><button class="primary" data-action="pdf" data-ym="${stYm}">↓ Download ${MONL[+stYm.slice(5)-1]} PDF</button></div></div>
  <div class="cards"><article class="panel statement"><small>${ymLabel(stYm).toUpperCase()}${stYm===CUR?' · UPDATES LIVE':''}</small><h3>${esc(p.name)}</h3>${lines.map(l=>`<p><span>${l[0]}</span><b>${l[1]}</b></p>`).join('')}<hr><p class="net"><span>Net owner payout</span><b>${money(st.net)}</b></p>${st.bookings?`<details><summary>${st.bookings.length} stays included</summary>${st.bookings.map(b=>`<p><span>${esc(b.guest)} · ${range(b.start,b.end)}</span><b>${money(b.total)}</b></p>`).join('')||'<p>No stays yet this month.</p>'}</details>`:''}</article>
  <article class="panel"><small>STATEMENT HISTORY</small><h3>All statements</h3>${months.map((m,i)=>{const s=statement(p.id,m);return`${i?'<hr>':''}<p class="hrow"><b>${ymLabel(m)}</b><span>${money(s.net)}</span><button class="link" data-action="pdf" data-ym="${m}">↓ PDF</button></p>`}).join('')}<hr><p class="hrow"><b>Bookings export</b><span></span><button class="link" data-action="csv">↓ CSV</button></p></article></div>`;
  $('#stmonth').onchange=e=>{stYm=e.target.value;renderStatements()};
}
function renderSite(){
  const box=document.querySelector('.properties');if(!box)return;box.querySelectorAll('.added').forEach(x=>x.remove());
  S.properties.filter(p=>p.added).forEach(p=>box.insertAdjacentHTML('beforeend',`<article class="added"><div><img src="${esc(p.img)}" alt="${esc(p.name)}"><span>${esc(p.tag||'NEW')}</span></div><footer><h3>${esc(p.name)}</h3><p>${esc(p.area)} · ${p.guests} guests · ${p.beds} bedroom${p.beds==1?'':'s'}</p><b>${money(p.rate)} <small>/ night</small></b></footer></article>`));
}

/* ---------- actions ---------- */
const IMGS=[['images/p1.jpg','Pool villa'],['images/p2.jpg','Stone villa'],['images/p3.jpg','Modern villa'],['images/hero.jpg','Sea-view villa']];
function propertyForm(p){
  p=p||{name:'',area:'',guests:4,beds:2,rate:150,img:'images/p3.jpg',tag:'NEW'};
  return field('Property name *',`<input name="name" value="${esc(p.name)}" placeholder="e.g. Villa Kalypso" required>`,1)+
  field('Location *',`<input name="area" value="${esc(p.area)}" placeholder="e.g. Pissouri, Limassol" list="towns" required><datalist id="towns">${['Paphos','Coral Bay, Paphos','Polis, Paphos','Limassol','Pissouri, Limassol','Larnaca','Ayia Napa','Protaras','Nicosia','Troodos'].map(t=>`<option value="${t}">`).join('')}</datalist>`,1)+
  field('Max guests',`<input name="guests" type="number" min="1" max="30" value="${p.guests}">`)+field('Bedrooms',`<input name="beds" type="number" min="0" max="20" value="${p.beds}">`)+
  field('Nightly rate (€)',`<input name="rate" type="number" min="10" value="${p.rate}">`)+field('Label',`<select name="tag">${['NEW','SEA VIEW','GUEST FAVOURITE','POOL','CITY CENTRE','MOUNTAIN'].map(t=>opt(t,p.tag)).join('')}</select>`)+
  `<div class="f wide"><span>Cover photo</span><div class="imgpick">${IMGS.map(([u,l])=>`<label><input type="radio" name="img" value="${u}"${u===p.img?' checked':''}><img src="${u}" alt="${l}"></label>`).join('')}${p.img&&p.img.startsWith('data:')?`<label><input type="radio" name="img" value="keep" checked><img src="${esc(p.img)}" alt="current"></label>`:''}</div><input type="file" name="photo" accept="image/*"><small>Pick one of ours or upload your own photo.</small></div>`;
}
async function readPropertyForm(d,f){
  const name=d.name.trim(),area=d.area.trim();
  if(!name)return{err:'Please give the property a name.'};if(!area)return{err:'Please add a location.'};
  const guests=+d.guests,beds=+d.beds,rate=+d.rate;
  if(!(guests>=1))return{err:'Max guests must be at least 1.'};if(!(rate>0))return{err:'Enter a nightly rate.'};
  let img=d.img;const file=f.querySelector('[name=photo]').files[0];if(file)img=await readImg(file);
  return{name,area,guests,beds:beds||0,rate,tag:d.tag,img};
}
const A={
  'add-property'(){modal('Add a property',propertyForm(),'Add property',async(d,f)=>{const r=await readPropertyForm(d,f);if(r.err)return r.err;
    const p={id:nid('p'),...r,img:r.img==='keep'?'images/p3.jpg':r.img,rating:0,reviews:0,history:{},added:true};S.properties.push(p);S.current=p.id;save();tabNow='properties';renderAll();renderSite();toast(p.name+' added - it is now in your portfolio and on the website.')})},
  'edit-property'(el){const p=S.properties.find(x=>x.id===el.dataset.id);
    modal('Edit '+esc(p.name),propertyForm(p),'Save changes',async(d,f)=>{const r=await readPropertyForm(d,f);if(r.err)return r.err;if(r.img==='keep')r.img=p.img;Object.assign(p,r);save();renderAll();renderSite();toast('Saved.')},S.properties.length>1?`<button type="button" class="danger" data-action="remove-property" data-id="${p.id}">Remove</button>`:'')},
  'remove-property'(el){const p=S.properties.find(x=>x.id===el.dataset.id);if(!confirm('Remove '+p.name+' and all its bookings, cleans and issues?'))return;
    S.properties=S.properties.filter(x=>x!==p);['bookings','cleans','issues'].forEach(k=>S[k]=S[k].filter(x=>x.prop!==p.id));if(S.current===p.id)S.current=S.properties[0].id;save();closeModal();renderAll();renderSite();toast(p.name+' removed.')},
  'open-property'(el){S.current=el.dataset.id;save();tabNow='overview';renderAll()},
  'add-booking'(){const p=P();
    modal('Add booking · '+esc(p.name),
    `<div class="seg f wide"><label><input type="radio" name="type" value="guest" checked> Guest booking</label><label><input type="radio" name="type" value="owner"> Owner stay (blocks dates)</label></div>`+
    field('Guest name',`<input name="guest" placeholder="e.g. Maria Ioannou">`,1)+field('Check-in *',`<input name="start" type="date" min="2026-01-01" value="${iso(new Date(dt(TODAY).getTime()+30*864e5))}">`)+field('Check-out *',`<input name="end" type="date" value="${iso(new Date(dt(TODAY).getTime()+34*864e5))}">`)+
    field('Guests',`<input name="guests" type="number" min="1" max="${p.guests}" value="2">`)+field('Total (€)',`<input name="total" type="number" min="0" placeholder="auto: nights × ${money(p.rate)}">`)+
    field('Status',`<select name="status">${opt('CONFIRMED')}${opt('DEPOSIT PAID')}</select>`)+field('Channel',`<select name="channel">${['Direct','Airbnb','Booking.com','Vrbo'].map(c=>opt(c)).join('')}</select>`)+
    `<label class="f wide chk"><input type="checkbox" name="autoclean" checked> Schedule a turnover clean on check-out day</label>`,
    'Add booking',d=>{
      const owner=d.type==='owner',guest=owner?'Owner stay':d.guest.trim();
      if(!owner&&!guest)return'Add the guest name.';if(!d.start||!d.end)return'Pick check-in and check-out dates.';
      if(d.end<=d.start)return'Check-out must be after check-in.';
      const g=+d.guests||1;if(g>p.guests)return p.name+' sleeps up to '+p.guests+' guests.';
      const clash=S.bookings.find(b=>b.prop===p.id&&b.status!=='CANCELLED'&&d.start<b.end&&b.start<d.end);
      if(clash)return'Those dates overlap with '+clash.guest+' ('+range(clash.start,clash.end)+').';
      const n=nights(d.start,d.end),total=owner?0:(d.total!==''?+d.total:n*p.rate),ref='AZ-'+(++S.seq);
      const b={id:ref,ref,prop:p.id,guest,start:d.start,end:d.end,guests:g,total,status:owner?'OWNER STAY':d.status,type:owner?'owner':'guest',channel:owner?'Owner':d.channel};
      S.bookings.push(b);
      if(d.autoclean)S.cleans.push({id:nid('c'),prop:p.id,date:d.end,time:'11:00',type:'Turnover clean',note:'After '+guest,assignee:'',status:'scheduled',bookingId:ref});
      save();tabNow='bookings';bf='all';bq='';renderAll();toast((owner?'Owner stay':'Booking #'+ref)+' added for '+range(d.start,d.end)+(d.autoclean?' · turnover clean scheduled':''));
    })},
  'booking'(el){const b=S.bookings.find(x=>x.id===el.dataset.id);if(!b)return;const s=bStatus(b),p=S.properties.find(x=>x.id===b.prop),editable=!['COMPLETED','CANCELLED','IN HOUSE'].includes(s);
    modal(esc(b.guest)+' <small>#'+esc(b.ref)+'</small>',
    `<dl class="dl"><dt>Property</dt><dd>${esc(p.name)}</dd><dt>Stay</dt><dd>${fd(b.start)} → ${fd(b.end)} · ${nights(b.start,b.end)} nights</dd><dt>Guests</dt><dd>${b.guests}</dd><dt>Total</dt><dd>${b.type==='owner'?'Owner stay':money(b.total)}</dd><dt>Channel</dt><dd>${esc(b.channel||'Direct')}</dd><dt>Status</dt><dd>${s}</dd></dl>`+
    (editable&&b.type==='guest'?field('Change status',`<select name="status">${opt('CONFIRMED',b.status)}${opt('DEPOSIT PAID',b.status)}${opt('PAID IN FULL',b.status)}</select>`,1):''),
    editable&&b.type==='guest'?'Save':null,d=>{b.status=d.status;save();renderAll();toast('Booking #'+b.ref+' updated.')},
    s!=='CANCELLED'&&s!=='COMPLETED'?`<button type="button" class="danger" data-action="cancel-booking" data-id="${b.id}">Cancel booking</button>`:'')},
  'cancel-booking'(el){const b=S.bookings.find(x=>x.id===el.dataset.id);if(!confirm('Cancel '+b.guest+' ('+range(b.start,b.end)+')?'))return;b.status='CANCELLED';
    S.cleans=S.cleans.filter(c=>!(c.bookingId===b.id&&c.status!=='done'));save();closeModal();renderAll();toast('Booking #'+b.ref+' cancelled - dates are free again.')},
  'csv'(){const p=P(),rows=[['Booking','Guest','Check-in','Check-out','Nights','Guests','Total EUR','Status','Channel']].concat(mine(S.bookings).sort((a,b)=>a.start<b.start?-1:1).map(b=>[b.ref,b.guest,b.start,b.end,nights(b.start,b.end),b.guests,b.total,bStatus(b),b.channel||'Direct']));
    download(p.name.replace(/\W+/g,'-')+'-bookings.csv',new Blob(['\ufeff'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')],{type:'text/csv'}));toast('Bookings exported to CSV.')},
  'add-clean'(){const p=P();
    modal('Request a clean · '+esc(p.name),field('Date *',`<input name="date" type="date" value="${iso(new Date(dt(TODAY).getTime()+3*864e5))}">`)+field('Time',`<input name="time" type="time" value="11:00">`)+
    field('Type',`<select name="type">${['Turnover clean','Deep clean','Linen change','Pre-arrival check','Pool & terrace'].map(t=>opt(t)).join('')}</select>`)+field('Cleaner',`<select name="assignee">${opt('','','Team pending')}${['Maria K.','Eleni S.','Christos P.'].map(t=>opt(t)).join('')}</select>`)+
    field('Notes',`<textarea name="note" rows="2" placeholder="e.g. Extra towels, check BBQ"></textarea>`,1),'Request clean',d=>{
      if(!d.date)return'Pick a date.';S.cleans.push({id:nid('c'),prop:p.id,date:d.date,time:d.time||'11:00',type:d.type,note:d.note.trim(),assignee:d.assignee,status:d.assignee?'assigned':'scheduled'});save();tabNow='cleaning';renderAll();toast(d.type+' requested for '+fd(d.date)+'.')})},
  'assign-clean'(el){const c=S.cleans.find(x=>x.id===el.dataset.id);
    modal('Assign cleaner',field('Cleaner',`<select name="assignee">${['Maria K.','Eleni S.','Christos P.'].map(t=>opt(t,c.assignee)).join('')}</select>`,1),'Assign',d=>{c.assignee=d.assignee;c.status='assigned';save();renderAll();toast(d.assignee+' assigned to the '+fd(c.date)+' clean.')})},
  'done-clean'(el){const c=S.cleans.find(x=>x.id===el.dataset.id);c.status='done';if(!c.assignee)c.assignee='Maria K.';save();renderAll();toast('Clean marked done'+(inMonth(c.date,CUR)?' - '+money(CLEAN_COST)+' added to the September statement.':'.'))},
  'add-issue'(){const p=P();
    modal('Report an issue · '+esc(p.name),field('What needs fixing? *',`<input name="title" placeholder="e.g. Hot water not working">`,1)+field('Details',`<textarea name="desc" rows="2" placeholder="Where is it, what happened?"></textarea>`,1)+
    field('Priority',`<select name="priority">${opt('Normal')}${opt('Urgent')}</select>`)+field('Contractor',`<select name="vendor">${opt('','','Assign for me')}${['BlueWave Pools','CoolAir Paphos','Green Island','Paphos Plumbing','Island Electrics'].map(t=>opt(t)).join('')}</select>`)+
    field('Visit date',`<input name="date" type="date" value="${iso(new Date(dt(TODAY).getTime()+2*864e5))}">`)+field('Estimate (€)',`<input name="cost" type="number" min="0" placeholder="optional">`),'Report issue',d=>{
      if(!d.title.trim())return'Describe what needs fixing.';S.issues.push({id:nid('i'),prop:p.id,title:d.title.trim(),desc:d.desc.trim(),vendor:d.vendor,date:d.date||TODAY,cost:+d.cost||0,status:d.vendor?'scheduled':'reported',priority:d.priority});save();tabNow='maintenance';renderAll();toast('Issue reported'+(d.vendor?' and sent to '+d.vendor:'')+'.')})},
  'issue-status'(el){const i=S.issues.find(x=>x.id===el.dataset.id);i.status=el.dataset.s;if(i.status==='completed'){if(i.date>TODAY)i.date=TODAY;if(!i.cost){const v=prompt('Final cost (€)?','0');i.cost=+v||0}}save();renderAll();toast(i.title+(i.status==='completed'?' completed'+(i.cost?' - '+money(i.cost)+' added to the statement.':'.'):' - work started.'))},
  'pdf'(el){const p=P(),ym=el.dataset.ym||stYm;download(p.name.replace(/\W+/g,'-')+'-statement-'+ym+'.pdf',statementPDF(p,statement(p.id,ym)));toast(ymLabel(ym)+' statement downloaded.')},
  'reset'(){if(!confirm('Reset the demo to its starting data?'))return;S=seed();save();tabNow='overview';bq='';bf='all';stYm=CUR;renderAll();renderSite();toast('Demo data reset.')},
  'close'(){closeModal()}
};
document.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el)return;const f=A[el.dataset.action];if(!f)return;e.preventDefault();f(el)});
document.addEventListener('change',e=>{if(e.target.classList.contains('propSelect')){S.current=e.target.value;save();renderAll()}});

/* ---------- PDF (hand-built, no libraries) ---------- */
function pdfEsc(s){let o='';for(const ch of String(s)){const c=ch.codePointAt(0);if(ch==='('||ch===')'||ch==='\\')o+='\\'+ch;else if(c>=32&&c<127)o+=ch;else if(ch==='€')o+='\\200';else if(ch==='–'||ch==='—')o+='-';else if(ch==='→')o+='-';else if(c>=160&&c<256)o+='\\'+c.toString(8).padStart(3,'0');else o+='?'}return o}
function tw(s,size){let w=0;for(const ch of String(s)){w+=/[0-9€]/.test(ch)?556:/[ ,.]/.test(ch)?278:ch==='-'?333:/[A-Z]/.test(ch)?667:/[mw]/.test(ch)?833:/[il]/.test(ch)?222:500}return w*size/1000}
function statementPDF(p,st){
  let c='';const T=(x,y,s,size=10,bold=0,col='0.09 0.2 0.184',align)=>{if(align==='r')x-=tw(s,size);c+=`BT ${col} rg /F${bold?2:1} ${size} Tf ${x.toFixed(1)} ${y} Td (${pdfEsc(s)}) Tj ET\n`};
  const R=(x,y,w,h,col)=>{c+=`${col} rg ${x} ${y} ${w} ${h} re f\n`};const L=(y)=>{c+=`0.87 0.9 0.886 RG 0.8 w 50 ${y} m 545 ${y} l S\n`};
  const [yy,mm]=st.ym.split('-').map(Number),last=new Date(yy,mm,0).getDate(),ml=MONL[mm-1];
  R(0,762,595,80,'0.051 0.165 0.149');T(50,805,'Azure Stays Cyprus',20,1,'1 1 1');T(50,785,'OWNER STATEMENT',9,1,'0.918 0.839 0.682');T(545,805,ml+' '+yy,14,1,'1 1 1','r');T(545,785,'Statement #AS-'+p.id.toUpperCase()+'-'+st.ym.replace('-',''),9,0,'0.8 0.85 0.83','r');
  T(50,725,p.name,18,1);T(50,707,p.area+'  ·  '+p.guests+' guests  ·  '+p.beds+' bedrooms');T(50,690,'Owner: Andreas P.  ·  owner@azurestays.demo',9,0,'0.42 0.48 0.47');
  T(545,725,'Period',9,0,'0.42 0.48 0.47','r');T(545,710,'1-'+last+' '+ml+' '+yy,10,1,undefined,'r');T(545,690,'Issued 20 September 2026',9,0,'0.42 0.48 0.47','r');
  let y=650;
  if(st.bookings){T(50,y,'STAYS INCLUDED',8,1,'0.81 0.46 0.34');y-=18;T(50,y,'Guest',8,1,'0.42 0.48 0.47');T(230,y,'Booking',8,1,'0.42 0.48 0.47');T(320,y,'Dates',8,1,'0.42 0.48 0.47');T(430,y,'Nights',8,1,'0.42 0.48 0.47');T(545,y,'Revenue',8,1,'0.42 0.48 0.47','r');y-=8;L(y);y-=16;
    (st.bookings.length?st.bookings:[null]).slice(0,14).forEach(b=>{if(!b){T(50,y,'No stays this month yet.',9,0,'0.42 0.48 0.47');y-=18;return}T(50,y,b.guest,9);T(230,y,'#'+b.ref,9);T(320,y,range(b.start,b.end),9);T(430,y,String(nights(b.start,b.end)),9);T(545,y,money(b.total),9,0,undefined,'r');y-=18});
    if(st.bookings.length>14){T(50,y,'+ '+(st.bookings.length-14)+' more stays',9,0,'0.42 0.48 0.47');y-=18}y-=14}
  else{T(50,y,'Archived statement - summary figures.',9,0,'0.42 0.48 0.47');y-=30}
  T(50,y,'SUMMARY',8,1,'0.81 0.46 0.34');y-=10;L(y);y-=20;
  [['Gross booking revenue',money(st.gross)],['Management fee (15%)','- '+money(st.fee)],['Cleaning & supplies ('+st.cleans+' x '+money(CLEAN_COST)+')','- '+money(st.clean)],['Maintenance','- '+money(st.maint)]].forEach(([a,b])=>{T(50,y,a,10);T(545,y,b,10,0,undefined,'r');y-=10;L(y);y-=18});
  y-=12;R(50,y-14,495,36,'0.918 0.839 0.682');T(62,y,'Net owner payout',12,1);T(533,y,money(st.net),14,1,undefined,'r');y-=50;
  T(50,y,'Payout will be transferred to your registered bank account within 5 working days.',9,0,'0.42 0.48 0.47');
  T(50,40,'Demo document with fictional data.  Built by StreamlineCY  ·  streamlinecy.com  ·  +357 99 813049',8,0,'0.42 0.48 0.47');
  const objs=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>','<< /Length '+c.length+' >>\nstream\n'+c+'endstream',
    '<< /Title ('+pdfEsc(p.name+' - '+ml+' '+yy+' owner statement')+') /Producer (StreamlineCY demo) >>'];
  let out='%PDF-1.4\n';const off=[];objs.forEach((o,i)=>{off.push(out.length);out+=(i+1)+' 0 obj\n'+o+'\nendobj\n'});
  const x=out.length;out+='xref\n0 '+(objs.length+1)+'\n0000000000 65535 f \n'+off.map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+(objs.length+1)+' /Root 1 0 R /Info 7 0 R >>\nstartxref\n'+x+'\n%%EOF\n';
  return new Blob([out],{type:'application/pdf'});
}

/* ---------- boot ---------- */
renderSite();
if(location.hash==='#dashboard'){show(dash);renderAll()}else if(location.hash==='#login')show(login);
