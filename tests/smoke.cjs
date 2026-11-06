/**
 * G32 Pinball Tycoon — automated regression smoke tests
 * Usage: node tests/smoke.cjs
 * Requires Node 18+. No NPM dependencies or browser required.
 *
 * Mocks Canvas drawing and browser UI interactions, but cannot replace
 * a full real-browser visual or performance playtest.
 */
function runSmoke(source) {
  const code = source.slice(source.indexOf('<script>')+8, source.lastIndexOf('</script>'));
  if (!code || source.lastIndexOf('</script>') < 0) throw Error('Game script missing');
  const tests = [];
  function ok(condition, name) { if (!condition) throw Error('FAILED: '+name); tests.push(name); }
  const names = {
    maps:['uloop','spiral','eight','hourglass','orbital','twins','tower'],
    bumpers:['basic','power','grab','phase','multi','magnet','teleport','splitter','rotating','freeze','multiplier','explosive','chain','conveyor','growing','combo','gravity'],
    balls:['steel','fire','ice','heavy','plasma','super','ghost','gold'],
    machines:['gravity','diverter','magnet','emergency','jackpot','multiball','speed','elevator'],
    rails:['left','right','top','rescue','spiral','cross','tunnel','split','custom']
  };
  function boot(memory=new Map(),approveReset=true) {
    const nodes={},frames=[],drawing={gradientStops:[],strokes:[],ellipses:0},events={};
    function node(id) {
      if(nodes[id])return nodes[id];
      const handlers={},states=new Set();
      const o={id,dataset:{},hidden:id==='overlay'||id==='context-menu'||id==='drag-ghost',
        style:{},innerHTML:'',textContent:'',value:'0',title:'',disabled:false,
        classList:{toggle(k,v){if(v===undefined)v=!states.has(k);v?states.add(k):states.delete(k);return v},contains:k=>states.has(k)},
        setAttribute(k,v){o[k]=v},querySelector(s){if(s==='.map-cost')return o.mapCost??={textContent:''};return null},
        contains(x){return x===o},
        addEventListener(k,fn){(handlers[k]??=[]).push(fn)},
        click(){o.onclick?.({target:o,preventDefault(){}});for(const fn of handlers.click||[])fn({target:o,preventDefault(){}})},
        fire(k,data={}){const e={target:o,preventDefault(){},pointerId:1,button:0,clientX:200,clientY:200,shiftKey:false,...data};for(const fn of handlers[k]||[])fn(e)},
        getBoundingClientRect(){return {left:0,top:0,right:600,bottom:840,width:600,height:840}},
        setPointerCapture(){},
        getContext(){const g={
          createLinearGradient(){const c=[];drawing.gradientStops.push(c);return {addColorStop(pos,hex){c.push([pos,hex])}}},
          ellipse(){drawing.ellipses++},stroke(){drawing.strokes.push(g.lineWidth||1)},fill(){},fillRect(){},
          save(){},restore(){},setTransform(){},beginPath(){},moveTo(){},lineTo(){},arc(){},
          quadraticCurveTo(){},closePath(){},setLineDash(){},translate(){},rotate(){},fillText(){},strokeRect(){}
        };return g}
      };
      return nodes[id]=o;
    }
    const maps=names.maps.map(mode=>Object.assign(node('map-'+mode),{dataset:{mode}}));
    const bumpers=names.bumpers.map(kind=>Object.assign(node('bumper-'+kind),{dataset:{kind}}));
    const balls=names.balls.map(ball=>Object.assign(node('ball-'+ball),{dataset:{ball}}));
    const machines=names.machines.map(machine=>Object.assign(node('machine-'+machine),{dataset:{machine}}));
    const document={
      getElementById:node,
      querySelectorAll(q){
        if(q==='.mode')return maps;
        if(q==='.shop-item'||q==='#bumper-shop .shop-item')return bumpers;
        if(q==='#ball-shop .ball-item')return balls;
        if(q==='[data-machine]')return machines;
        return [];
      },
      querySelector(q){return machines.find(x=>q===`[data-machine="${x.dataset.machine}"]`)||null},
      body:{style:{}},documentElement:{style:{setProperty(){}},requestFullscreen:async()=>{}},
      addEventListener(k,fn){(events['document:'+k]??=[]).push(fn)}
    };
    const window={innerWidth:1200,innerHeight:900,addEventListener(k,fn){(events[k]??=[]).push(fn)}};
    const storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
    new Function('document','window','localStorage','performance','requestAnimationFrame','confirm',code)(
      document,window,storage,{now:()=>0},fn=>frames.push(fn),()=>approveReset
    );
    return {api:window.__pinballTest,node,maps,bumpers,balls,machines,frames,drawing,memory,events};
  }
  const main=boot(),g=main.api;
  ok(g.get().mode==='uloop'&&g.get().mapUnlocks.uloop,'MAP01 free starter world');
  ok(!g.get().mapUnlocks.spiral,'MAP02 starts locked');
  ok(main.maps[1].mapCost.textContent.includes('650'),'MAP02 price visible');
  main.maps[1].click();ok(g.get().mode==='uloop','locked world rejects unaffordable purchase');
  g.walletSet(900);main.maps[1].click();ok(g.get().mode==='spiral'&&g.get().wallet===250,'MAP02 unlock deducts correct amount');
  g.chooseMode('uloop');g.chooseMode('spiral');ok(g.get().wallet===250,'already unlocked world costs nothing');
  g.walletSet(200000);
  let time=0;
  for(const id of names.maps){
    ok(g.chooseMode(id)!==false,'world '+id+' selectable');
    g.step(150);const tick=main.frames.shift();ok(typeof tick==='function','world '+id+' animation callback exists');tick(time+=16);
  }
  ok(main.drawing.ellipses>30,'faded scenic artwork draws');
  ok(main.drawing.strokes.some(w=>w>=21),'thick raised rail shells draw');
  ok(main.drawing.gradientStops.some(g=>g.some(([,c])=>c==='#2f6c94')),'summer sky gradient draws');
  g.toggleBuild(true);
  const free=kind=>Array.from({length:49},(_,i)=>i).find(i=>g.canBuild(i,kind));
  for(const kind of names.bumpers){
    const btn=main.bumpers.find(x=>x.dataset.kind===kind);btn.click();
    if(!g.get().isBuild)g.toggleBuild(true);
    const at=free(kind);ok(at!==undefined,'socket available for '+kind);
    g.selectPeg(at);ok(g.get().parts.some(p=>p.kind===kind),'bought '+kind+' bumper');
  }
  g.toggleBuild(false);
  for(const ball of names.balls){
    main.balls.find(x=>x.dataset.ball===ball).click();
    while(g.get().balls>=6){g.setBall(300,890,0,750);g.step(3)}
    ok(g.dropBall(true),'ball '+ball+' can be purchased');
    ok(g.get().ballStates.at(-1).type===ball,'ball '+ball+' spawns with its type');
  }
  for(const id of names.machines){
    main.machines.find(x=>x.dataset.machine===id).click();
    ok(g.get().ownedMachines[id]===true,'machine '+id+' purchased');
  }
  main.node('save-plan').click();ok(g.get().blueprints[0].parts===17,'blueprint saves 17 bumpers');
  main.node('research').click();ok(g.get().researchLevel===1,'research purchase works');
  g.walletSet(76);g.dropBall(true);ok(g.get().wallet===76,'protected balance prevents ball purchase');
  g.cashChange(-100);ok(g.get().wallet===75,'balance cannot go below $75');
  const reloaded=boot(main.memory);
  ok(reloaded.api.get().mapUnlocks.tower===true,'unlocks survive browser reload');
  ok(reloaded.api.get().parts.length===17,'bumper placements survive reload');
  const legacy=new Map([['nexus-pinball-tycoon-v2',JSON.stringify({wallet:1200,score:200,mode:'twins',parts:[],rails:{}})]]);
  const migrated=boot(legacy);
  ok(migrated.api.get().mapUnlocks.twins===true,'previous selected map preserved on migration');
  ok(!migrated.api.get().mapUnlocks.orbital,'migration does not unlock every map');

  // Fresh test rigs for physics, rails, and flippers.
  const p=boot(),a=p.api;a.walletSet(50000);a.chooseMode('hourglass');a.toggleBuild(true);
  const slot=Array.from({length:49},(_,i)=>i).find(i=>a.canBuild(i,'basic'));
  a.selectPeg(slot);a.toggleBuild(false);
  const x=102+(slot%7)*63,y=187+Math.floor(slot/7)*68;
  a.setBall(x,y-70,0,680);a.step(16);
  ok(a.get().score>0,'solid bumper scores on collision');
  ok(a.get().ballStates[0].vy<0,'solid bumper reflects a falling ball');
  a.setBall(285,860,0,800);a.step(7);ok(a.get().balls>=1,'free ball automatically respawns');
  a.hold('left',true);a.step(45);ok(a.get().flippers.left<-.5,'flipper rotates smoothly to held position');
  a.hold('left',false);a.step(45);ok(a.get().flippers.left>.05,'flipper smoothly returns');

  a.walletSet(50000);
  for(const id of names.rails.slice(0,8)){p.node('rail-'+id).click();ok(a.get().rails[id]===true,'rail '+id+' purchased')}
  p.node('rail-custom').click();
  p.node('board').onpointerdown({clientX:165,clientY:187,pointerId:1,button:0,preventDefault(){}});
  p.node('board').fire('pointerup',{clientX:165,clientY:187,pointerId:1});
  p.node('board').onpointerdown({clientX:417,clientY:595,pointerId:2,button:0,preventDefault(){}});
  p.node('board').fire('pointerup',{clientX:417,clientY:595,pointerId:2});
  ok(a.get().rails.custom===true,'custom rail built from two selected pegs');
  const thickBefore=p.drawing.strokes.filter(w=>w>=21).length;
  const railFrame=p.frames.shift();railFrame(16);
  const thickAfter=p.drawing.strokes.filter(w=>w>=21).length;
  ok(thickAfter-thickBefore>=12,'purchased rail network renders multiple raised metal sides and rims');
  a.toggleBuild(false);a.setBall(71,497,0,-100);a.step(2);
  ok(a.get().ballStates[0].path==='rail','ball captures into rail entrance');
  const pts=a.get().score;a.step(800);
  ok(a.get().score>pts&&a.get().totalRailTrips>=1,'rail markers + jackpot score and exit');
  a.chooseMode('orbital');a.setBall(400,369,0,0);a.step(70);
  ok(a.get().ballStates[0].vx<0,'orbital gravity pulls toward central well');
  a.walletSet(76);a.cashChange(-1000);ok(a.get().wallet===75,'maintenance-safe floor works after all upgrades');

  // Seven actual playfield silhouettes, not just seven colors.
  const geo=boot(),shapeGame=geo.api,signatures=new Set();
  for(const id of names.maps){
    shapeGame.walletSet(100000);
    shapeGame.chooseMode(id);
    const outline=shapeGame.worldOutline();
    const signature=outline.map(p=>p.join(',')).join(';');
    ok(!signatures.has(signature),'unique wall silhouette on '+id);
    signatures.add(signature);
    ok(outline.length>=10,'world '+id+' has a full geometric wall outline');
    const buildable=Array.from({length:49},(_,i)=>i).filter(i=>shapeGame.canBuild(i,'basic'));
    ok(buildable.length>=5,'world '+id+' offers at least 5 valid Basic sockets');
    const candidates=[];
    for(let j=0;j<outline.length-1;j++){
      const p=outline[j],q=outline[j+1],dx=q[0]-p[0],dy=q[1]-p[1],length=Math.hypot(dx,dy);
      if(length<35)continue;
      const nx=-dy/length,ny=dx/length,mx=(p[0]+q[0])*.5,my=(p[1]+q[1])*.5;
      if(nx>.67&&my>235&&my<585&&mx<215)candidates.push({nx,ny,mx,my});
    }
    ok(candidates.length>0,'left collision wall exists on '+id);
    const wall=candidates[0];
    shapeGame.setBall(wall.mx+wall.nx*19,wall.my+wall.ny*19,-wall.nx*480,-wall.ny*480);
    shapeGame.step(12);
    const hit=shapeGame.get().ballStates[0];
    ok(hit.vx*wall.nx+hit.vy*wall.ny>0,'solid shaped wall reflects the ball on '+id);
  }
  ok(signatures.size===7,'all seven outlines are different');

  // A full progress reset clears the persisted game economy as well as the session.
  const fresh=boot(),reset=fresh.api;
  reset.walletSet(20000);
  reset.chooseMode('twins');
  reset.toggleBuild(true);
  const spotReset=Array.from({length:49},(_,i)=>i).find(i=>reset.canBuild(i,'basic'));
  reset.selectPeg(spotReset);
  reset.toggleBuild(false);
  fresh.machines[0].click();
  fresh.node('research').click();
  fresh.node('save-plan').click();
  ok(reset.get().parts.length===1&&reset.get().researchLevel===1,'reset test account has real progress to clear');
  const declined=boot(new Map(fresh.memory),false).api;
  const moneyBeforeDecline=declined.get().wallet;
  ok(declined.resetProgress()===false&&declined.get().wallet===moneyBeforeDecline,'canceling reset leaves progress untouched');
  ok(reset.resetProgress()===true,'reset confirmation accepts full deletion');
  const cleared=reset.get();
  ok(cleared.wallet===280&&cleared.score===0&&cleared.best===0,'reset restores starter wallet and clears scores');
  ok(cleared.mode==='uloop'&&Object.keys(cleared.mapUnlocks).length===1&&cleared.mapUnlocks.uloop,'reset relocks every world except MAP01');
  ok(cleared.parts.length===0&&Object.values(cleared.rails).every(v=>!v),'reset removes purchased bumpers and rails');
  ok(cleared.balls===1&&cleared.ballStates[0].type==='steel','reset restores one standard free ball');
  ok(cleared.researchLevel===0&&cleared.contractsDone===0&&cleared.prestigeLevel===0,'reset clears research, contracts and prestige');
  ok(cleared.blueprints.every(v=>v===null),'reset clears all three blueprints');
  ok(Object.values(cleared.ownedMachines).every(v=>!v),'reset clears owned machines');
  const resetReload=boot(fresh.memory).api.get();
  ok(resetReload.wallet===280&&resetReload.mode==='uloop'&&resetReload.parts.length===0,
    'reset progress remains reset after browser reload');

  // Long-running simulation stability.
  for(const id of names.maps){a.walletSet(200000);a.chooseMode(id);a.step(1400);
    ok(a.get().balls>=1,'continuous play retains a ball on '+id);
    ok(a.get().ballStates.every(b=>Number.isFinite(b.x)&&Number.isFinite(b.y)),'finite ball coordinates on '+id);
  }
  return {passed:tests.length,tests,rendering:{ellipses:main.drawing.ellipses,raisedRailStrokes:main.drawing.strokes.filter(v=>v>=21).length},testedCategories:Object.fromEntries(Object.entries(names).map(([k,v])=>[k,v.length]))};
}
if(typeof require==='function'&&typeof module!=='undefined'&&require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 try{const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');const r=runSmoke(html);console.log('PASS '+r.passed+' Pinball Tycoon checks');console.log(r.rendering)}
 catch(e){console.error(e.stack||e);process.exitCode=1}
}
