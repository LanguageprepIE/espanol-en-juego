export const LEVEL_WIDTH=23200;
export function createLevel(){
 const platforms=[], flowers=[], enemies=[], hazards=[];
 const add=(x,y,w,h=32,extra={})=>platforms.push({x,y,w,h,baseX:x,baseY:y,...extra});
 // Six authored acts; each has safe landing areas and optional upper routes.
 const grounds=[[0,1650],[1830,1330],[3340,1450],[4970,1300],[6450,1240],[7900,1480],[9620,1420],[11240,1280],[12750,1340],[14330,1320],[15900,1300],[17440,1340],[19020,1260],[20520,440],[22600,600]];
 grounds.forEach(([x,w])=>add(x,602,w,160,{solid:true}));
 for(let i=0;i<grounds.length-1;i++){
  const end=grounds[i][0]+grounds[i][1], next=grounds[i+1][0];
  if(next-end<400)add(end+(next-end-140)/2,550,140,28,{moving:i%3===1,range:22,period:3.6,phase:i});
 }
 // Upper routes: readable staircase, with a high lantern terrace at each end.
 for(const base of [3450,10050,17050]){
  add(base,503,175);add(base+260,407,165);add(base+510,312,165);add(base+760,219,340);
  add(base+1150,315,180);add(base+1430,410,180);
  for(let j=0;j<6;j++)flowers.push({x:base+70+j*260,y: j<4?460-j*95:270+(j-4)*95,w:24,h:24});
 }
 // Safe learning steps and an optional blue-flower alcove.
 add(620,510,180);add(900,425,180);add(1190,348,200);add(1440,270,240);
 add(2390,520,180);add(2620,425,180);add(2850,330,200);
 add(6800,520,180);add(7040,425,180);add(7290,330,210);
 add(13400,520,190);add(13660,425,190);add(13920,330,200);
 // Final timed crossing is open only after all lanterns have been lit.
 for(let i=0;i<6;i++)add(21030+i*270,480-(i%2)*95,150,30,{moving:true,vertical:i%2===0,range:40,period:2.4,phase:i,final:true});
 const lanterns=[{x:4300,y:159,w:40,h:60,on:false,spawnX:4300,spawnY:157},{x:10900,y:159,w:40,h:60,on:false,spawnX:10900,spawnY:157},{x:17900,y:159,w:40,h:60,on:false,spawnX:17900,spawnY:157}];
 for(let x=360;x<23000;x+=160){if(grounds.some(([gx,w])=>x>gx+30&&x<gx+w-30))flowers.push({x,y:552,w:24,h:24});}
 for(const [x,min,max] of [[2120,1950,2430],[5340,5100,5730],[8230,7980,8650],[11800,11400,12200],[15100,14500,15450],[19500,19200,19950]])enemies.push({type:'beetle',x,y:563,w:48,h:39,min,max,dir:1,speed:72,alive:true});
 for(const x of [5900,9150,12900,16300,20000,21800])enemies.push({type:'moth',x,y:420,baseX:x,baseY:420,w:58,h:42,alive:true,phase:x/100});
 // Later acts add spaced encounters, leaving NPCs, checkpoints and landings safe.
 for(const [x,min,max,speed] of [[10200,10000,10400,78],[13800,13650,14000,82],[18450,18250,18650,88]])enemies.push({type:'beetle',x,y:563,w:48,h:39,min,max,dir:1,speed,alive:true});
 for(const x of [15400,18900])enemies.push({type:'moth',x,y:400,baseX:x,baseY:400,w:58,h:42,alive:true,phase:x/100});
 // Thorn beds and periodic light jets have visible warning phases.
 for(const x of [5600,8400,12000,15000,19400])hazards.push({type:'thorn',x,y:579,w:95,h:23});
 for(const x of [6650,9820,13300,16100])hazards.push({type:'jet',x,y:478,w:48,h:124,phase:x/200});
 // Modular material changes preserve all established collision geometry.
 platforms.forEach((a,i)=>{a.material=a.solid?'ground':a.moving?'mobile':a.x>20500?'wood':['stone','roots','terrace','wood'][Math.floor(a.x/2100)%4];a.variant=i%3;});
 // A real three-step stair at the start; the artwork follows these same surfaces.
 for(let i=0;i<3;i++)add(430+i*60,568-i*33,60,34,{material:'step',stair:i});
 return {platforms,flowers,enemies,hazards,lanterns,feathers:[{x:3020,y:275,w:30,h:42,cooldown:0},{x:7370,y:275,w:30,h:42,cooldown:0},{x:14000,y:275,w:30,h:42,cooldown:0},{x:20760,y:540,w:30,h:42,cooldown:0}],secret:{x:1585,y:215,w:30,h:30,got:false},gate:{x:20840,y:370,w:36,h:232,solid:true},goal:{x:22900,y:435,w:100,h:167}};
}
export const zones=[{x:0,name:'El despertar',hint:'Luz: «Sigue las flores. Mantén el salto para llegar más alto.»'},{x:1800,name:'El jardín de los pasos',hint:'Los escarabajos se pueden esquivar… o saltar encima.'},{x:3300,name:'El primer recuerdo',hint:'El farol está arriba. Sube por las terrazas y pulsa E.'},{x:6300,name:'El barranco de las alas',hint:'Una pluma azul: protección y doble salto durante 18 segundos.'},{x:9600,name:'Las ruinas encendidas',hint:'La luz roja avisa. Espera a que desaparezca antes de cruzar.'},{x:14300,name:'Los jardines del silencio',hint:'Luz: «Recordar es otra forma de estar juntos.»'},{x:16900,name:'El último recuerdo',hint:'Queda un farol. Busca las flores de las terrazas.'},{x:20400,name:'El puente a casa',hint:'Tres faroles, un puente. Recoge la pluma azul: corre y usa el doble salto.'}];
