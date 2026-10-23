export class Input{
 constructor(onPause){this.metrics={keyboard:0,pointer:0,lastCode:null};this.keys={};this.just={};this.held={};this.pointers=new Map();this.onPause=onPause;
 const map={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'jump',KeyW:'jump',ArrowUp:'jump',ShiftLeft:'run',ShiftRight:'run',KeyE:'use',ArrowDown:'use'};
 addEventListener('keydown',e=>{if(e.target instanceof HTMLButtonElement||e.target instanceof HTMLInputElement||document.querySelector('dialog[open]'))return;if(['KeyP','Escape'].includes(e.code)){if(!e.repeat)onPause();e.preventDefault();return}const k=map[e.code];if(k){this.metrics.keyboard++;this.metrics.lastCode=e.code;e.preventDefault();if(!this.held[e.code])this.just[k]=true;this.held[e.code]=k;this.rebuild();}});
 addEventListener('keyup',e=>{delete this.held[e.code];this.rebuild()});
 for(const b of document.querySelectorAll('[data-key]')){b.addEventListener('pointerdown',e=>{e.preventDefault();this.metrics.pointer++;b.setPointerCapture(e.pointerId);const k=b.dataset.key;this.pointers.set(e.pointerId,k);this.just[k]=true;b.classList.add('active');this.rebuild();});const end=e=>{this.pointers.delete(e.pointerId);b.classList.remove('active');this.rebuild()};for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,end);}
 addEventListener('blur',()=>{this.clear();onPause(true)});document.addEventListener('visibilitychange',()=>{if(document.hidden){this.clear();onPause(true)}});
 }
 rebuild(){this.keys={};for(const k of Object.values(this.held))this.keys[k]=true;for(const k of this.pointers.values())this.keys[k]=true;}
 sample(){return{...this.keys,jumpPressed:!!this.just.jump,usePressed:!!this.just.use}}
 consume(){this.just={}}
 clear(){this.keys={};this.just={};this.held={};this.pointers.clear();for(const b of document.querySelectorAll('[data-key]'))b.classList.remove('active')}
}
