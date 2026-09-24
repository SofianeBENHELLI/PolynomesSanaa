const Study = (() => {
  function analyze(a,b,c) {
    let roots=[],delta=null;
    if(a===0){if(b!==0)roots=[-c/b];}
    else {
      const scale=Math.max(Math.abs(a),Math.abs(b),Math.abs(c)),A=a/scale,B=b/scale,C=c/scale;
      let D=B*B-4*A*C;
      const tolerance=Number.EPSILON*16*Math.max(B*B,Math.abs(4*A*C));
      if(Math.abs(D)<=tolerance)D=0;
      delta=D*scale*scale;
      if(D===0)roots=[-b/(2*a)];
      else if(D>0){const q=-.5*(B+(B<0?-1:1)*Math.sqrt(D));roots=[q/A,C/q].sort((x,y)=>x-y);}
    }
    const sign=a!==0?Math.sign(a):b!==0?Math.sign(b):Math.sign(c);
    const signs=a!==0?(roots.length===2?[sign,-sign,sign]:roots.length===1?[sign,sign]:[sign]):b!==0?[-sign,sign]:[sign];
    return {roots,delta,signs,h:a!==0?-b/(2*a):null,k:a!==0?c-b*b/(4*a):null};
  }
  function solutions(model,op){
    const inclusive=op==='ge'||op==='le',positive=op==='ge'||op==='gt';
    const chosen=model.signs.map(s=>s===0?inclusive:positive?s>0:s<0);
    const bounds=[-Infinity,...model.roots,Infinity],parts=[];
    for(let i=0;i<chosen.length;i++)if(chosen[i])parts.push({lo:bounds[i],hi:bounds[i+1],lc:inclusive&&i>0,hc:inclusive&&i<model.roots.length});
    if(inclusive)model.roots.forEach((r,i)=>{if(!chosen[i]&&!chosen[i+1])parts.push({lo:r,hi:r,lc:true,hc:true})});
    parts.sort((a,b)=>a.lo-b.lo);const merged=[];
    for(const part of parts){const last=merged.at(-1);if(last&&last.hi===part.lo&&(last.hc||part.lc)){last.hi=part.hi;last.hc=part.hc}else merged.push({...part});}
    return merged;
  }
  function extrema(a,b,c,u,v){if(!Number.isFinite(u)||!Number.isFinite(v)||u>v)throw Error('Saisissez deux bornes finies avec u ≤ v.');const xs=[u,v],h=a===0?null:-b/(2*a);if(h!==null&&h>u&&h<v)xs.push(h);const points=[...new Set(xs)].map(x=>({x,y:(a*x+b)*x+c}));const min=Math.min(...points.map(p=>p.y)),max=Math.max(...points.map(p=>p.y));return{min,max,minAt:points.filter(p=>p.y===min).map(p=>p.x),maxAt:points.filter(p=>p.y===max).map(p=>p.x),points};}
  return {analyze,solutions,extrema};
})();
if(typeof module!=='undefined')module.exports=Study;
function renderStudy(){
  if(!document.getElementById('variation-table'))return;
  const {a,b,c}=state,m=Study.analyze(a,b,c),f=fmt;
  const signCell=s=>`<td class="${s>0?'positive':s<0?'negative':'zero'}">${s>0?'+':s<0?'−':'0'}</td>`;
  const table=(caption,rows)=>`<table class="study-table"><caption>${caption}</caption><tbody>${rows}</tbody></table>`;
  const arrow=up=>`<td><span class="variation-arrow">${up?'↗':'↘'}<small>${up?'croissante':'décroissante'}</small></span></td>`;
  $('derivative-form').textContent=`f′(x) = ${a===0?f(b):`${f(2*a)}x ${b<0?'−':'+'} ${f(Math.abs(b))}`}`;
  if(a!==0){const end=a>0?'+∞':'−∞';$('variation-table').innerHTML=table('Variations de f sur ℝ',`<tr><th scope="row">x</th><td>−∞</td><td></td><td>h = ${f(m.h)}</td><td></td><td>+∞</td></tr><tr><th scope="row">f′(x)</th><td></td>${signCell(-Math.sign(a))}<td class="zero">0</td>${signCell(Math.sign(a))}<td></td></tr><tr><th scope="row">f(x)</th><td>${end}</td>${arrow(a<0)}<td class="turning-value">${f(m.k)}<br><small>${a>0?'minimum':'maximum'}</small></td>${arrow(a>0)}<td>${end}</td></tr>`);$('variation-reading').textContent=`f est ${a>0?'décroissante':'croissante'} sur ]−∞ ; ${f(m.h)}], puis ${a>0?'croissante':'décroissante'} sur [${f(m.h)} ; +∞[. Son ${a>0?'minimum':'maximum'} vaut ${f(m.k)}, atteint en x = ${f(m.h)}.`;}
  else{$('variation-table').innerHTML=table('Cas a = 0 : fonction affine ou constante',`<tr><th scope="row">x</th><td>−∞</td><td></td><td>+∞</td></tr><tr><th scope="row">f′(x)</th><td></td>${signCell(Math.sign(b))}<td></td></tr><tr><th scope="row">f(x)</th><td>${b===0?f(c):b>0?'−∞':'+∞'}</td>${b===0?'<td>→ constante</td>':arrow(b>0)}<td>${b===0?f(c):b>0?'+∞':'−∞'}</td></tr>`);$('variation-reading').textContent=b===0?`f est constante et vaut ${f(c)} sur ℝ.`:`f est ${b>0?'croissante':'décroissante'} sur ℝ. Il n’y a pas de sommet.`;}
  let head='<tr><th scope="row">x</th><td>−∞</td>',row='<tr><th scope="row">f(x)</th><td></td>';
  m.signs.forEach((s,i)=>{head+='<td></td>';row+=signCell(s);if(i<m.roots.length){head+=`<td>${f(m.roots[i])}</td>`;row+='<td class="zero">0</td>';}});head+='<td>+∞</td></tr>';row+='<td></td></tr>';
  $('sign-table').innerHTML=table('Signe de f sur ℝ — racines rangées dans l’ordre croissant',head+row);
  $('sign-case').textContent=a===0?'Cas a = 0 : le tableau reste valable pour la fonction affine ou constante.':`Δ = ${f(m.delta)} : ${m.roots.length===2?'deux racines réelles distinctes':m.roots.length===1?'une racine double, sans changement de signe':'aucune racine réelle'}.`;
  const op=$('inequality').value,parts=Study.solutions(m,op),num=n=>n===Infinity?'+∞':n===-Infinity?'−∞':f(n);
  const interval=p=>p.lo===-Infinity&&p.hi===Infinity?'ℝ':p.lo===p.hi?`{${num(p.lo)}}`:`${p.lc?'[':']'}${num(p.lo)} ; ${num(p.hi)}${p.hc?']':'['}`;
  $('inequality-result').textContent='S = '+(parts.length?parts.map(interval).join(' ∪ '):'∅');
  const n=m.roots.length,positions=Array.from({length:n+2},(_,i)=>40+i*520/(n+1));let svg='<svg class="solution-axis" viewBox="0 0 600 105" role="img" aria-label="Intervalles solutions sur un axe schématique"><path d="M25 35H580" stroke="#a8b3c9" stroke-width="2"/>';
  const yes=s=>s===0?op==='ge'||op==='le':op==='ge'||op==='gt'?s>0:s<0;
  m.signs.forEach((s,i)=>{if(yes(s))svg+=`<path d="M${positions[i]} 35H${positions[i+1]}" stroke="#3459e8" stroke-width="7"/>`;});
  m.roots.forEach((r,i)=>{svg+=`<circle cx="${positions[i+1]}" cy="35" r="6" fill="${op==='ge'||op==='le'?'#3459e8':'white'}" stroke="#3459e8" stroke-width="2"/><text x="${positions[i+1]}" y="62" text-anchor="middle" font-size="14" fill="#37445f">${f(r)}</text>`});
  svg+='<text x="24" y="20" font-size="13">−∞</text><text x="556" y="20" font-size="13">+∞</text><text x="300" y="94" text-anchor="middle" font-size="12" fill="#62708b">Bleu : solutions · ● inclus · ○ exclu · axe non gradué</text></svg>';$('solution-line').innerHTML=svg;
  const left=$('domain-left'),right=$('domain-right');try{if(left.value===''||right.value==='')throw Error('Renseignez les deux bornes.');const e=Study.extrema(a,b,c,Number(left.value),Number(right.value));$('optimization-result').innerHTML=`<div class="extrema-cards"><div>Minimum<strong>${f(e.min)}</strong>${a===0&&b===0?'Pour tout x de l’intervalle':'Atteint pour x = '+e.minAt.map(f).join(' ou ')}</div><div>Maximum<strong>${f(e.max)}</strong>${a===0&&b===0?'Pour tout x de l’intervalle':'Atteint pour x = '+e.maxAt.map(f).join(' ou ')}</div></div><p>Valeurs comparées : ${e.points.map(p=>`f(${f(p.x)}) = ${f(p.y)}`).join(' ; ')}.</p>`;}catch(e){$('optimization-result').textContent=e.message;}
}
if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>{for(const id of ['inequality','domain-left','domain-right'])document.getElementById(id).addEventListener('input',renderStudy);renderStudy()});
