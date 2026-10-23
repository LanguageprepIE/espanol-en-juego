// Each clip owns a stable atlas cell, frame duration and foot anchor.
export const HERO_CLIPS={
 walk:{frames:[0,1,2,3,4,5],fps:10,loop:true},
 run:{frames:[6,7,8,9,10,11],fps:14,loop:true},
 idle:{frames:[12,13],fps:2,loop:true},
 jump:{frames:[14,15],fps:7,loop:false},
 fall:{frames:[24,25,26],fps:8,loop:false},
 land:{frames:[27,28,29],fps:18,loop:false},
 hurt:{frames:[18,19],fps:7,loop:false},
 death:{frames:[20,21],fps:3,loop:false},
 victory:{frames:[22,23],fps:4,loop:true}
};
export const ENEMY_CLIPS={
 beetle:{move:{frames:[0,1,2,3,4,5],fps:11,loop:true},windup:{frames:[6],fps:1},attack:{frames:[7],fps:1},hurt:{frames:[8,9],fps:8},defeat:{frames:[10,11],fps:5}},
 moth:{move:{frames:[12,13,14,15,16,17],fps:13,loop:true},windup:{frames:[18],fps:1},attack:{frames:[19],fps:1},hurt:{frames:[20,21],fps:8},defeat:{frames:[22,23],fps:5}}
};
export function clipFrame(clip,time){const i=Math.max(0,Math.floor(time*clip.fps));return clip.frames[clip.loop?i%clip.frames.length:Math.min(i,clip.frames.length-1)]}
export function heroFrame(state,time){return clipFrame(HERO_CLIPS[state]||HERO_CLIPS.idle,time)}
export function enemyFrame(type,state,time){const clips=ENEMY_CLIPS[type]||ENEMY_CLIPS.beetle;return clipFrame(clips[state]||clips.move,time)}
export const ART_LAYERS=[{name:'sky',speed:0},{name:'mountains',speed:.055},{name:'architecture',speed:.18},{name:'vegetation',speed:.55},{name:'platforms',speed:1},{name:'interactives',speed:1},{name:'effects',speed:1}];
export function tileOffsets(camera,speed,width,viewport=1280){const start=-((camera*speed)%width+width)%width;const result=[];for(let x=start-width;x<viewport;x+=width)result.push(x);return result}
