# El camino de las calaveras — Work 05

Un nivel continuo de plataformas con tres lugares ilustrados: El jardín de los retratos, El instituto de las luces y La plaza de los caminos. Cada fase practica un tema de español. Hay 18 preguntas originales en nueve encuentros opcionales, tres recuerdos extra y un Guardián final que repasa los tres temas.

Versión de revisión en la rama work/05-fases-tematicas. Sin publicación ni fusión con main.

## Jugar y revisar

Abre El-camino-de-las-calaveras.html en un navegador completo. Incluye todas las imágenes y funciona sin conexión; una vista previa que no ejecute JavaScript no permite jugar. El botón Mapa muestra las tres fases con vistas del motor y sus objetivos.

Flechas/A/D: moverse; Shift: correr; Espacio/W/↑: saltar; E/↓: hablar y activar; P/Escape: pausa. Mantén salto para subir más. La pluma da protección y doble salto temporal. El botón Controles permite mostrar los botones táctiles.

Enciende un farol en cada zona. Las conversaciones y los objetos extra son opcionales. Puedes dejar una conversación y retomarla sin repetir preguntas ya completadas. Los errores permiten reintentar sin daño y las pistas en inglés son voluntarias.

## Contenido y evidencia

- docs/06-banco-de-preguntas.md: contexto, opciones, respuestas, explicaciones y pistas de las 18 preguntas.
- docs/07-work05-fases-tematicas.md: cambios, ilustraciones, pruebas y pendientes.
- docs/work05-browser-evidence.json: interacción y recorrido en Chrome remoto.
- docs/work05-render-report.json: mediciones CPU sin navegador.
- assets/source-work05/prompts.json: prompts y procedencia de las nuevas ilustraciones.

41 pruebas superadas, diez recorridos sin conversaciones opcionales y otro que incluye los nueve encuentros. Chrome: reintento, pista, acierto, premio, salida y retorno, mapa, botón táctil Hablar, inicio del HTML autónomo y victoria en el recorrido automatizado. Safari de iPad, dispositivos reales y valoración humana de la duración y diversión siguen pendientes.

No hay cuentas, analítica, APIs de ejecución, ni formularios de datos personales. Las imágenes se cargan localmente.

## Desarrollo

src/story.js contiene el banco y los encuentros; level.js contiene el recorrido; physics.js y game.js contienen el motor; render.js y animation.js muestran las capas y los sprites. El alumno conserva todos los cuadros aprobados.

En la carpeta authoring del repositorio integrado, ejecuta primero python3 extract-assets.py para recuperar las 11 imágenes optimizadas del index.html autónomo de la carpeta superior. En la copia de desarrollo completa, las imágenes ya se incluyen.

npm test no requiere instalar dependencias. npm install habilita las herramientas de imágenes. npm run render:check renderiza seis escenas; npm run art:check comprueba atlas y conservación del alumno. npm run art:build prepara únicamente las nuevas ilustraciones de Work 05 a partir de sus PNG maestros, conservando los recursos anteriores. python3 bundle.py genera el HTML autónomo y dist/.

Para probar por HTTP: python3 -m http.server 4173. La ruta /?qa=1 incorpora herramientas de revisión; se eliminan del HTML autónomo para alumnos. QA Ruta con 18 preguntas usa el mismo integrador de 120 Hz y entradas normales, con respuestas automáticas y reloj acelerado. No representa una partida humana.
