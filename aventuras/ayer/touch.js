'use strict';
// Separate touch adapter; desktop keyboard controls are unchanged.
(()=>{
 const pad=document.querySelector('#joystick'),knob=document.querySelector('#joystickKnob');
 const jump=document.querySelector('#touchJump'),talkButton=document.querySelector('#touchTalk');
 let activePointer=null,dir=0,jumpPointer=null;
 function setDirection(next){dir=next;keys.ArrowLeft=next===-1;keys.ArrowRight=next===1;knob.style.left='calc(50% + '+(next*30)+'px)'}
 function move(e){if(e.pointerId!==activePointer)return;const r=pad.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2);setDirection(dx < -17?-1:dx>17?1:0)}
 pad.addEventListener('pointerdown',e=>{if(activePointer!==null)return;activePointer=e.pointerId;pad.setPointerCapture(e.pointerId);move(e);e.preventDefault()});
 pad.addEventListener('pointermove',move);
 function releasePad(e){if(e.pointerId!==activePointer)return;activePointer=null;setDirection(0)}
 pad.addEventListener('pointerup',releasePad);pad.addEventListener('pointercancel',releasePad);pad.addEventListener('lostpointercapture',releasePad);
 jump.addEventListener('pointerdown',e=>{if(jumpPointer!==null)return;jumpPointer=e.pointerId;jump.setPointerCapture(e.pointerId);if(mode==='practice'){practice.buffer=.16}else if(mode==='play'){p.buffer=.16;pressed.Space=true}keys.Space=true;e.preventDefault()});
 function releaseJump(e){if(e.pointerId!==jumpPointer)return;jumpPointer=null;keys.Space=false}
 jump.addEventListener('pointerup',releaseJump);jump.addEventListener('pointercancel',releaseJump);jump.addEventListener('lostpointercapture',releaseJump);
 talkButton.addEventListener('click',()=>{if(mode==='play'||mode==='practice')talk()});
 window.addEventListener('blur',()=>{activePointer=null;jumpPointer=null;setDirection(0);keys.Space=false});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){activePointer=null;jumpPointer=null;setDirection(0);keys.Space=false}});
})();
