/* Staff checkpoints: three short Spanish questions, grounded in each world's clues. */
const bossQuestions=[
 [
  {q:'Nora es alta y lleva gafas. ¿Qué descripción es correcta?',options:['Es baja y no lleva gafas.','Es alta y lleva gafas.','Tiene el pelo negro y largo.'],answer:1,why:'La pista dice: Nora es alta, rubia y lleva gafas.'},
  {q:'Óscar tiene el pelo negro. Completa: Óscar ___ el pelo negro.',options:['es','está','tiene'],answer:2,why:'Usamos tener para el pelo: tiene el pelo negro.'},
  {q:'Eva es alegre. ¿Cómo es su personalidad?',options:['Es alegre.','Está encima de una mesa.','Lleva gafas.'],answer:0,why:'Alegre describe la personalidad.'}
 ],
 [
  {q:'Álex lleva una sudadera verde. ¿Qué prenda debes buscar?',options:['Una camiseta amarilla.','Una sudadera azul.','Una sudadera verde.'],answer:2,why:'Lleva una sudadera verde.'},
  {q:'Leo tiene el pelo pelirrojo y es divertido. Completa: Leo ___ divertido.',options:['está','es','tiene'],answer:1,why:'Usamos ser para describir la personalidad: es divertido.'},
  {q:'Sara es sociable. ¿Qué frase describe mejor su personalidad?',options:['Le gusta hablar con otras personas.','Tiene el pelo rubio.','Lleva pantalones.'],answer:0,why:'Una persona sociable disfruta relacionándose con otras personas.'}
 ],
 [
  {q:'Inés no ha dormido bien hoy. Completa: Inés ___ cansada.',options:['tiene','es','está'],answer:2,why:'Estar expresa un estado: hoy está cansada.'},
  {q:'La tarjeta está arriba, a la izquierda del científico. ¿Dónde buscas?',options:['Abajo, a su derecha.','Arriba, a su izquierda.','Debajo de la puerta.'],answer:1,why:'Arriba = above; a la izquierda = to the left.'},
  {q:'Bruno lleva una bata azul; Luz lleva una bata blanca. ¿Quién lleva la bata azul?',options:['Bruno.','Luz.','Inés.'],answer:0,why:'Bruno lleva la bata azul.'}
 ],
 [
  {q:'Celia es alegre, tiene el pelo moreno y lleva una camiseta roja. ¿Qué frase contiene un error?',options:['Celia es alegre.','Celia tiene el pelo rubio.','Celia lleva una camiseta roja.'],answer:1,why:'Celia tiene el pelo moreno, no rubio.'},
  {q:'Hoy Pablo está nervioso. Normalmente es serio. ¿Qué frase describe un estado de hoy?',options:['Hoy está nervioso.','Normalmente es serio.','Tiene el pelo rubio.'],answer:0,why:'Estar describe cómo se encuentra hoy.'},
  {q:'Elige la descripción que usa bien ser, tener y llevar.',options:['Celia tiene alegre, es pelo moreno y está camiseta roja.','Celia está alegre, lleva pelo moreno y tiene camiseta roja puesta.','Celia es alegre, tiene el pelo moreno y lleva una camiseta roja.'],answer:2,why:'Es alegre; tiene el pelo moreno; lleva una camiseta roja.'}
 ]
];
function bossQuestion(){
 if(bossCleared)return;
 const q=bossQuestions[state.level][bossIndex];
 show(bossNames[state.level]+' · Staff checkpoint', '<p class="boss-count">Question '+(bossIndex+1)+' / 3</p><p lang="es">'+q.q+'</p><p>Get all three right to unlock the exit. A mistake sends you to a short detention route. Your exploration and Merits are safe.</p>',q.options.map((option,i)=>[option,()=>answerBoss(i)]));
 for(const b of $('#dialogBody').children)if(b.tagName==='BUTTON')b.classList.add('boss-option');
}
function answerBoss(choice){
 const q=bossQuestions[state.level][bossIndex],correct=choice===q.answer;
 state.bossAnswers.push({boss:bossNames[state.level],question:q.q,answer:q.options[choice],correct});
 if(!correct){bossIndex=0;state.detentions++;beep(160,.2);enterDetention();show('DETENTION · A very short sentence','<p lang="es">'+q.why+'</p><p>The staff member points at a miniature obstacle course. Escape detention, then retry the three questions. No lost Merits, no restart of the world.</p>',[['Escape detention',()=>{dialogReturn='detention';close()}]]);saveSession();return}
 bossIndex++;beep(800,.1);saveSession();
 if(bossIndex<3){bossQuestion();return}
 bossCleared=true;burst(p.x,p.y);state.score+=100;saveSession();
 show('Exit pass granted!','<p lang="es">«Tres respuestas correctas. ¡Puedes pasar!»</p><p>'+bossNames[state.level]+' reluctantly stamps your pass. The exit is now open.</p>',[['Back to game',()=>{dialogReturn='play';close()}]]);
}
function enterDetention(){
 dialog.close();mode='detention';dialogReturn='detention';keys={};pressed={};detention={x:40,y:380,vy:0,vx:0,w:24,h:44,ground:false,buffer:0};toast('Detention: jump across the gaps. Reach the green door →');saveSession();
}
function leaveDetention(){
 mode='play';dialogReturn='play';detention=null;keys={};pressed={};p.x=BOSS_X-65;p.y=426;p.vx=p.vy=0;p.ground=true;inv=3;camera=Math.min(W-960,p.x-350);toast('Back at the boss. Your clues, books and Merits are safe. Press E to retry.');saveSession();
}
function updateDetention(dt){
 const d=detention;state.elapsed+=dt;
 const dir=(keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0);d.vx=dir*210;
 if(pressed.Space||pressed.KeyW||pressed.ArrowUp)d.buffer=.18;else d.buffer=Math.max(0,d.buffer-dt);
 if(d.buffer>0&&d.ground){d.vy=-550;d.buffer=0;d.ground=false;beep(400,.06)}
 let old=d.y;d.vy=Math.min(750,d.vy+1250*dt);d.x=Math.max(0,Math.min(850,d.x+d.vx*dt));d.y+=d.vy*dt;d.ground=false;
 for(const a of detentionPlatforms)if(d.vy>=0&&old+d.h<=a.y+2&&d.y+d.h>=a.y&&d.x+d.w>a.x&&d.x<a.x+a.w){d.y=a.y-d.h;d.vy=0;d.ground=true;break}
 if(d.y>590){d.x=40;d.y=380;d.vy=0;toast('Try the little jumps again. No health or progress lost.')}
 if(d.x>790)leaveDetention();
 $('#hud').textContent='DETENTION · '+bossNames[state.level]+' · Progress safe';
 $('#objective').textContent='Jump across two gaps and reach the green door. Then retry the three boss questions. R restarts only detention.';
}
const detentionPlatforms=[{x:0,y:470,w:220,h:70},{x:325,y:470,w:235,h:70},{x:665,y:470,w:230,h:70},{x:190,y:390,w:120,h:20},{x:525,y:390,w:120,h:20}];
function drawDetention(){
 rect(0,0,960,540,'#29344b');rect(50,80,850,110,'#485571');text('DETENTION',80,120,'#ffcf67',30);text('Your crime: one Spanish answer. Your sentence: two jumps.',80,155,'#e8eef0',15);
 for(const a of detentionPlatforms){rect(a.x,a.y,a.w,a.h,'#55748c');rect(a.x,a.y,a.w,5,'#8ec7cd')}
 rect(795,355,70,115,'#68b69a');text('SALIDA →',750,335,'#8df3bc',18);text('No essays. No lost Merits. The chair is surprisingly uncomfortable.',45,230,'#bacbdd',14);
 person(detention.x,detention.y,'#654735','#368bd0',detention.ground&&Math.abs(detention.vx)>0?t*16:0,false,true);
}
function drawBoss(){
 const x=BOSS_X;rect(x-55,390,160,18,'#c49564');rect(x-45,408,12,62,'#64504a');rect(x+80,408,12,62,'#64504a');
 const [hair,shirt]=bossLooks[state.level];ctx.save();ctx.translate(x,378);ctx.scale(1.6,1.6);person(0,0,hair,shirt,0,state.level<3);ctx.restore();
 if(state.level===2){rect(x+28,405,42,45,'#982b58');text('UB',x+35,434,'#fff',18)}
 text(bossNames[state.level],x-85,350,'#ffcf67',18);text(bossCleared?'✓ PASS GRANTED':'E · 3 QUESTIONS',x-80,375,bossCleared?'#95efbd':'#ffcf67',14);
 rect(EXIT_X-80,350,6,120,bossCleared?'#5ed7ac':'#ba6480');if(!bossCleared)text('LOCKED',EXIT_X-105,330,'#fca1bf',13);
}
