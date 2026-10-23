export const PHASES=[{x:0,name:'1 / 3 · El sendero de las flores'},{x:7900,name:'2 / 3 · Los faroles del recuerdo'},{x:15900,name:'3 / 3 · El guardián y el regreso'}];
export const NPCS=[
 {id:'luz',name:'Luz',x:280,y:512,w:48,h:90,frame:0,reward:'Una vida extra',intro:'¡Hola! Soy Luz. Te ayudo a encontrar el camino.',questions:[
  {text:'¿Cómo estás?',options:['Estoy bien, gracias.','Son las ocho.','Es azul.'],correct:0},
  {text:'¿De qué color es tu sudadera?',options:['Roja.','Azul.','Verde.'],correct:1}]},
 {id:'ines',name:'Inés',x:7950,y:512,w:48,h:90,frame:1,reward:'Energía y una pluma de luz',intro:'Cuido estas flores para recordar a las personas que queremos.',questions:[
  {text:'¿Qué recoges en el camino?',options:['Libros.','Flores.','Zapatos.'],correct:1},
  {text:'Hay tres faroles. Enciendes uno. ¿Cuántos faltan?',options:['Cinco.','Uno.','Dos.'],correct:2}]},
 {id:'tomas',name:'Tomás',x:16680,y:512,w:48,h:90,frame:2,reward:'Energía y una vida extra',intro:'El Guardián de la Niebla oculta la salida. Espera a que baje las alas y salta sobre su cabeza.',questions:[
  {text:'¿Adónde quieres volver?',options:['A casa.','Soy estudiante.','Hace frío.'],correct:0},
  {text:'¿Qué dices cuando alguien te ayuda?',options:['Buenas noches.','Gracias.','Tengo hambre.'],correct:1}]}
];
export const GUARDIAN_QUESTIONS=[
 {text:'Completa: «Yo ___ estudiante».',options:['eres','es','soy'],correct:2},
 {text:'¿Qué celebramos con los faroles del recuerdo?',options:['El recuerdo de las personas que queremos.','Un examen.','Un partido de fútbol.'],correct:0},
 {text:'Completa: «Quiero volver a ___».',options:['azul','casa','tres'],correct:1}
];
