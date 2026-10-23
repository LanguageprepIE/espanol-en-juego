// Developer-only input driver. Uses the public movement/jump/use inputs only.
// No teleports, health/life changes, timer shortcuts or automatic lantern edits.
export class AuditRunner{
 constructor(game){this.nodes=this.route(game);this.index=0;this.jumpHold=0;this.secondaryUsed=false;this.steps=0;this.trace=[];this.lastMode=game.mode;this.stuck=0;this.lastX=game.p.x;}
 route(g){const level=g.level,nodes=[];const spans=[3450,10050,17050].map(x=>[x,x+1610]);
 const floor=level.platforms.filter(a=>a.solid);
 for(const a of floor){if(a.x>20520)continue;for(const x of [a.x+Math.min(150,a.w/3),a.x+a.w-105]){if(x<200||spans.some(([lo,hi])=>x>=lo&&x<=hi)||x>20800)continue;nodes.push({x,y:a.y,platform:a});}}
 for(const base of [3450,10050,17050]){for(const offset of [0,260,510,760,1150,1430]){const a=level.platforms.find(a=>a.baseX===base+offset&&a.y<550);nodes.push({x:offset===760?base+870:a.x+a.w/2,y:a.y,platform:a,lantern:offset===760});}}
 nodes.push({x:20772,y:602,platform:floor.find(a=>a.x===20520),feather:true});
 nodes.sort((a,b)=>a.x-b.x);
 for(const a of level.platforms.filter(a=>a.final).sort((a,b)=>a.baseX-b.baseX))nodes.push({x:a.x+a.w/2,y:a.y,platform:a,moving:true});
 nodes.push({x:22935,y:602,platform:floor.at(-1),goal:true});return nodes;
 }
 input(g,dt){this.steps++;this.jumpHold=Math.max(0,this.jumpHold-dt);const p=g.p;
 if(g.mode==='dialogue'){const d=g.conversation;if(d.correct)g.continueConversation();else g.answer(d.question.correct);return{}}
 if(g.mode!=='play'){this.lastMode=g.mode;return{}}
 if(this.lastMode==='dying'){this.index=Math.max(0,this.nodes.findIndex(n=>n.x>p.x+30));this.jumpHold=0;this.secondaryUsed=false;}
 this.lastMode=g.mode;
 if(g.lit===3&&p.x>22600&&!g.boss.defeated){const b=g.boss,dist=b.x+b.w/2-(p.x+p.w/2);let jumpPressed=false;const wave=b.waves.some(w=>w.x>p.x-20&&w.x-p.x<135);if(p.ground&&((b.state==='tired'&&Math.abs(dist)<120)||wave)){jumpPressed=true;this.jumpHold=.65;}return{right:dist>8,left:dist< -8,jumpPressed,jump:this.jumpHold>0};}
 if(g.boss.defeated)this.index=this.nodes.length-1;
 let n=this.nodes[this.index];if(!n)return{};
 const a=n.platform;if(n.moving){n.x=a.x+a.w/2;n.y=a.y;}
 const dx=n.x-(p.x+p.w/2),standing=p.ground&&p.riding===a;
 if((standing&&Math.abs(dx)<43)||(n.platform.solid&&p.ground&&p.x+p.w/2>=n.x-43&&p.y+p.h<n.y)){if(n.lantern&&!g.level.lanterns.find(l=>Math.abs(l.x-n.x)<90)?.on)return{usePressed:true};if(!n.feather||p.power>0){this.trace.push({step:this.steps,x:Math.round(p.x),node:this.index,lives:g.lives,lit:g.lit});this.index++;n=this.nodes[this.index];if(!n)return{};}}
 const target=n.platform,tx=n.moving?target.x+target.w/2:n.x,dist=tx-(p.x+p.w/2);
 let jumpPressed=false;
 if(p.ground){this.secondaryUsed=false;const uphill=target.y<p.y+p.h-10;const edge=p.riding&&p.riding.x+p.riding.w-p.x-p.w<22&&dist>50;
 const obstacle=g.level.enemies.some(e=>e.alive&&Math.abs(e.y-(p.y+p.h))<75&&e.type==='beetle'&&e.x>p.x&&e.x-p.x<145)||g.level.hazards.some(h=>Math.abs(h.y-(p.y+p.h))<130&&h.x>p.x&&h.x-p.x<130);
 if((uphill&&Math.abs(dist)<155)||edge||obstacle){jumpPressed=true;this.jumpHold=.48;}
 }else if(p.power>0&&!this.secondaryUsed&&p.jumps===1&&p.vy>0&&(target.y<p.y+p.h+25||Math.abs(dist)>110)){jumpPressed=true;this.secondaryUsed=true;this.jumpHold=.4;}
 return{right:dist>10,left:dist< -10,run:Math.abs(dist)>45,jumpPressed,jump:this.jumpHold>0};
 }
}
