import { categories, wheelEntries, totalChallenges } from './src/challenges.js';

const KEY = 'oh-yeah-disc-golf-time-html-v2';
const $ = id => document.getElementById(id);
const id = () => (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
const makePlayer = name => ({id:id(),name,required:1,drawn:0,nextDebt:0,immunity:0,penaltyStrokes:0,log:[],risks:[],bans:[]});
const initial = () => ({hole:1,players:[makePlayer('Player 1'),makePlayer('Player 2')],selected:null,history:[]});
function load(){try{const p=JSON.parse(localStorage.getItem(KEY));return p?.players?.length?p:initial()}catch{return initial()}}
let game=load();
let stage='fate',categoryIndex=null,selectedIndex=null,spinning=false,rotation=0,result=null,choiceResolved=false;
let wheelView='fate';
const active = () => game.players.find(p=>p.id===game.selected) || game.players[0];
const h = (tag, cls, text) => {const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
const button = (text,action,cls='') => {const x=h('button',cls,text);x.addEventListener('click',action);return x};
const save = () => localStorage.setItem(KEY,JSON.stringify(game));
const safeName = item => item?.short || item?.name || item?.title || '';
// Rejection sampling gives every wedge an exactly equal chance, including SAFE.
function randomIndex(length){
  const range=4294967296,limit=range-range%length,nums=new Uint32Array(1);
  if(!globalThis.crypto?.getRandomValues)return Math.floor(Math.random()*length);
  do{crypto.getRandomValues(nums)}while(nums[0]>=limit);
  return nums[0]%length;
}
function updatePlayer(playerId,fn){game.players=game.players.map(p=>p.id===playerId?fn(p):p);save()}
function resetWheel(){stage='fate';categoryIndex=null;selectedIndex=null;result=null;choiceResolved=false;rotation=0;wheelView='fate';render()}
function entries(){return wheelView==='fate'?categories:wheelEntries(categories[categoryIndex])}
function drawWheel(){
  const data=entries(),count=data.length,step=360/count;
  const zone=$('wheel');zone.replaceChildren();
  const pointer=h('div','wheel-pointer','▼');zone.append(pointer);
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 400 400');
  svg.setAttribute('role','img');svg.setAttribute('aria-label','Wheel with '+count+' labeled options');
  const rotor=document.createElementNS(ns,'g');rotor.setAttribute('class','rotor');rotor.setAttribute('id','rotor');
  const circle=document.createElementNS(ns,'circle');circle.setAttribute('cx','200');circle.setAttribute('cy','200');circle.setAttribute('r','197');circle.setAttribute('fill','#bad5ff');rotor.append(circle);
  data.forEach((entry,i)=>{
    const a=-Math.PI/2+i*Math.PI*2/count,b=-Math.PI/2+(i+1)*Math.PI*2/count,r=188;
    const sector=document.createElementNS(ns,'path');
    sector.setAttribute('d',`M 200 200 L ${200+r*Math.cos(a)} ${200+r*Math.sin(a)} A ${r} ${r} 0 0 1 ${200+r*Math.cos(b)} ${200+r*Math.sin(b)} Z`);
    sector.setAttribute('fill',entry.isSafe?'#c7ff8d':i%2===0?(wheelView==='fate'?'#3677e6':categories[categoryIndex].color):'#28416d');
    sector.setAttribute('stroke','#152344');sector.setAttribute('stroke-width','1.3');rotor.append(sector);
    const label=document.createElementNS(ns,'text');
    const angle=(i+.5)*step;
    const radial=count>8;
    label.setAttribute('x','200');label.setAttribute('y','200');
    label.setAttribute('transform',`rotate(${angle} 200 200) translate(0 -140) rotate(${radial?90:0} 200 200)`);
    label.setAttribute('font-size',radial?'10':'14');
    label.setAttribute('font-weight','900');label.setAttribute('text-anchor','middle');label.setAttribute('dominant-baseline','middle');
    label.setAttribute('paint-order','stroke');label.setAttribute('stroke','#172441');label.setAttribute('stroke-width','.75');
    label.setAttribute('fill',entry.isSafe?'#142a20':'white');
    const name=safeName(entry);
    label.textContent=name.length>22?name.slice(0,21)+'…':name;
    rotor.append(label);
  });
  svg.append(rotor);zone.append(svg);
  const mid=h('div','wheel-center');mid.append(h('span','', 'OH YEAH!'),h('small','',wheelView==='fate'?'FATE':categories[categoryIndex].short));zone.append(mid);
  rotor.style.transform=`rotate(${rotation}deg)`;
  $('landing').textContent=selectedIndex===null?'SPIN TO BEGIN':'▼ LANDED ON: '+safeName(data[selectedIndex]);
  if(data[selectedIndex]?.isSafe)$('landing').classList.add('safe');else $('landing').classList.remove('safe');
}
function animate(index,done){
  spinning=true;selectedIndex=null;render();
  const rotor=$('rotor'),step=360/entries().length;
  const current=((rotation%360)+360)%360;
  const target=(360-(index+.5)*step)%360;
  rotation+=2160+(target-current+360)%360;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    rotor.style.transition='transform 3.6s cubic-bezier(.12,.76,.16,1)';
    rotor.style.transform=`rotate(${rotation}deg)`;
  }));
  window.setTimeout(()=>{spinning=false;selectedIndex=index;done();render()},3750);
}
function fateSpin(){if(spinning||active().drawn>=active().required)return;const index=randomIndex(4);wheelView='fate';animate(index,()=>{categoryIndex=index;stage='fateResult'})}
function challengeSpin(){
  if(spinning||categoryIndex===null)return;
  const data=wheelEntries(categories[categoryIndex]);
  const index=randomIndex(data.length);
  const chosen=data[index],playerId=active().id;
  const outcome={...chosen,id:id(),hole:game.hole,playerId,categoryId:categories[categoryIndex].id};
  animate(index,()=>{
    result=outcome;stage='result';choiceResolved=false;
    game.history.unshift(outcome);game.history=game.history.slice(0,100);
    updatePlayer(playerId,p=>({...p,drawn:p.drawn+1,required:p.required+(chosen.effect==='extra2'?2:0),
      penaltyStrokes:(p.penaltyStrokes||0)+(chosen.name==='One Stroke Penalty'?1:chosen.name==='Two-Stroke Doom'?2:0),
      immunity:p.immunity+(chosen.effect==='immunity'?1:0),
      risks:chosen.effect==='risk'?[...p.risks,{id:outcome.id,name:chosen.name,status:'pending'}]:p.risks,
      bans:chosen.ban?[...p.bans,{name:chosen.name,remaining:chosen.ban}]:p.bans,
      log:[...p.log,outcome]}));
  });
}
function resolveRisk(playerId,riskId,success){
  updatePlayer(playerId,p=>{
    const r=p.risks.find(x=>x.id===riskId);
    if(!r||r.status!=='pending')return p;
    return {...p,risks:p.risks.map(x=>x.id===riskId?{...x,status:success?'success':'failed'}:x),
      // Never change required/drawn this hole when a risk is failed.
      nextDebt:success?p.nextDebt:Math.max(2,p.nextDebt),
      immunity:p.immunity+(success&&['Saved by Par','Basket Bounty'].includes(r.name)?1:0),
      penaltyStrokes:Math.max(0,p.penaltyStrokes-(success&&r.name==='Birdie Bounty'?1:0))};
  });render();
}
function chooseEffect(kind){
  if(choiceResolved||!result)return;
  if(result.effect==='choice'){
    updatePlayer(active().id,p=>({...p,required:p.required+(kind==='extra'?2:0),penaltyStrokes:p.penaltyStrokes+(kind==='stroke'?1:0)}));
  }
  if(result.effect==='target'&&kind){
    updatePlayer(kind,p=>({...p,required:p.required+1}));
  }
  choiceResolved=true;render();
}
function nextHole(){
  if(spinning)return;
  game.hole++;
  game.selected=game.players[0].id;
  game.players=game.players.map(p=>{
    const failedOrPending=p.risks.some(r=>r.status==='pending');
    const debt=Math.max(p.nextDebt,failedOrPending?2:0);
    return {...p,required:debt||1,drawn:0,nextDebt:0,risks:[],log:[],
      bans:p.bans.map(b=>({...b,remaining:b.remaining-1})).filter(b=>b.remaining>0)};
  });save();resetWheel();
}
function renderPlayers(){
  const wrap=$('players');wrap.replaceChildren();
  game.players.forEach(p=>{
    const entry=h('div','player'+(p.id===active().id?' active':''));
    const btn=button('',()=>{if(!spinning){game.selected=p.id;save();resetWheel()}},'select-player');
    btn.append(h('strong','',p.name),h('small','',`${p.drawn}/${p.required} spins ${p.nextDebt?'• 2 next hole':''}`));
    const del=button('×',()=>{if(spinning||game.players.length===1)return;game.players=game.players.filter(x=>x.id!==p.id);if(game.selected===p.id)game.selected=game.players[0].id;save();resetWheel()},'delete-player');
    del.setAttribute('aria-label','Remove '+p.name);del.disabled=spinning||game.players.length===1;
    entry.append(btn,del);wrap.append(entry);
  });
}
function renderControls(){
  const root=$('controls');root.replaceChildren();
  const add=(tag,cls,text)=>{const el=h(tag,cls,text);root.append(el);return el};
  if(stage==='fate'){
    add('p','eyebrow','STEP ONE');
    add('h2','','SPIN THE WHEEL OF FATE');
    add('p','','The first wheel chooses one of four challenge categories.');
    const btn=button(active().drawn>=active().required?'TURN COMPLETE':spinning?'SPINNING…':'🎲 SPIN WHEEL OF FATE',fateSpin,'primary');
    btn.disabled=spinning||active().drawn>=active().required;root.append(btn);
  }else if(stage==='fateResult'){
    add('p','eyebrow','CATEGORY CHOSEN');
    add('h2','',categories[categoryIndex].title).style.color=categories[categoryIndex].color;
    add('p','','The wheel landed on the category shown under the pointer.');
    root.append(button('CONTINUE TO CHALLENGE WHEEL →',()=>{stage='category';wheelView='challenge';rotation=0;selectedIndex=null;render()},'primary'));
  }else if(stage==='category'){
    add('p','eyebrow','STEP TWO');
    add('h2','',categories[categoryIndex].title).style.color=categories[categoryIndex].color;
    add('p','',wheelEntries(categories[categoryIndex]).length+' equally likely outcomes, including SAFE SPOT.');
    const btn=button(spinning?'SPINNING…':'🥏 SPIN CHALLENGE WHEEL',challengeSpin,'primary');btn.disabled=spinning;root.append(btn);
  }else if(result){
    add('p','eyebrow','YOUR DOOM IS…');
    add('h2','result-title',result.name).style.color=result.isSafe?'#c7ff8d':categories[categoryIndex].color;
    add('p','result-text',result.text);
    add('span','chip',result.isSafe?'SAFE! NO PUNISHMENT':'APPLIES TO THIS HOLE');
    if(result.effect==='risk' && active().risks.some(r=>r.id===result.id&&r.status==='pending')){
      const div=h('div','risk-actions');div.append(h('p','','After the hole, did you succeed? Failure means TWO spins NEXT hole, not now.'));
      div.append(button('✓ SUCCESS',()=>resolveRisk(active().id,result.id,true),'success'));
      div.append(button('✕ FAILED',()=>resolveRisk(active().id,result.id,false),'danger'));root.append(div);
    }
    if(result.effect==='choice'&&!choiceResolved){
      const div=h('div','assignment');div.append(h('p','','Choose your outcome:'));
      div.append(button('TWO EXTRA SPINS',()=>chooseEffect('extra')));
      div.append(button('+1 STROKE',()=>chooseEffect('stroke')));root.append(div);
    }
    if(result.effect==='target'&&!choiceResolved){
      const div=h('div','assignment');div.append(h('p','','Give another player an extra spin this hole:'));
      const select=h('select');const placeholder=h('option','','Choose player');placeholder.value='';select.append(placeholder);
      game.players.filter(p=>p.id!==active().id).forEach(p=>{const option=h('option','',p.name);option.value=p.id;select.append(option)});
      const assign=button('ASSIGN',()=>{if(select.value)chooseEffect(select.value)});
      div.append(select,assign);root.append(div);
    }
    root.append(button('↩ BACK TO WHEEL',resetWheel,'primary'));
  }
}
function renderPending(){
  const wrap=$('pending');wrap.replaceChildren();
  const p=active();
  if(p.immunity>0&&stage==='fate'&&p.drawn<p.required){
    wrap.append(button('🛡 USE IMMUNITY ('+p.immunity+' available)',()=>{
      updatePlayer(p.id,x=>({...x,immunity:x.immunity-1,drawn:x.drawn+1,log:[...x.log,{id:id(),name:'Doom Immunity used'}]}));render()
    }));
  }
  p.risks.filter(r=>r.status==='pending').forEach(r=>{
    const row=h('div');row.append(h('strong','',r.name+' — awaiting outcome'));
    row.append(button('SUCCESS',()=>resolveRisk(p.id,r.id,true),'success'),button('FAILED',()=>resolveRisk(p.id,r.id,false),'danger'));
    wrap.append(row);
  });
}
function renderTracker(){
 const wrap=$('tracker');wrap.replaceChildren();
 game.players.forEach(p=>{
   const card=h('div','tracker-card');card.append(h('h3','',p.name+' — '+p.drawn+'/'+p.required+' spins'));
   if(!p.log.length)card.append(h('p','empty','No challenges this hole.'));
   p.log.forEach(x=>card.append(h('p','', '• '+x.name)));
   p.risks.forEach(x=>card.append(h('p','',x.name+': '+x.status)));
   if(p.nextDebt)card.append(h('p','warn','⚡ TWO spins owed NEXT hole'));
   if(p.penaltyStrokes)card.append(h('p','warn','Wheel penalty strokes: '+p.penaltyStrokes));
   p.bans.forEach(x=>card.append(h('p','warn',x.name+' ban: '+x.remaining+' hole(s) left'));
   wrap.append(card);
 });
}
function render(){
  $('holeNumber').textContent='HOLE '+game.hole;
  $('currentPlayer').textContent=active().name.toUpperCase()+"'S TURN";
  $('spinCount').textContent=Math.max(0,active().required-active().drawn)+' spins remaining';
  drawWheel();renderPlayers();renderControls();renderPending();renderTracker();
}
$('addPlayer').addEventListener('submit',ev=>{ev.preventDefault();const name=$('playerName').value.trim();if(!name)return;game.players.push(makePlayer(name));$('playerName').value='';save();render()});
$('nextHole').addEventListener('click',nextHole);
$('showRules').addEventListener('click',()=>{
 const panel=$('catalogue');panel.hidden=!panel.hidden;if(panel.hidden)return;
 panel.replaceChildren(h('h2','','All '+totalChallenges+' Challenges + 4 SAFE spots'));
 categories.forEach(cat=>{
   const details=h('details','catalog-group');const summary=h('summary','',cat.title+' ('+wheelEntries(cat).length+' slices)');summary.style.color=cat.color;details.append(summary);
   wheelEntries(cat).forEach(x=>{const row=h('div','catalog-entry');row.append(h('strong','',x.name),h('small','',x.text));details.append(row)});
   panel.append(details);
 });
});
$('reset').addEventListener('click',()=>{if(!confirm('Reset all players, scores and penalties?'))return;game=initial();save();resetWheel()});
render();
