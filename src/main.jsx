import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { categories, totalChallenges } from './challenges';
import './styles.css';

const STORAGE = 'oh-yeah-disc-golf-time-v1';
const uid = () => Math.random().toString(36).slice(2,10);
const newPlayer = (name) => ({id:uid(),name,required:1,drawn:0,nextDebt:0,immunity:0,log:[],risks:[],bans:[]});
const initial = () => ({hole:1,players:[newPlayer('Player 1'),newPlayer('Player 2')],selected:null,history:[]});
function load(){ try {const data=JSON.parse(localStorage.getItem(STORAGE));return data?.players?.length?data:initial()}catch{return initial()} }
const colorFor = id => categories.find(c=>c.id===id)?.color || '#fff';
function Wheel({ entries, color, spinData, spinning, label }) {
  const count=entries.length;
  const step=360/count;
  const [rotation,setRotation]=useState(0);
  const lastSpin=useRef(null);
  useEffect(()=>{
    if(!spinData || lastSpin.current===spinData.id)return;
    lastSpin.current=spinData.id;
    // Pointer is fixed at 12 o'clock. Rotate winning slice's center under pointer.
    setRotation(prev=>{const current=((prev%360)+360)%360;const target=((360-(spinData.index+.5)*step)%360+360)%360;let delta=(target-current+360)%360;return prev+2160+delta});
  },[spinData,step]);
  const bg=useMemo(()=> 'conic-gradient(from 0deg,'+entries.map((_,i)=>`${i%2===0?color:'#26395b'} ${i*step}deg ${(i+1)*step}deg`).join(',')+')',[entries,color,step]);
  return <div className="wheel-shell">
    <div className="pointer" aria-hidden="true">▼</div>
    <div className={'wheel '+(spinning?'is-spinning':'')} style={{background:bg,transform:`rotate(${rotation}deg)`,transition:spinning?'transform 3.6s cubic-bezier(.12,.76,.16,1)':'none'}}>
      {entries.map((e,i)=><div className="slice-label" key={i} style={{transform:`translate(-50%,-50%) rotate(${(i+.5)*step}deg) translateY(-105px)`}}>{count<=5 ? e.short : ''}</div>)}
    </div>
    <div className="wheel-hub"><span>OH YEAH!</span><small>{label}</small></div>
  </div>;
}
function App(){
 const [game,setGame]=useState(load);
 const [stage,setStage]=useState('fate');
 const [categoryIndex,setCategoryIndex]=useState(null);
 const [spinData,setSpinData]=useState(null);
 const [spinning,setSpinning]=useState(false);
 const [result,setResult]=useState(null);
 const [name,setName]=useState('');
 const [browse,setBrowse]=useState(false);
 const [target,setTarget]=useState('');
 const [confirmReset,setConfirmReset]=useState(false);
 const timers=useRef([]);
 const later=(fn,ms)=>{const t=setTimeout(fn,ms);timers.current.push(t)};
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 useEffect(()=>{localStorage.setItem(STORAGE,JSON.stringify(game))},[game]);
 const selected=game.players.find(p=>p.id===game.selected)||game.players[0];
 const updatePlayer=(id,fn)=>setGame(g=>({...g,players:g.players.map(p=>p.id===id?fn(p):p)}));
 const resetScreen=()=>{setStage('fate');setCategoryIndex(null);setResult(null);setSpinData(null);setTarget('')};
 const switchPlayer=id=>{if(spinning)return;setGame(g=>({...g,selected:id}));resetScreen()};
 const startFate=()=>{
  if(spinning||!selected||selected.drawn>=selected.required)return;
  const index=Math.floor(Math.random()*categories.length);
  setSpinning(true);setResult(null);
  setSpinData({index,id:uid()});
  later(()=>{setSpinning(false);setCategoryIndex(index);setStage('category');setSpinData(null)},3750);
 };
 const startChallenge=()=>{
  if(spinning||categoryIndex===null)return;
  const cat=categories[categoryIndex];
  const index=Math.floor(Math.random()*cat.challenges.length);
  const challenge=cat.challenges[index];
  const outcome={id:uid(),hole:game.hole,playerId:selected.id,categoryId:cat.id,...challenge};
  setSpinning(true);setSpinData({index,id:uid()});
  later(()=>{
   setSpinning(false);setResult(outcome);setStage('result');
   setGame(g=>({...g,history:[outcome,...g.history].slice(0,100),players:g.players.map(p=>p.id!==outcome.playerId?p:{
    ...p,drawn:p.drawn+1,required:p.required+(challenge.effect==='extra2'?2:0),
    immunity:p.immunity+(challenge.effect==='immunity'?1:0),
    risks:challenge.effect==='risk'?[...p.risks,{id:outcome.id,name:challenge.name,status:'pending'}]:p.risks,
    bans:challenge.ban?[...p.bans,{name:challenge.name,remaining:challenge.ban}]:p.bans,
    log:[...p.log,outcome]
   })}));
  },3750);
 };
 const resolveRisk=(id,success)=>{
  // Critical: required and drawn for THIS hole do not change. Only nextDebt is updated.
  updatePlayer(selected.id,p=>({...p,
   risks:p.risks.map(r=>r.id===id?{...r,status:success?'success':'failed'}:r),
   nextDebt:success?p.nextDebt:Math.max(p.nextDebt,2)
  }));
 };
 const applyTarget=()=>{
  if(!target||!result)return;
  updatePlayer(target,p=>({...p,required:p.required+1}));
  setTarget('');
 };
 const choiceExtra=()=>{updatePlayer(selected.id,p=>({...p,required:p.required+2,log:p.log.map(l=>l.id===result.id?{...l,resolution:'two extra spins'}:l)}));setResult({...result,effect:'resolved'})};
 const choiceStroke=()=>{updatePlayer(selected.id,p=>({...p,log:p.log.map(l=>l.id===result.id?{...l,resolution:'+1 stroke'}:l)}));setResult({...result,effect:'resolved'})};
 const nextHole=()=>{
  if(spinning)return;
  setGame(g=>({...g,hole:g.hole+1,selected:g.players[0]?.id,
   players:g.players.map(p=>{
    const unresolved=p.risks.some(r=>r.status==='pending');
    const newDebt=Math.max(p.nextDebt,unresolved?2:0);
    return {...p,required:newDebt>0?newDebt:1,drawn:0,nextDebt:0,risks:[],
     bans:p.bans.map(b=>({...b,remaining:b.remaining-1})).filter(b=>b.remaining>0),log:[]};
   })}));
  resetScreen();
 };
 const addPlayer=()=>{const n=name.trim();if(!n)return;setGame(g=>({...g,players:[...g.players,newPlayer(n)]}));setName('')};
 const deletePlayer=id=>{if(game.players.length<2)return;setGame(g=>({...g,players:g.players.filter(p=>p.id!==id),selected:g.selected===id?g.players.find(p=>p.id!==id)?.id:g.selected}));resetScreen()};
 const takeImmunity=()=>{updatePlayer(selected.id,p=>({...p,immunity:Math.max(0,p.immunity-1),drawn:Math.min(p.required,p.drawn+1),log:[...p.log,{id:uid(),name:'Doom Immunity used',text:'Skipped one required punishment',categoryId:'chaos'}]}));resetScreen()};
 const entries=stage==='fate'?categories:categories[categoryIndex??0].challenges;
 const remaining=selected?Math.max(0,selected.required-selected.drawn):0;
 return <div className="app">
 <header><div className="eyebrow">🥏 THE ULTIMATE DISC GOLF PARTY GAME</div><h1>OH YEAH! <span>DISC GOLF TIME</span></h1><p className="subtitle">WHEEL OF DOOM • TWO-STAGE RANDOMIZER</p></header>
 <div className="topline"><div className="hole-badge"><small>NOW PLAYING</small><strong>HOLE {game.hole}</strong></div><div className="stat"><b>{totalChallenges}</b><small>CHALLENGES</small></div><div className="stat"><b>5</b><small>WHEELS</small></div><button className="ghost small" onClick={()=>setBrowse(b=>!b)}>{browse?'Hide':'View all'} challenges</button></div>
 {browse && <section className="panel catalogue"><h2>All {totalChallenges} challenges</h2><p>The exact approved list, with Risk It replaced by Closest Tree Challenge. Every challenge is for the whole hole unless it explicitly lasts longer.</p>{categories.map(c=><details key={c.id} open><summary style={{color:c.color}}>{c.title} ({c.challenges.length})</summary><div className="catalogue-grid">{c.challenges.map(x=><div key={x.name}><b>{x.name}</b><small>{x.text}</small></div>)}</div></details>)}</section>}
 <section className="panel"><div className="section-head"><h2>Players</h2><span>Every player spins every hole</span></div>
 <div className="players">{game.players.map(p=><div key={p.id} className={'player '+(selected?.id===p.id?'active':'')}>
 <button className="player-select" disabled={spinning} onClick={()=>switchPlayer(p.id)}><b>{p.name}</b><small>{p.drawn}/{p.required} spins {p.nextDebt>0?`• ${p.nextDebt} NEXT HOLE`:''}</small></button>
 <button aria-label={`Delete ${p.name}`} title="Delete player" className="remove" disabled={spinning||game.players.length===1} onClick={()=>deletePlayer(p.id)}>×</button>
 </div>)}</div>
 <div className="add-row"><input value={name} maxLength={24} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPlayer()} placeholder="Enter player name"/><button onClick={addPlayer}>+ Add player</button></div>
 </section>
 <main className="panel main-panel">
 <div className="section-head"><h2>{selected?.name}'s turn</h2><span>{remaining? `${remaining} spin${remaining===1?'':'s'} remaining`:'All spins complete'}</span></div>
 <div className="steps"><span className={stage==='fate'?'step-on':''}>① WHEEL OF FATE</span><span>→</span><span className={stage==='category'?'step-on':''}>② CHALLENGE WHEEL</span><span>→</span><span className={stage==='result'?'step-on':''}>③ DOOM</span></div>
 <div className="wheel-layout"><Wheel entries={entries} color={stage==='fate'?'#4b7ded':categories[categoryIndex??0].color} label={stage==='fate'?'WHEEL OF FATE':categories[categoryIndex??0].short} spinData={spinData} spinning={spinning}/>
 <div className="wheel-controls">
 {stage==='fate' && <><div className="eyebrow">STEP ONE</div><h2>SPIN FOR YOUR FATE</h2><p>Find out which of the four challenge wheels gets to decide your punishment.</p><button className="primary" disabled={spinning||remaining<=0} onClick={startFate}>{spinning?'SPINNING…':remaining>0?'🎲 SPIN WHEEL OF FATE':'✓ TURN COMPLETE'}</button></>}
 {stage==='category' && <><div className="eyebrow">STEP TWO</div><h2 style={{color:categories[categoryIndex].color}}>{categories[categoryIndex].title}</h2><p>{categories[categoryIndex].challenges.length} possible outcomes. All punishments apply for this entire hole.</p><button className="primary" disabled={spinning} onClick={startChallenge}>{spinning?'SPINNING…':'🥏 SPIN CHALLENGE WHEEL'}</button></>}
 {stage==='result'&&result&&<><div className="eyebrow">YOUR DOOM IS…</div><h2 style={{color:colorFor(result.categoryId)}}>{result.name}</h2><p className="result-desc">{result.text}</p><div className="tag">WHOLE HOLE • HOLE {game.hole}</div>
 {result.effect==='risk' && selected.risks.some(r=>r.id===result.id&&r.status==='pending')&&<div className="risk-buttons"><p><b>After the hole, did you succeed?</b><br/><small>Failure schedules TWO spins NEXT HOLE. It will not add a spin now.</small></p><button className="success" onClick={()=>resolveRisk(result.id,true)}>✓ Success</button><button className="danger" onClick={()=>resolveRisk(result.id,false)}>✕ Failed</button></div>}
 {result.effect==='target'&&<div className="risk-buttons"><p>Choose who gets an extra spin this hole:</p><select value={target} onChange={e=>setTarget(e.target.value)}><option value="">Choose player</option>{game.players.filter(p=>p.id!==selected.id).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select><button onClick={applyTarget} disabled={!target}>Assign extra spin</button></div>}
 {result.effect==='choice'&&<div className="risk-buttons"><p>Choose your outcome:</p><button onClick={choiceExtra}>Take two extra spins</button><button onClick={choiceStroke}>Take +1 stroke</button></div>}
 <button className="primary" onClick={resetScreen} disabled={spinning}>↩ Return to Wheel</button></>}
 </div></div>
 {selected?.immunity>0 && remaining>0 && stage==='fate'&&<button className="ghost" onClick={takeImmunity}>🛡 Use Doom Immunity to skip a punishment ({selected.immunity} available)</button>}
 {selected?.risks.some(r=>r.status==='pending')&&<div className="risk-summary"><h3>Risk challenges awaiting outcome</h3>{selected.risks.filter(r=>r.status==='pending').map(r=><div className="risk-line" key={r.id}><b>{r.name}</b><button className="success small" onClick={()=>resolveRisk(r.id,true)}>Success</button><button className="danger small" onClick={()=>resolveRisk(r.id,false)}>Failed</button></div>)}</div>}
 <div className="notice">⚠ A failed risk challenge NEVER increases spins on the current hole. It adds a two-spin obligation for the next hole when you press Next Hole.</div>
 </main>
 <section className="panel"><div className="section-head"><h2>Hole tracker</h2><button className="primary" disabled={spinning} onClick={nextHole}>NEXT HOLE →</button></div>
 <p className="muted">Finish each player's spins. If a risk outcome is still unanswered when moving ahead, it counts as a failure.</p>
 <div className="tracker">{game.players.map(p=><div className="tracker-card" key={p.id}><div className="tracker-title"><b>{p.name}</b><span>{p.drawn}/{p.required} spun</span></div>
 {p.log.length?p.log.map(l=><div className="log" key={l.id}>• {l.name}{l.resolution?` (${l.resolution})`:''}</div>):<small className="muted">No challenges yet</small>}
 {p.bans.length>0&&<small className="warning">Active bans: {p.bans.map(b=>`${b.name} (${b.remaining} hole${b.remaining===1?'':'s'})`).join(', ')}</small>}
 {p.risks.map(r=><small className="muted" key={r.id}>{r.name}: {r.status}</small>)}
 {p.nextDebt>0&&<div className="next-debt">⚡ 2 spins scheduled for NEXT hole</div>}
 </div>)}</div>
 </section>
 <footer><button className="ghost small" onClick={()=>setConfirmReset(!confirmReset)}>Reset game</button>{confirmReset&&<div className="reset-confirm"><span>Delete all players and restart at hole 1?</span><button className="danger small" onClick={()=>{setGame(initial());resetScreen();setConfirmReset(false)}}>Yes, reset</button><button className="ghost small" onClick={()=>setConfirmReset(false)}>Cancel</button></div>}<p>Game saves automatically in this browser. Play safely and follow course rules.</p></footer>
 </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
