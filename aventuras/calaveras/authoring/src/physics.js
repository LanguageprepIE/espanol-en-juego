// Coyote time, jump buffer and axis-separated collision approach developed from
// School Escape (LanguageprepIE, MIT). New fixed-step implementation.
export const PHYSICS={gravity:1550,jump:590,walk:220,run:345,accel:2800,friction:3200,coyote:.115,buffer:.14};
export const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export function playerAt(x=90,y=540){return{x,y,w:30,h:62,vx:0,vy:0,ground:false,coyote:0,buffer:0,face:1,jumps:0,state:'idle',stateTime:0,inv:0,power:0,land:0,landed:false,impact:0,gaitPhase:0,stateBlend:0,fromState:'idle',fromTime:0};}
export function movePlayer(p,input,platforms,dt){
 const wasGround=p.ground,oldX=p.x,oldY=p.y;p.landed=false;p.impact=0;p.stateBlend=Math.max(0,p.stateBlend-dt);
 p.coyote=wasGround?PHYSICS.coyote:Math.max(0,p.coyote-dt);p.buffer=Math.max(0,p.buffer-dt);
 p.inv=Math.max(0,p.inv-dt);p.hurtTime=Math.max(0,(p.hurtTime||0)-dt);p.power=Math.max(0,p.power-dt);p.land=Math.max(0,p.land-dt);
 if(input.jumpPressed)p.buffer=PHYSICS.buffer;
 const dir=(input.right?1:0)-(input.left?1:0),target=dir*(input.run?PHYSICS.run:PHYSICS.walk);
 const speed=(dir?PHYSICS.accel:PHYSICS.friction)*dt;p.vx+=Math.max(-speed,Math.min(speed,target-p.vx));if(dir)p.face=dir;
 if(p.buffer>0&&(p.coyote>0||(p.power>0&&p.jumps<2))){p.vy=-PHYSICS.jump;p.buffer=0;p.coyote=0;p.ground=false;p.jumps++;p.land=0;}
 if(!input.jump&&p.vy<-220)p.vy+=2300*dt;
 p.vy=Math.min(850,p.vy+PHYSICS.gravity*dt);
 p.x+=p.vx*dt;p.x=Math.max(0,p.x);
 for(const a of platforms)if(a.solid&&overlap(p,a)){if(oldX+p.w<=a.x+1){p.x=a.x-p.w;p.vx=0}else if(oldX>=a.x+a.w-1){p.x=a.x+a.w;p.vx=0}}
 p.fallSpeed=p.vy;p.y+=p.vy*dt;p.ground=false;p.riding=null;
 let landing=null,ceiling=null;
 for(const a of platforms){if(p.x+p.w<=a.x||p.x>=a.x+a.w)continue;
  if(p.vy>=0&&oldY+p.h<=a.y+Math.max(3,Math.abs(a.dy||0))&&p.y+p.h>=a.y&&(!landing||a.y<landing.y))landing=a;
  if(a.solid&&p.vy<0&&oldY>=a.y+a.h&&p.y<a.y+a.h&&(!ceiling||a.y+a.h>ceiling.y+ceiling.h))ceiling=a;
 }
 if(landing){p.y=landing.y-p.h;p.vy=0;p.ground=true;p.jumps=0;p.riding=landing;if(!wasGround){p.land=.17;p.landed=true;p.impact=p.fallSpeed||0;}}
 else if(ceiling){p.y=ceiling.y+ceiling.h;p.vy=0;}
 const next=p.hurtTime>0?'hurt':!p.ground?(p.vy<0?'jump':'fall'):p.land>0?'land':Math.abs(p.vx)>265?'run':Math.abs(p.vx)>12?'walk':'idle';
 if(p.ground)p.gaitPhase+=(Math.abs(p.vx)*dt)/(Math.abs(p.vx)>265?160:120);
 if(next!==p.state){p.fromState=p.state;p.fromTime=p.stateTime;p.stateBlend=.065;p.stateTime=0;}else p.stateTime+=dt;p.state=next;
}
export function movePlatforms(platforms,time,p){for(const a of platforms){a.dx=a.dy=0;if(!a.moving)continue;const previousX=a.x,previousY=a.y;const offset=Math.sin(time*2*Math.PI/a.period+(a.phase||0))*a.range;if(a.vertical)a.y=a.baseY+offset;else a.x=a.baseX+offset;a.dx=a.x-previousX;a.dy=a.y-previousY;if(p.riding===a&&p.ground){p.x+=a.dx;p.y+=a.dy}}}
export function jetActive(h,time){const phase=(time+h.phase)%3.4;return phase>1.2&&phase<2.35;}
export function jetWarning(h,time){const phase=(time+h.phase)%3.4;return phase>.55&&phase<=1.2;}
