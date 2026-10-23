import test from 'node:test';import assert from 'node:assert/strict';
import {QUESTION_BANK,NPCS,PHASES,GUARDIAN_QUESTIONS,phaseAt,sceneWeights} from '../src/story.js';
import {Game} from '../src/game.js';import {AuditRunner} from '../src/audit-runner.js';

test('18 unique questions are distributed once, six per theme, in nine short encounters',()=>{
 assert.equal(QUESTION_BANK.length,18);assert.equal(new Set(QUESTION_BANK.map(q=>q.id)).size,18);assert.equal(NPCS.length,9);
 for(const phase of PHASES){const questions=QUESTION_BANK.filter(q=>q.topic===phase.number),npcs=NPCS.filter(n=>n.topic===phase.number);assert.equal(questions.length,6);assert.equal(npcs.length,3);for(const n of npcs){assert.equal(phaseAt(n.x).number,n.topic);assert.equal(n.questions.length,2);assert.ok(n.questions.every(q=>q.topic===n.topic))}}
 assert.deepEqual(NPCS.flatMap(n=>n.questions.map(q=>q.id)).sort(),QUESTION_BANK.map(q=>q.id).sort());
 for(const q of QUESTION_BANK){assert.equal(new Set(q.options).size,3);assert.ok(q.correct>=0&&q.correct<3);assert.ok(q.context&&q.hint&&q.explanation)}
 assert.deepEqual(GUARDIAN_QUESTIONS.map(q=>q.topic),[1,2,3]);assert.ok(GUARDIAN_QUESTIONS.every(q=>QUESTION_BANK.includes(q)));
});
test('leaving a conversation preserves answered questions and rewards only once',()=>{
 const g=new Game();g.reset();const n=g.npcs[0];g.talk(n);g.answer(g.conversation.question.correct);g.leaveConversation();assert.equal(n.progress,1);assert.equal(g.mode,'play');assert.equal(g.lives,3);assert.equal(g.answeredIds.size,1);
 g.talk(n);assert.equal(g.conversation.index,1);g.answer(g.conversation.question.correct);g.leaveConversation();assert.equal(g.mode,'play');assert.equal(n.done,true);assert.equal(g.lives,4);assert.equal(g.answeredIds.size,2);g.talk(n);assert.equal(g.lives,4);assert.equal(g.mode,'play');
});
test('all nine conversation resting places remain safe through repeated enemy cycles',()=>{
 for(const n of NPCS){const g=new Game();g.reset();g.p.x=n.x;g.p.y=540;for(let i=0;i<120*10;i++)g.update(1/120,{});assert.equal(g.mode,'play',n.id);assert.equal(g.hearts,3,n.id);assert.equal(g.lives,3,n.id);assert.equal(g.p.ground,true,n.id)}
});
test('the three optional keepsakes have real supporting ledges and cannot be farmed',()=>{
 for(let index=0;index<3;index++){const g=new Game();g.reset();g.level.enemies=[];const m=g.level.memories[index],floor=g.level.platforms.find(a=>m.x>=a.x&&m.x+m.w<=a.x+a.w&&Math.abs(a.y-m.y-m.h)<8);assert.ok(floor,m.id);g.p.x=m.x;g.p.y=floor.y-62;g.hearts=1;g.update(1/120,{});assert.equal(m.got,true);assert.equal(g.hearts,3);assert.equal(g.collected,8);for(let i=0;i<60;i++)g.update(1/120,{});assert.equal(g.collected,8)}
});
test('scene blends cover every point with positive weights summing to one',()=>{
 for(let x=0;x<=23200;x+=10){const weights=sceneWeights(x);assert.ok(Math.abs(weights.reduce((a,b)=>a+b,0)-1)<.000001);assert.ok(weights.every(w=>w>=0&&w<=1))}
 assert.deepEqual(sceneWeights(4000),[1,0,0]);assert.deepEqual(sceneWeights(11000),[0,1,0]);assert.deepEqual(sceneWeights(19000),[0,0,1]);
});
test('a full route can include all nine conversations and still finish the guardian',()=>{
 const g=new Game();g.reset();const runner=new AuditRunner(g,{includeConversations:true});for(let i=0;i<120*240&&!['win','over'].includes(g.mode);i++)g.update(1/120,runner.input(g,1/120));assert.equal(g.mode,'win','route node '+runner.index);assert.equal(g.npcs.filter(n=>n.done).length,9);assert.equal(g.answeredIds.size,18);assert.equal(g.lit,3);
});
