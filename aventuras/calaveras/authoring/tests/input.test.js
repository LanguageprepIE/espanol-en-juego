import test from 'node:test';import assert from 'node:assert/strict';
import {Input} from '../src/input.js';
class FakeButton extends EventTarget{constructor(key){super();this.dataset={key};this.classList={add(){},remove(){}};}setPointerCapture(){}}
const send=(target,type,data)=>{const e=new Event(type,{cancelable:true});for(const[k,v]of Object.entries(data))Object.defineProperty(e,k,{value:v});target.dispatchEvent(e)};
test('touch adapter handles simultaneous direction, run, jump, cancellation and focus loss',()=>{
 const bus=new EventTarget(),doc=new EventTarget(),left=new FakeButton('left'),right=new FakeButton('right'),jump=new FakeButton('jump'),run=new FakeButton('run');
 globalThis.HTMLButtonElement=FakeButton;globalThis.HTMLInputElement=class {};globalThis.addEventListener=bus.addEventListener.bind(bus);globalThis.document=doc;doc.querySelector=()=>null;doc.querySelectorAll=()=>[left,right,jump,run];let paused=0;const input=new Input(()=>paused++);
 send(right,'pointerdown',{pointerId:1});send(run,'pointerdown',{pointerId:2});send(jump,'pointerdown',{pointerId:3});assert.equal(input.sample().right,true);assert.equal(input.sample().run,true);assert.equal(input.sample().jumpPressed,true);input.consume();assert.equal(input.sample().jumpPressed,false);assert.equal(input.sample().jump,true);
 send(jump,'pointercancel',{pointerId:3});assert.equal(input.sample().jump,undefined);assert.equal(input.sample().right,true);send(right,'lostpointercapture',{pointerId:1});assert.equal(input.sample().right,undefined);send(bus,'blur',{});assert.deepEqual(input.keys,{});assert.equal(paused,1);
 // Releasing one keyboard alias must not release another held alias.
 send(bus,'keydown',{code:'ArrowRight',target:bus,repeat:false});send(bus,'keydown',{code:'KeyD',target:bus,repeat:false});send(bus,'keyup',{code:'KeyD'});assert.equal(input.sample().right,true);send(bus,'keyup',{code:'ArrowRight'});assert.equal(input.sample().right,undefined);
});
