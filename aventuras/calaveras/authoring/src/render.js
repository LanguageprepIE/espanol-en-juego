import {jetActive,jetWarning} from './physics.js';
import {zones} from './level.js';
import {ART} from './art.js';
import {heroFrame,enemyFrame,tileOffsets,HERO_CLIPS} from './animation.js';
import {PHASES,sceneWeights} from './story.js';
const MATERIALS={stone:0,wood:1,mobile:3,ground:4,roots:5,terrace:6,step:4};
// Measured walkable deck within the trimmed illustration, normalized 0..1.
export const SURFACE_CONTACT=[.31,.47,.25,.06,.18,.16,.04,.17];
export function surfaceRect(a,height){const i=MATERIALS[a.material]??0;return{x:a.x,y:a.y-SURFACE_CONTACT[i]*height,w:a.w,h:height,index:i,contactY:a.y};}
export class Renderer{
 constructor(canvas,assets){this.canvas=canvas;this.c=canvas.getContext('2d',{alpha:false});this.assets=assets;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.glows=new Map();this.debug=false;this.framesDrawn=0;this.platformDraws=0;}
 glow(x,y,r,color){const c=this.c;let img=this.glows.get(color);if(!img){img=document.createElement('canvas');img.width=img.height=128;const g=img.getContext('2d'),gradient=g.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,color);gradient.addColorStop(1,'#00000000');g.fillStyle=gradient;g.fillRect(0,0,128,128);this.glows.set(color,img)}c.drawImage(img,x-r,y-r,r*2,r*2);}
 frame(sheet,index,x,y,w,h,flip=false,alpha=1){const a=ART.atlases[sheet],c=this.c;c.save();c.globalAlpha=alpha;c.translate(x+w/2,y+h/2);if(flip)c.scale(-1,1);c.drawImage(this.assets[sheet],index%a.cols*a.cell,Math.floor(index/a.cols)*a.cell,a.cell,a.cell,-w/2,-h/2,w,h);c.restore();}
 prop(index,x,y,w,h,flip=false,alpha=1){const a=ART.atlases.environment,b=a.frames[index].bounds,c=this.c;c.save();c.globalAlpha=alpha;c.translate(x+w/2,y+h/2);if(flip)c.scale(-1,1);c.drawImage(this.assets.environment,index%4*a.cell+b.x,Math.floor(index/4)*a.cell+b.y,b.w,b.h,-w/2,-h/2,w,h);c.restore();}
 themeProp(index,x,y,w,h){const a=ART.atlases.props,b=a.frames[index].bounds,c=this.c;c.drawImage(this.assets.props,index%a.cols*a.cell+b.x,Math.floor(index/a.cols)*a.cell+b.y,b.w,b.h,x,y,w,h);}
 label(text,x,y,color='#ffdda3',size=16){const c=this.c;c.font=`600 ${size}px system-ui`;c.textAlign='center';const w=c.measureText(text).width;c.fillStyle='#11182bd9';c.beginPath();c.roundRect(x-w/2-12,y-22,w+24,32,8);c.fill();c.fillStyle=color;c.fillText(text,x,y);}
 background(game){const c=this.c,cam=game.camera,t=game.time;
 // The opaque sky guarantees coverage. Mirrored mountain tiles share edge pixels.
 c.drawImage(this.assets.sky,0,0,1536,720,0,0,1280,600);c.fillStyle='#101f35';c.fillRect(0,600,1280,120);
 const mw=1600;const positions=tileOffsets(cam,.055,mw);for(let i=0;i<positions.length;i++){const flip=(Math.floor(cam*.055/mw)+i-1)%2===1;c.save();c.translate(positions[i]+(flip?mw:0),325);if(flip)c.scale(-1,1);c.drawImage(this.assets.mountains,0,0,mw,431);c.restore();}
 // Three independently illustrated transparent panoramas share the original sky.
 // Overlapping edges and a spatial crossfade prevent gaps, even when backtracking.
 const weights=sceneWeights(game.p.x);
 for(const [i,weight] of weights.entries())if(weight>0){
  const scene=PHASES[i].scene,garden=scene==='garden',aw=garden?1300:1450,step=aw-230;
  c.save();c.globalAlpha=weight*(garden?.82:1);
  for(const x of tileOffsets(cam,.18,step))c.drawImage(this.assets[garden?'architecture':scene],x-110,garden?244:100,aw,garden?442:590);
  c.restore();
 }
 const shade=c.createLinearGradient(0,250,0,720);shade.addColorStop(0,'#101b3100');shade.addColorStop(.6,'#0e1a3633');shade.addColorStop(1,'#0b162cb3');c.fillStyle=shade;c.fillRect(0,250,1280,470);
 // Each chapter gets its own gentle color atmosphere while retaining the same hand-painted world.
 for(const [i,weight]of weights.entries())if(weight>0){c.save();c.globalAlpha=weight;c.fillStyle=['#db81200c','#168b9b13','#7547b51c'][i];c.fillRect(0,0,1280,600);c.restore()}
 // Landscape decorations have their own .55 depth and never imply walkable ledges.
 for(const x of tileOffsets(cam,.55,760)){
  this.prop(11,x+70,93,340,72,false,.75);
  this.prop(9,x+430,492,148,124,false,.5);
  this.prop(8,x+55,529,104,90,false,.48);
  this.prop(10,x+330,515,67,76,false,.65);
  this.glow(x+365,542,84,'#ffbc5a20');
 }
 if(weights[0]>.01){c.save();c.globalAlpha=weights[0]*.7;for(const x of tileOffsets(cam,.42,420)){this.prop(8,x+50,489,150,130);this.prop(8,x+225,532,105,90);this.glow(x+125,545,90,'#ffb63e16')}c.restore()}
 if(!this.reduced)for(let i=0;i<18;i++){const x=((i*179+t*(5+i%3)-cam*.3)%1400+1400)%1400,y=180+i*79%370+Math.sin(t+i)*8;this.glow(x,y,5,'#ffd37855');}
 }
 platform(a,time){const c=this.c,kind=a.material||'stone';let h=a.solid?116:kind==='wood'?80:kind==='step'?51:65;
 if(kind==='step')h=55;
 const rect=surfaceRect(a,h),i=rect.index;
 if(a.solid){c.fillStyle='#202d42';c.fillRect(a.x,a.y+34,a.w,a.h-34);}
 // Narrow modular pieces alternate mirrored details, with no change to collision tops.
 const count=Math.ceil(a.w/(a.solid?260:220)),width=a.w/count;
 for(let k=0;k<count;k++)this.prop(i,a.x+k*width,rect.y,width,h,(k+(a.variant||0))%2===1);
 // Continuous lit rim is exactly the physical top, including when pieces meet.
 c.strokeStyle=a.moving?'#7be5d0':'#e8b765';c.lineWidth=2.3;c.beginPath();c.moveTo(a.x+3,a.y+.5);c.lineTo(a.x+a.w-3,a.y+.5);c.stroke();
 if(a.moving){this.glow(a.x+a.w/2,a.y+31,66,'#55cfc62b');c.strokeStyle='#72cfbb69';c.lineWidth=1;c.setLineDash([3,9]);c.beginPath();if(a.vertical){c.moveTo(a.x+a.w/2,a.baseY-a.range-15);c.lineTo(a.x+a.w/2,a.baseY+a.range+65)}else{c.moveTo(a.baseX-a.range,a.y+66);c.lineTo(a.baseX+a.range+a.w,a.y+66)}c.stroke();c.setLineDash([]);}
 this.platformDraws++;
 }
 drawHero(p,time){const c=this.c,clip=HERO_CLIPS[p.state],index=['walk','run'].includes(p.state)?clip.frames[Math.floor((p.gaitPhase||0)*6)%6]:heroFrame(p.state,p.stateTime),size=96,anchor=ART.atlases.hero.anchor,scale=size/128,x=p.x+p.w/2-anchor.x*scale,y=p.y+p.h-anchor.y*scale;
 if(p.power>0){this.glow(p.x+15,p.y+31,63,'#55e8d943');c.save();c.strokeStyle='#9af6e6aa';c.lineWidth=1.4;c.beginPath();c.ellipse(p.x+15,p.y+32,30,42,Math.sin(time)*.1,0,Math.PI*2);c.stroke();c.restore();if(!this.reduced)for(let i=0;i<3;i++)this.glow(p.x+15+Math.cos(time*4+i*2)*29,p.y+32+Math.sin(time*4+i*2)*35,6,'#abfff1b0');}
 if(p.inv<=0||Math.floor(time*12)%2===0||p.state==='death'){const blend=Math.min(1,(p.stateBlend||0)/.065)*.65;if(blend>0)this.frame('hero',heroFrame(p.fromState,p.fromTime),x,y,size,size,p.face<0,blend);this.frame('hero',index,x,y,size,size,p.face<0,1-blend);}
 if(this.debug){c.strokeStyle='#62ff9c';c.lineWidth=1;c.strokeRect(p.x,p.y,p.w,p.h);c.fillStyle='#fff';c.fillRect(p.x+14,p.y+p.h-2,3,3);}
 }
 drawEnemy(e,time){if(!e.alive&&!(e.defeatTime>0))return;const c=this.c,state=e.anim||'move',index=enemyFrame(e.type,state,e.animTime||time),alpha=e.alive?1:Math.min(1,e.defeatTime*3);const moth=e.type==='moth',w=moth?91:76,h=moth?77:68;
 if(state==='windup'){this.glow(e.x+e.w/2,e.y+e.h/2,65,'#ffb65a3b');this.label('!',e.x+e.w/2,e.y-12,'#ffda8c',20)}
 // Normalized atlas anchors keep legs on the same ground through the full cycle.
 const x=e.x+e.w/2-w/2,y=e.y+e.h-h*.875;
 this.frame('enemies',index,x,y,w,h,!moth&&e.dir<0,alpha);
 if(this.debug&&e.alive){c.strokeStyle='#ff769b';c.strokeRect(e.x,e.y,e.w,e.h)}
 }
 draw(game){const c=this.c,cam=game.camera,t=game.time;this.platformDraws=0;this.background(game);c.save();c.translate(-cam,0);const visible=a=>a.x+a.w>cam-180&&a.x<cam+1460;
 // Upright architectural markers are behind the walkable surfaces and actors.
 for(const phase of PHASES){const x=phase.x+35;if(x+210>cam-100&&x<cam+1400){this.themeProp(5,x,337,190,265);this.label(phase.number===1?'El jardín':phase.number===2?'El instituto':'La plaza',x+95,315,'#f2d6a5',17)}}
 for(const sign of [{x:8260,index:3,text:'Patio · Biblioteca',w:105,h:132},{x:14000,index:3,text:'El horario de clase',w:105,h:132},{x:16180,index:4,text:'Plaza · Panadería · Cine',w:85,h:145},{x:20630,index:4,text:'El puente a casa →',w:85,h:145}])if(visible(sign)){this.themeProp(sign.index,sign.x,602-sign.h,sign.w,sign.h);this.label(sign.text,sign.x+sign.w/2,585-sign.h,'#d5e8de',12)}
 for(const a of game.level.platforms)if(visible(a))this.platform(a,t);
 if(cam<1750)this.label('Corre + mantén saltar para cruzar →',1470,470,'#ffe0a5',15);
 for(const n of game.npcs)if(visible(n)){const bob=n.frame===0&&!this.reduced?Math.sin(t*2)*3:0;this.glow(n.x+24,n.y+40,64,'#ffc66b22');this.frame('characters',n.frame,n.x-33,n.y+n.h-119+bob,114,128);this.label(n.name+(n.done?' · Gracias':' · E para hablar'),n.x+24,n.y-34,'#ead4ff',14);if(!n.done)this.label(n.label,n.x+24,n.y-68,'#bce5db',12);}
 for(const [j,l]of game.level.lanterns.entries())if(visible(l)){
  if(l.on)this.glow(l.x+20,l.y+30,130,'#ffc6604d');this.prop(12,l.x-10,l.y-14,61,77,false,l.on?1:.62);this.label((l.on?'Recuerdo encendido':'Farol del recuerdo')+' '+(j+1),l.x+20,l.y-29,l.on?'#ffe6a9':'#ded6ee',14);
 }
 for(const f of game.level.flowers)if(!f.got&&visible(f)){const y=f.y+(this.reduced?0:Math.sin(t*3+f.x)*2.5);this.glow(f.x+12,y+12,25,'#ffba3a27');this.prop(14,f.x-1,y-4,26,31);}
 for(const f of game.level.feathers)if(f.cooldown===0&&visible(f)){this.glow(f.x+15,f.y+20,51,'#58f6dc4b');this.prop(15,f.x-4,f.y-6+(this.reduced?0:Math.sin(t*2.8)*4),39,51)}
 for(const m of game.level.memories)if(!m.got&&visible(m)){const bob=this.reduced?0:Math.sin(t*2+m.frame)*3;this.glow(m.x+21,m.y+24,65,'#9be9dd45');this.themeProp(m.frame,m.x-3,m.y-3+bob,48,54);this.label(m.name+' · Extra',m.x+21,m.y-23,'#b7f1e8',12)}
 const s=game.level.secret;if(!s.got&&visible(s)){c.save();c.filter='hue-rotate(160deg)';this.prop(14,s.x,s.y,32,38);c.restore();this.glow(s.x+15,s.y+17,52,'#74caff55');this.label('¿Un camino arriba?',s.x,s.y-23,'#afe2ff',13)}
 for(const e of game.level.enemies)if(visible(e))this.drawEnemy(e,t);
 for(const h of game.level.hazards)if(visible(h)){
 if(h.type==='thorn'){c.strokeStyle='#45213e';c.lineWidth=7;c.lineCap='round';for(let i=0;i<6;i++){const x=h.x+i*17;c.beginPath();c.moveTo(x,h.y+20);c.bezierCurveTo(x+16,h.y+9,x-7,h.y+3,x+7,h.y-2);c.stroke();c.strokeStyle='#dc7990';c.lineWidth=2;c.stroke();c.strokeStyle='#45213e';c.lineWidth=7}}
 else{this.prop(10,h.x+2,577,44,28);const active=jetActive(h,t),warning=jetWarning(h,t);if(active){const g=c.createLinearGradient(h.x,0,h.x+h.w,0);g.addColorStop(0,'#ee668822');g.addColorStop(.5,'#ffac9ac4');g.addColorStop(1,'#ee668822');c.fillStyle=g;c.beginPath();c.moveTo(h.x+5,602);c.bezierCurveTo(h.x-8,550,h.x+38,530,h.x+15,478);c.quadraticCurveTo(h.x+73,535,h.x+h.w,602);c.closePath();c.fill();this.glow(h.x+24,555,70,'#ff5b843d')}else if(warning){this.glow(h.x+24,585,52,'#ff577566');this.label('¡Espera!',h.x+24,550,'#ffbdcb',12)}}}
 const gate=game.level.gate;if(game.lit<3&&visible(gate)){this.glow(gate.x+18,480,110,'#b197f34a');c.save();c.strokeStyle='#b896e8aa';c.lineWidth=3;for(let i=0;i<4;i++){c.beginPath();c.moveTo(gate.x+8+i*7,gate.y);c.bezierCurveTo(gate.x+Math.sin(t+i)*16,440,gate.x+26,520,gate.x+8+i*7,602);c.stroke()}c.restore();this.label('Tres recuerdos abren el camino',gate.x,340,'#dbcbff',16)}
 const goal=game.level.goal;if(visible(goal)){const open=game.lit===3&&game.boss.defeated;this.glow(goal.x+50,goal.y+80,170,open?'#75e2df4a':'#9b96b022');this.prop(13,goal.x-27,goal.y-24,155,191,false,open?1:.45);this.label(open?'Casa':'La niebla oculta la salida',goal.x+50,goal.y-40,'#c0fff2',18)}
 const b=game.boss;if(visible(b)){const index=b.defeated||['hurt','tired'].includes(b.state)?5:b.state==='windup'||b.state==='attack'?4:3;this.glow(b.x+45,b.y+40,100,b.defeated?'#6debc52b':'#9879f643');this.frame('characters',index,b.x-35,b.y-58+(this.reduced?0:Math.sin(t*2)*2),160,160,false,b.defeated?.7:1);this.label(b.defeated?'Guardián · Gracias por recordar':'Guardián de la Niebla · '+b.seals+' / 3',b.x+45,b.y-80,'#dec3ff',14);for(const w of b.waves){this.glow(w.x+25,591,50,'#bd8df76b');this.prop(15,w.x,563,50,39,true,.85);}if(b.active&&!b.defeated)this.label(b.state==='tired'?'¡Salta sobre mi cabeza!':b.state==='windup'?'¡Viene una ráfaga!':'¡Salta!',b.x-160,460,b.state==='tired'?'#9cf4d9':'#ffdf99',15);}
 this.drawHero(game.p,t);
 for(const q of game.particles){const ratio=Math.max(0,q.life/(q.maxLife||1.1));c.globalAlpha=Math.min(1,ratio*1.6);if(q.kind==='dust'){const r=3+(1-ratio)*8;c.fillStyle=q.color;c.beginPath();c.ellipse(q.x,q.y,r,r*.48,0,0,Math.PI*2);c.fill()}else{c.save();c.translate(q.x,q.y);c.rotate(q.life*6);c.fillStyle=q.color;c.beginPath();c.ellipse(0,0,3.5,1.8,0,0,Math.PI*2);c.fill();c.restore()}}c.globalAlpha=1;
 if(this.debug){c.strokeStyle='#65ffaa';c.lineWidth=1;for(const a of game.level.platforms)if(visible(a)){c.beginPath();c.moveTo(a.x,a.y);c.lineTo(a.x+a.w,a.y);c.stroke()}}
 c.restore();
 if(!this.reduced)for(let i=0;i<7;i++){const x=((i*239+t*26-cam*.85)%1400+1400)%1400,y=657+Math.sin(t*.7+i)*42;c.save();c.translate(x,y);c.rotate(t+i);c.fillStyle='#df954c88';c.beginPath();c.ellipse(0,0,6,2.5,0,0,Math.PI*2);c.fill();c.restore()}
 // Gentle zone fade never hides collision surfaces or removes player control.
 if(game.zoneTransition>0&&game.mode==='play'){const progress=game.zoneTransition/1.7,alpha=Math.sin(progress*Math.PI)*.075;c.fillStyle=`rgba(112,80,155,${alpha})`;c.fillRect(0,0,1280,720)}
 if(game.chapterTransition>0&&game.mode==='play'){
  const fade=Math.min(1,(5.8-game.chapterTransition)/.35,game.chapterTransition/.55),phase=game.phase;
  c.save();c.globalAlpha=Math.max(0,fade)*.96;
  c.fillStyle='#10152ddd';c.beginPath();c.roundRect(315,104,650,146,18);c.fill();
  c.strokeStyle=phase.mood==='teal'?'#8ce6d1aa':phase.mood==='violet'?'#c5a0f2aa':'#f1c16aaa';c.lineWidth=1.5;c.stroke();
  c.fillStyle='#f4c777';c.font='700 12px system-ui';c.textAlign='center';c.fillText('UN NUEVO LUGAR · FASE '+phase.number+' DE 3',640,132);
  c.fillStyle='#fff0d5';c.font='700 25px Georgia, serif';c.fillText(phase.title,640,166);
  c.fillStyle='#bce7dc';c.font='600 14px system-ui';c.fillText(phase.topic,640,193);
  c.fillStyle='#d8d5e3';c.font='500 14px system-ui';c.fillText(phase.objective,640,224);
  c.restore();
 }
 const vign=c.createRadialGradient(640,350,280,640,350,790);vign.addColorStop(0,'#0000');vign.addColorStop(1,'#080d214a');c.fillStyle=vign;c.fillRect(0,0,1280,720);this.framesDrawn++;
 }
}
