const site=document.querySelector('#site'),login=document.querySelector('#login'),dash=document.querySelector('#dashboard');
const show=x=>{[site,login,dash].forEach(v=>v.classList.add('hide'));x.classList.remove('hide');scrollTo(0,0)};
document.querySelectorAll('.login').forEach(b=>b.onclick=()=>{show(login);location.hash='login'});
document.querySelectorAll('.back').forEach(b=>b.onclick=()=>{show(site);location.hash='home'});
document.querySelector('#loginform').onsubmit=e=>{e.preventDefault();show(dash);location.hash='dashboard'};
function tab(id){document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));scrollTo(0,0)}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
if(location.hash==='#dashboard')show(dash);else if(location.hash==='#login')show(login);
