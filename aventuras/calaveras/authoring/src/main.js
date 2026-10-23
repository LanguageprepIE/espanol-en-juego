import {Game} from './game.js';
import {Input} from './input.js';
import {Renderer} from './render.js';
import {zones} from './level.js';
import {ASSET_FILES} from './art.js';
const $=s=>document.querySelector(s),canvas=$('#game'),overlay=$('#overlay');
let sound=false,audio=null,messageTime=0,previousMode='title',lastMode='title',frame=0;
function tone(freq){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=freq;o.connect(g);g.connect(audio.destination);g.gain.setValueAtTime(.025,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.2);o.start();o.stop(audio.currentTime+.21)}catch{}}
function notify(text,seconds=4){$('#message').textContent=text;$('#message').classList.add('show');messageTime=seconds;}
const game=new Game(notify,tone);
function pause(onlyPause=false){if(game.mode==='play'){game.mode='paused';input.clear();showPause()}else if(game.mode==='paused'&&!onlyPause)resume();}
const input=new Input(pause);
let touchMode='auto';
$('#touchToggle').onclick=()=>{touchMode=touchMode==='auto'?'on':touchMode==='on'?'off':'auto';document.body.classList.toggle('touch-on',touchMode==='on');document.body.classList.toggle('touch-off',touchMode==='off');$('#touchToggle').textContent='Controles: '+({auto:'auto',on:'sí',off:'no'}[touchMode]);input.clear();canvas.focus()};
const conversationDialog=$('#conversation');let conversationKey='';
function syncConversation(){
 const d=game.conversation;if(!d){if(conversationDialog.open)conversationDialog.close();conversationKey='';return}
 input.clear();if(!conversationDialog.open)conversationDialog.showModal();
 const key=d.serial+'|'+d.correct+'|'+d.feedback;if(key===conversationKey)return;conversationKey=key;
 $('#speaker').textContent=d.name;$('#conversationIntro').textContent=d.intro;$('#question').textContent=d.question.text;
 $('#conversationProgress').textContent=d.kind==='npc'?'CONVERSACIÓN · '+(d.index+1)+' / 2':'RECUERDO · '+(game.boss.seals+1)+' / 3';
 const portrait=$('#portrait').getContext('2d'),i=d.kind==='npc'?d.npc.frame:5;portrait.clearRect(0,0,128,128);portrait.drawImage(assets.characters,(i%3)*256,Math.floor(i/3)*256,256,256,0,0,128,128);
 $('#answers').replaceChildren();for(const [i,text] of d.question.options.entries()){const b=document.createElement('button');b.textContent=text;b.disabled=d.correct;b.onclick=()=>{game.answer(i);syncConversation()};$('#answers').append(b)}
 $('#answerFeedback').textContent=d.feedback;$('#nextAnswer').hidden=!d.correct;$('#leaveConversation').hidden=d.kind==='boss';
 if(d.correct)$('#nextAnswer').focus();else $('#answers button').focus();
}
$('#nextAnswer').onclick=()=>{game.continueConversation();syncConversation();if(game.mode==='play')canvas.focus()};
function leaveConversation(){if(game.dialogue?.kind==='boss')return;game.dialogue=null;game.mode='play';input.clear();syncConversation();canvas.focus()}
$('#leaveConversation').onclick=leaveConversation;conversationDialog.addEventListener('cancel',e=>{e.preventDefault();leaveConversation()});

function resume(){game.mode='play';overlay.hidden=true;overlay.style.display='none';input.clear();canvas.focus()}
function showPause(){overlay.hidden=false;overlay.style.display='flex';overlay.innerHTML='<div class="intro"><p class="eyebrow">EL CAMINO PUEDE ESPERAR</p><h1>Un pequeño<br><em>descanso.</em></h1><p>Tu aventura sigue aquí.</p><button class="primary" id="resume">Continuar →</button><button id="restart">Volver al comienzo</button></div>';$('#resume').onclick=resume;$('#restart').onclick=()=>{game.reset();resume()};$('#resume').focus()}
function start(){game.reset();resume();notify('Luz: «Tres faroles, tres recuerdos. El sendero te llevará a casa.»',6)}
$('#start').onclick=start;$('#pause').onclick=()=>pause();$('#sound').onclick=()=>{sound=!sound;$('#sound').textContent='Sonido: '+(sound?'sí':'no');$('#sound').setAttribute('aria-pressed',String(sound));if(sound)tone(660);canvas.focus()};
$('#help').onclick=()=>{previousMode=game.mode;if(game.mode==='play')game.mode='paused';input.clear();$('#helpDialog').showModal()};
function closeHelp(){ $('#helpDialog').close();if(previousMode==='play')resume();else game.mode=previousMode;}
$('#closeHelp').onclick=closeHelp;$('#helpDialog').addEventListener('cancel',e=>{e.preventDefault();closeHelp()});
$('#full').onclick=async()=>{const stage=$('#stage');try{if(document.fullscreenElement)await document.exitFullscreen();else if(stage.requestFullscreen)await stage.requestFullscreen();else document.body.classList.toggle('expanded')}catch{document.body.classList.toggle('expanded')}canvas.focus()};
function endScreen(){overlay.hidden=false;overlay.style.display='flex';const won=game.mode==='win';const mins=Math.floor(game.elapsed/60),secs=Math.floor(game.elapsed%60).toString().padStart(2,'0');overlay.innerHTML=`<div class="intro"><p class="eyebrow">${won?'EL SENDERO DE LAS FLORES · COMPLETADO':'LOS RECUERDOS NO SE PIERDEN'}</p><h1>${won?'Has vuelto<br><em>a casa.</em>':'La noche<br><em>continúa.</em>'}</h1><p>${won?'«Mientras recordamos a quienes queremos, su luz nos acompaña.»':'Cada salto te acerca. Puedes continuar desde tu último farol con tres vidas nuevas.'}</p><p>${game.collected} flores · ${game.lit}/3 faroles · ${mins}:${secs}${game.secret?' · Jardín secreto encontrado':''}</p><button class="primary" id="again">${won?'Recorrer otra vez →':'Continuar desde el farol →'}</button>${won?'':'<button id="new">Empezar de nuevo</button>'}</div>`;$('#again').onclick=()=>{if(won)start();else{game.lives=3;game.respawn();resume()}};if($('#new'))$('#new').onclick=start;$('#again').focus();}
const assets={};async function load(name,url){assets[name]=new Image();assets[name].src=url;await assets[name].decode()}
try{await Promise.all(Object.entries(ASSET_FILES).map(([name,url])=>load(name,url)));}catch{notify('No se han cargado las ilustraciones. Vuelve a abrir el juego.',60);$('#start').disabled=true;throw new Error('Assets could not be loaded')}
const renderer=new Renderer(canvas,assets);if(location.search.includes('qa=1'))renderer.debug=true;
let auditRunner=null;const frameStats={samples:0,total:0,max:0,slow:0};
let previous=performance.now(),accumulator=0;const FIXED=1/120;let hudTime=0;
function loop(now){const rawDt=(now-previous)/1000;if(game.mode==='play'){frameStats.samples++;frameStats.total+=rawDt;frameStats.max=Math.max(frameStats.max,rawDt);if(rawDt>1/30)frameStats.slow++;}let dt=Math.min(.05,rawDt);previous=now;accumulator+=dt*(auditRunner&&!['win','over'].includes(game.mode)?32:1);let first=true;while(accumulator>=FIXED){game.update(FIXED,auditRunner&&!['win','over'].includes(game.mode)?auditRunner.input(game,FIXED):first?input.sample():{...input.keys});if(first){input.consume();first=false}accumulator-=FIXED;}
 if(game.mode==='title')game.time+=dt;
 renderer.draw(game);syncConversation();
 if(messageTime>0){messageTime-=dt;if(messageTime<=0)$('#message').classList.remove('show')}
 hudTime+=dt;if(hudTime>.1){hudTime=0;$('#phase').textContent=game.phase.name;$('#zone').textContent=zones[Math.max(0,game.zone)].name;$('#lives').textContent=game.lives+' vidas · '+game.hearts+'/3 energía';$('#flowers').textContent=game.collected+' flores';$('#lanterns').textContent=game.lit+' / 3 faroles';$('#prompt').textContent=game.mode==='play'?game.nearbyPrompt():'';}
 if(game.mode!==lastMode){if(game.mode==='win'||game.mode==='over')endScreen();lastMode=game.mode}
 frame++;requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
// Deterministic QA panel only in an explicitly selected local QA route.
if(location.search.includes('qa=1')){
 const {AuditRunner}=await import('./audit-runner.js');
 const panel=document.createElement('div');panel.id='qa';panel.style='padding:12px;display:flex;gap:8px;flex-wrap:wrap';document.body.append(panel);
 const out=document.createElement('output');out.id='qaState';document.body.append(out);
 const auditOut=document.createElement('output');auditOut.id='auditResult';auditOut.textContent='Audit not started';document.body.append(auditOut);
 const actions={'QA Complete Run (32x)':()=>{start();auditRunner=new AuditRunner(game);auditOut.textContent='Audit running';},'QA Right':()=>{auditRunner=null;input.clear();input.keys={right:true,run:true}},'QA Left':()=>{auditRunner=null;input.clear();input.keys={left:true,run:true}},'QA Stop':()=>input.clear(),'QA Jump':()=>{input.just.jump=true;input.keys.jump=true;setTimeout(()=>input.keys.jump=false,480)},'QA Touch':()=>document.body.classList.toggle('touch-preview'),'QA Start':()=>{auditRunner=null;start()},'QA Luz':()=>warp(280,540),'QA Inés':()=>warp(7950,540),'QA Tomás':()=>warp(16680,540),'QA Guardian':()=>{start();game.level.lanterns.forEach(l=>l.on=true);warp(22880,540)},'QA Lantern 1':()=>warp(4300,145),'QA Lantern 2':()=>warp(10900,145),'QA Lantern 3':()=>warp(17900,145),'QA Feather':()=>warp(3020,230),'QA Secret':()=>warp(1585,210),'QA Enemy':()=>warp(2120,480),'QA Fall':()=>warp(1000,860),'QA Damage':()=>{game.p.inv=0;game.p.power=0;game.damage()},'QA Goal':()=>warp(22900,500),'QA Reset':start};
 function warp(x,y){game.p.x=x;game.p.y=y;game.p.vx=game.p.vy=0;game.camera=Math.max(0,x-440)}
 for(const[label,fn]of Object.entries(actions)){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{fn();canvas.focus();};panel.append(b)}
 setInterval(()=>{if(auditRunner&&['win','over'].includes(game.mode))auditOut.textContent='Audit '+game.mode+' · '+JSON.stringify({steps:auditRunner.steps,nodes:auditRunner.trace.length,lit:game.lit,lives:game.lives,elapsed:game.elapsed,frames:frameStats});out.textContent=JSON.stringify({mode:game.mode,x:Math.round(game.p.x),y:Math.round(game.p.y),state:game.p.state,ground:game.p.ground,flowers:game.collected,lit:game.lit,hearts:game.hearts,lives:game.lives,power:Math.round(game.p.power),secret:game.secret,frames:frame,elapsed:Math.round(game.elapsed),auditNode:auditRunner?.index,telemetry:game.telemetry,input:input.metrics})},250);
}
