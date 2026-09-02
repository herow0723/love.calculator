const form=document.querySelector('#loveForm'), formView=document.querySelector('#formView'), resultView=document.querySelector('#resultView');
const score=document.querySelector('#score'), fill=document.querySelector('#barFill');
form.addEventListener('submit',async e=>{e.preventDefault(); const boy=document.querySelector('#boy').value.trim(),girl=document.querySelector('#girl').value.trim(); if(!boy||!girl)return;
 const r=await fetch('/api/calculate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({boy,girl})}); const data=await r.json(); if(!r.ok)return alert(data.error||'Something went wrong.');
 document.querySelector('#showBoy').textContent=data.boy;document.querySelector('#showGirl').textContent=data.girl;document.querySelector('#message').textContent=data.percentage===100?'💖 Perfect Match! 💖':data.percentage>=90?'🔥 Amazing chemistry!':data.percentage>=75?'💕 Great potential!':'✨ Interesting combination!';
 formView.classList.add('hidden');resultView.classList.remove('hidden');let n=0;score.textContent='0%';fill.style.width='0%';setTimeout(()=>fill.style.width=data.percentage+'%',50);const t=setInterval(()=>{n++;score.textContent=n+'%';if(n>=data.percentage)clearInterval(t)},18);
});
document.querySelector('#again').onclick=()=>{resultView.classList.add('hidden');formView.classList.remove('hidden');form.reset();};
for(let i=0;i<18;i++){const h=document.createElement('span');h.textContent=['❤️','💕','💗','💖'][i%4];h.style.left=Math.random()*100+'%';h.style.animationDuration=(6+Math.random()*8)+'s';h.style.animationDelay=(-Math.random()*12)+'s';document.querySelector('.hearts').appendChild(h)}
