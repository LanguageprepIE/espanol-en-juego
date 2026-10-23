import {createLevel,LEVEL_WIDTH,zones} from './level.js';
import {playerAt,movePlayer,movePlatforms,overlap,jetActive} from './physics.js';
import {NPCS,GUARDIAN_QUESTIONS,PHASES,phaseAt} from './story.js';
export class Game{
 constructor(notify=()=>{},sound=()=>{}){this.notify=notify;this.sound=sound;this.reset();this.mode='title'}
 reset(){this.level=createLevel();this.p=playerAt();this.time=0;this.elapsed=0;this.camera=0;this.lives=3;this.hearts=3;this.collected=0;this.zone=-1;this.checkpoint={x:90,y:540};this.mode='play';this.particles=[];this.deathTimer=0;this.secret=false;this.toast=0;this.farthest=0;this.wonAt=0;this.zoneTransition=0;this.chapterTransition=0;this.phaseIndex=0;this.telemetry={jumps:0,landings:0,minY:540};this.npcs=NPCS.map(n=>({...n,done:false,progress:0}));this.answeredIds=new Set();this.dialogue=null;this.dialogueSerial=0;this.boss={x:23030,y:512,w:90,h:90,seals:0,active:false,defeated:false,timer:0,waves:[],state:'idle'};}
 get phase(){return phaseAt(this.p.x)}
 get phaseObjective(){const index=this.phase.number-1,lantern=this.level.lanterns[index];return lantern.on?(index===2?'Cruza el puente y libera al Guardián.':'Farol encendido · Sigue hacia '+PHASES[index+1].title.toLowerCase()+'.'):this.phase.objective;}
 talk(n){if(n.done){this.notify(n.name+': «¡Buen viaje! Sigue las flores.»');return}this.dialogue={kind:'npc',npc:n,index:n.progress,feedback:'',correct:false,serial:++this.dialogueSerial};this.mode='dialogue';}
 get conversation(){const d=this.dialogue;if(!d)return null;return {...d,name:d.kind==='npc'?d.npc.name:'El Guardián de la Niebla',intro:d.kind==='npc'?d.npc.intro:'La niebla se disipa con lo que has aprendido. Recupera un recuerdo de cada lugar.',question:d.kind==='npc'?d.npc.questions[d.index]:GUARDIAN_QUESTIONS[this.boss.seals]};}
 answer(index){const d=this.dialogue,q=this.conversation?.question;if(!d||d.correct||!Number.isInteger(index)||index<0||index>=q.options.length)return false;if(index!==q.correct){d.feedback='Casi. Puedes abrir la pista y volver a intentarlo. No pierdes vidas.';return false}d.correct=true;this.answeredIds.add(q.id);d.feedback='¡Muy bien! '+q.explanation;this.sound(960);return true;}
 leaveConversation(){const d=this.dialogue;if(!d||d.kind==='boss')return false;if(d.correct){this.continueConversation();if(this.mode==='play')return true}this.p.inv=2;this.dialogue=null;this.mode='play';return true;}
 continueConversation(){const d=this.dialogue;if(!d?.correct)return;if(d.kind==='npc'){d.npc.progress=d.index+1;if(d.npc.progress<d.npc.questions.length){d.index++;d.correct=false;d.feedback='';d.serial=++this.dialogueSerial;return}d.npc.done=true;this.hearts=3;if(d.npc.x>this.checkpoint.x)this.checkpoint={x:d.npc.x,y:540};if(d.npc.rewardKind==='power')this.p.power=18;else if(d.npc.rewardKind==='life')this.lives++;else this.collected+=8;this.notify(d.npc.name+': «¡Muy bien! '+d.npc.reward+'.»');}else{this.boss.seals++;this.boss.timer=0;this.boss.waves=[];this.boss.defeated=this.boss.seals===3;this.boss.state=this.boss.defeated?'friendly':'idle';this.hearts=3;this.notify(this.boss.defeated?'Guardián: «¡Ahora recuerdo! Gracias. El camino a casa está abierto.»':'Un recuerdo liberado · '+this.boss.seals+' / 3');}this.p.inv=2;this.dialogue=null;this.mode='play';}
 updateGuardian(dt){const b=this.boss,p=this.p;if(b.defeated)return;if(this.lit===3&&p.x>22600&&!b.active){b.active=true;b.timer=0;this.checkpoint={x:22620,y:540};this.hearts=3;this.notify('Guardián de la Niebla · Salta la ráfaga. Cuando baje las alas, salta sobre su cabeza.',7)}if(!b.active)return;const before=b.timer%6;b.timer+=dt;const cycle=b.timer%6;b.state=cycle<1.3?'windup':cycle<1.8?'attack':'tired';if(before<1.3&&cycle>=1.3)b.waves.push({x:b.x-25,y:580,w:50,h:22});for(const w of b.waves){w.x-=270*dt;if(overlap(p,w))this.damage()}b.waves=b.waves.filter(w=>w.x>22540);if(overlap(p,b)){if(b.state==='tired'&&p.vy>80&&p.y+p.h<b.y+26){p.vy=-420;b.waves=[];b.state='hurt';this.dialogue={kind:'boss',index:b.seals,correct:false,feedback:'',serial:++this.dialogueSerial};this.mode='dialogue';this.burst(b.x,b.y,'#7ff4df',35);}else this.damage()}}
 get lit(){return this.level.lanterns.filter(l=>l.on).length}
 burst(x,y,color='#ffc55b',count=18){for(let i=0;i<count;i++)this.particles.push({x,y,vx:(Math.random()-.5)*220,vy:-Math.random()*200,life:.6+Math.random()*.5,color,kind:'petal',maxLife:1.1})}
 dust(x,y,impact){const count=impact>500?9:5;for(let i=0;i<count;i++)this.particles.push({x,y:y-2,vx:(Math.random()-.5)*100,vy:-Math.random()*40,life:.3,maxLife:.3,color:'#d3b696',kind:'dust'});}
 defeatEnemy(e){if(!e.alive)return;e.alive=false;e.anim='hurt';e.animTime=0;e.defeatTime=.7;this.burst(e.x+e.w/2,e.y+e.h/2,e.type==='beetle'?'#ffd191':'#6de8de',16);}
 damage(){const p=this.p;if(p.inv>0||this.mode!=='play')return;if(p.power>0){p.power=0;p.inv=1.8;this.burst(p.x,p.y,'#5ee1d6');this.notify('La pluma te ha protegido.');return}this.hearts--;p.inv=1.8;p.hurtTime=.22;p.vy=-310;p.vx=-p.face*180;this.burst(p.x,p.y,'#e985a2');this.sound(140);if(this.hearts<=0)this.die();else this.notify('¡Cuidado! Busca un farol para recuperar energía.');}
 die(){if(this.mode!=='play')return;this.lives--;this.mode='dying';this.deathTimer=1.1;this.p.state='death';this.p.stateTime=0;this.p.vy=-330;this.sound(100);}
 respawn(){this.p=playerAt(this.checkpoint.x,this.checkpoint.y);this.p.inv=2;this.hearts=3;this.camera=Math.max(0,this.p.x-400);this.mode='play';if(this.checkpoint.x>20600)for(const f of this.level.feathers)f.cooldown=0;this.boss.waves=[];this.boss.timer=0;this.notify('El recuerdo sigue vivo. Vuelves al último farol.');}
 update(dt,input){
 if(this.mode==='dying'){this.deathTimer-=dt;this.p.stateTime+=dt;this.p.vy+=1000*dt;this.p.y+=this.p.vy*dt;if(this.deathTimer<=0){if(this.lives>0)this.respawn();else this.mode='over'}return}
 if(this.mode==='win'){this.time+=dt;this.p.state='victory';this.p.stateTime+=dt;this.updateParticles(dt);return}
 if(this.mode!=='play')return;
 this.time+=dt;this.elapsed+=dt;this.zoneTransition=Math.max(0,this.zoneTransition-dt);this.chapterTransition=Math.max(0,this.chapterTransition-dt);this.toast=Math.max(0,this.toast-dt);const p=this.p;
 const collision=this.lit<3?[...this.level.platforms,this.level.gate]:this.level.platforms;
 movePlatforms(this.level.platforms,this.time,p);const oldJumps=p.jumps;movePlayer(p,input,collision,dt);if(p.jumps>oldJumps)this.telemetry.jumps++;if(p.landed)this.telemetry.landings++;this.telemetry.minY=Math.min(this.telemetry.minY,p.y);if(p.landed&&p.impact>180)this.dust(p.x+p.w/2,p.y+p.h,p.impact);p.x=Math.min(LEVEL_WIDTH-p.w,p.x);
 this.farthest=Math.max(this.farthest,p.x);
 if(p.y>850){this.die();return}
 const oldZone=this.zone;this.zone=zones.findLastIndex(z=>p.x>=z.x);if(this.zone!==oldZone){this.zoneTransition=1.7;this.notify(zones[this.zone].hint,5.5);}
 const nextPhase=PHASES.findLastIndex(phase=>p.x>=phase.x);if(nextPhase>this.phaseIndex){this.phaseIndex=nextPhase;this.chapterTransition=5.8;this.notify(PHASES[nextPhase].title+' · '+PHASES[nextPhase].topic,5.5)}
 for(const f of this.level.flowers)if(!f.got&&overlap(p,f)){f.got=true;this.collected++;this.burst(f.x+12,f.y+12,undefined,9);this.sound(850+this.collected%5*60)}
 for(const f of this.level.feathers){f.cooldown=Math.max(0,f.cooldown-dt);if(f.cooldown===0&&overlap(p,f)){f.cooldown=22;p.power=18;this.burst(f.x,f.y,'#70f4dd',30);this.notify('Pluma de luz · 18 s de protección y doble salto');this.sound(1200)}}
 if(!this.level.secret.got&&overlap(p,this.level.secret)){this.level.secret.got=this.secret=true;this.lives++;this.burst(p.x,p.y,'#8cd8ff',45);this.notify('El jardín secreto · Una flor del recuerdo y una vida extra');this.sound(1320)}
 for(const m of this.level.memories)if(!m.got&&overlap(p,m)){m.got=true;this.collected+=8;this.hearts=3;this.burst(m.x+21,m.y+24,'#92e4e0',30);this.notify(m.name+' encontrado · Ocho flores y energía. '+m.story,7);this.sound(1100)}
 const npc=this.npcs.find(n=>Math.abs(p.x-n.x)<95&&Math.abs(p.y-n.y)<100);if(npc&&input.usePressed){this.talk(npc);if(this.mode==='dialogue')return;}
 for(const l of this.level.lanterns){if(input.usePressed&&Math.abs(p.x-l.x)<85&&Math.abs(p.y-l.y)<95){const alreadyOn=l.on;l.on=true;this.checkpoint={x:l.spawnX,y:l.spawnY};this.hearts=3;this.burst(l.x,l.y,'#ffdb8c',45);this.sound(960);this.notify(alreadyOn?'Recuerdo guardado · Energía recuperada.':this.lit===3?'Los tres recuerdos brillan. El puente a casa está abierto.':`Farol ${this.lit} de 3 · Recuerdo guardado. Energía recuperada.`)}}
 for(const e of this.level.enemies){
 e.animTime=(e.animTime||0)+dt;
 if(!e.alive){e.defeatTime=Math.max(0,(e.defeatTime||0)-dt);if(e.animTime>.2&&e.anim!=='defeat'){e.anim='defeat';e.animTime=0}continue;}
 const attackPhase=(this.time+(e.phase||e.min/100))%4.6;
 const near=Math.abs(p.x-e.x)<330;
 const next=near&&attackPhase>2.9&&attackPhase<3.45?'windup':near&&attackPhase>=3.45&&attackPhase<3.85?'attack':'move';
 if(e.anim!==next){e.anim=next;e.animTime=0}
 if(e.type==='beetle'){
 const speed=e.speed*(e.anim==='windup'?0:e.anim==='attack'?1.8:1);
 e.x+=e.dir*speed*dt;if(e.x<e.min){e.x=e.min;e.dir=1}if(e.x>e.max){e.x=e.max;e.dir=-1}
 }else{e.x=e.baseX+Math.sin(this.time*1.1+e.phase)*145;e.y=e.baseY+Math.sin(this.time*2.4+e.phase)*82+(e.anim==='attack'?48*Math.sin(e.animTime/.4*Math.PI):0);}
 if(overlap(p,e)){
 if((e.type==='beetle'&&p.vy>90&&p.y+p.h<e.y+24)||p.power>0){this.defeatEnemy(e);if(p.power<=0)p.vy=-420;this.sound(420)}else this.damage();
 }
 }
 for(const h of this.level.hazards)if(overlap(p,h)&&(h.type==='thorn'||jetActive(h,this.time)))this.damage();
 if(this.lit===3&&p.x>20600&&this.checkpoint.x<20600){this.checkpoint={x:20630,y:540};this.hearts=3;this.notify('El puente a casa · Último punto de descanso. Recoge la pluma azul.')}
 this.updateGuardian(dt);if(this.mode!=='play')return;
 if(this.lit===3&&this.boss.defeated&&p.ground&&overlap(p,this.level.goal)){this.mode='win';this.wonAt=this.elapsed;p.state='victory';p.stateTime=0;p.vx=0;this.burst(p.x,p.y,'#ffcf79',100);this.sound(1320)}
 const target=Math.max(0,Math.min(LEVEL_WIDTH-1280,p.x-440));this.camera+=(target-this.camera)*Math.min(1,dt*6);
 this.updateParticles(dt);
 }
 updateParticles(dt){for(const a of this.particles){a.life-=dt;a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=300*dt}this.particles=this.particles.filter(a=>a.life>0).slice(-200)}
 nearbyPrompt(){const p=this.p;const npc=this.npcs.find(n=>Math.abs(p.x-n.x)<100&&Math.abs(p.y-n.y)<110);if(npc)return 'E · Hablar con '+npc.name+(npc.done?' · Recuerdo compartido':' · Ayuda y recompensa');if(this.boss.active&&!this.boss.defeated&&p.x>22600)return this.boss.state==='windup'?'¡Prepara el salto! Viene una ráfaga':this.boss.state==='tired'?'¡Ahora! Salta sobre su cabeza':'Salta la ráfaga y espera a que baje las alas';const l=this.level.lanterns.find(l=>Math.abs(p.x-l.x)<100&&Math.abs(p.y-l.y)<110);if(l)return l.on?'E · Descansa y recupera energía':'E · Enciende el farol del recuerdo';if(this.lit<3&&Math.abs(p.x-this.level.gate.x)<220)return'El puente espera los tres faroles · '+this.lit+' / 3';if(p.power>0)return'Pluma de luz · '+Math.ceil(p.power)+' s · Doble salto';const next=this.level.lanterns.find(l=>!l.on);if(next&&p.x>next.x+250)return'Te falta un farol: vuelve a la izquierda y busca arriba';if(next&&Math.abs(p.x-next.x)<1050)return'El farol está arriba · Sigue las terrazas';return''}
}
