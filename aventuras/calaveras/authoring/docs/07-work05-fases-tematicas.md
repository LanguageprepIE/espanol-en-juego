# Work 05 — tres lugares y 18 preguntas temáticas

Estado: versión jugable de revisión, en la rama work/05-fases-tematicas. Un único nivel, sin publicación ni fusión con main.

## Qué cambia para el jugador

| Fase | Identidad visual | Español | Recuerdo extra |
|---|---|---|---|
| 1. El jardín de los retratos | Jardín de cempasúchil, arco tallado, paisaje lejano y flores cercanas | Descripciones, ropa, personalidad y familia | Retrato de familia |
| 2. El instituto de las luces | Nuevo panorama de un instituto con patio, biblioteca, galerías y torre de reloj | Espacios, horario, asignaturas, horas, normas y pasado | Cuaderno de Inés |
| 3. La plaza de los caminos | Nuevo panorama de tiendas, biblioteca, cine, fuente y gran arco urbano | Ciudad, direcciones, transporte, ocio y planes | Mapa de la plaza |

Los tres paisajes conservan el cielo, la iluminación y el lenguaje ilustrado aprobado. Las arquitecturas son capas transparentes independientes. Los suelos, las plataformas, las colisiones, los personajes y los objetos siguen separados: el panorama no sustituye la geometría jugable.

El botón Mapa muestra vistas del motor real y los objetivos de las tres fases. Un arco y un rótulo amplio marcan las entradas; un fundido espacial mezcla las capas al avanzar o retroceder. El HUD indica el objetivo del farol local y el recuerdo extra.

Luz, Inés y Tomás reaparecen en tres descansos de su zona, con dos preguntas por encuentro. Son nueve encuentros opcionales. Se puede salir y retomar desde la siguiente pregunta pendiente. Equivocarse no quita energía ni vidas, y el mundo se detiene durante el diálogo. La pista en inglés se abre voluntariamente y se cierra al pasar a otra pregunta. El acierto explica la respuesta.

Hay 18 preguntas distintas: seis por tema. El Guardián recupera una de cada tema al final; esas tres son repaso del banco, no contenido extra. El contador de preguntas no duplica esos aciertos. No se pide información personal del alumno.

Los tres objetos extra están sobre plataformas reales de rutas altas, dan ocho flores y recuperan energía una sola vez. No bloquean el final si se omiten. Se conservan los patrones, peligros y puente del nivel previo; se apartaron dos patrullas de las nuevas zonas de conversación.

## Ilustraciones y preparación

Generación con la herramienta integrada imagegen, habilidad imagegen, con transparencia real. Prompts: assets/source-work05/prompts.json.

Originales:
- assets/source-work05/school.png
- assets/source-work05/plaza.png
- assets/source-work05/props.png

Ejecución:
- assets/work05/school.webp — 1536 × 684, arquitectura del instituto.
- assets/work05/plaza.webp — 1536 × 684, arquitectura de la plaza.
- assets/work05/props.webp — atlas 768 × 512, seis celdas de 256 × 256: retrato, cuaderno, mapa, tablón, señal y arco.

Se han creado ocho ilustraciones: dos panoramas y seis objetos. Los nuevos recursos WebP ocupan 695.700 bytes; el total de imágenes de ejecución es 1.799.728 bytes. Los PNG maestros nuevos ocupan 7.172.368 bytes. El HTML completo está en torno a 2,4 MB e incorpora las imágenes para uso sin conexión.

La preparación técnica recorta márgenes transparentes, ajusta tamaño, empaqueta celdas con ancla común (128, 236) y codifica WebP. No recolorea el arte previo. La comparación de píxeles confirma cero cambios en los 24 cuadros aprobados del alumno; se mantienen los seis cuadros adicionales de caída y aterrizaje de Work 03.

## Pruebas y límites de la evidencia

41 pruebas de motor y contenido superadas:
- Diez recorridos completos con entradas normales a diferentes posiciones temporales de los enemigos y plataformas.
- Un recorrido que incluye los nueve encuentros, las 18 preguntas y el Guardián.
- Seis preguntas por tema, distribución única en los encuentros y repaso final de los tres temas.
- Salir y retomar una conversación, recompensas únicas y conservación del progreso.
- Diez segundos simulados sin daño en cada uno de los nueve lugares donde se conversa.
- Apoyo físico de los tres objetos extra y ausencia de recompensas repetibles.
- Saltos, colisiones, vidas, derrota, victoria y botones simultáneos del adaptador táctil.
- Fundido de escenas con cobertura y suma de opacidades igual a uno en todo el recorrido.

Verificación de recursos: 82 celdas de los cinco atlas, márgenes transparentes, dimensiones y anclas; 11 imágenes de ejecución con tamaños coherentes con el manifiesto.

Interacción real en Chrome remoto:
- Inicio del HTML autónomo: el botón comienza la partida y se oculta la introducción.
- Tecla E para hablar con Luz e Inés.
- Respuesta errónea, pista en inglés, acierto, explicación y premio de una vida.
- Salida tras la primera respuesta y vuelta a la segunda pregunta, con la pista anterior cerrada.
- Botón para mostrar controles y pulsación del botón en pantalla Hablar: abre la conversación.
- Mapa con las tres vistas ilustradas y cierre para volver a jugar.
- Recorrido automatizado en el navegador a reloj de QA 32×: victoria, 18 preguntas, 9 encuentros, 3 faroles, 3 objetos extra, 6 vidas, 135 flores, 81 saltos y 62 aterrizajes. Tiempo simulado: 90,192 segundos, con respuestas automáticas sin tiempo de lectura.

Ese recorrido no es una partida humana ni permite afirmar una duración de 5–8 minutos. Se usaron atajos de posición para las comprobaciones aisladas de las conversaciones; el recorrido completo usó entradas normales, sin teletransportes ni cambios de salud.

Las seis escenas se someten también a medición de renderizado CPU sin navegador; resultados en work05-render-report.json. No equivale a 60 fps en un dispositivo real. La sesión remota de Chrome tuvo una cadencia aproximada de una imagen por segundo, que no permite certificar fluidez en equipos de aula.

Pendientes:
- Safari de iPad real y teléfono real, incluidos varios dedos simultáneos.
- Rendimiento en el ordenador y los iPads usados en el aula.
- Partida humana completa para valorar diversión, dificultad y tiempo de lectura.
- Revisión del profesor del banco y de la cantidad de encuentros que se desee utilizar.

## Notas culturales y fuentes

Las notas del mapa son breves, voluntarias y distinguen la fantasía del juego de las costumbres culturales. No se pide que el alumno hable de familiares fallecidos.

- UNESCO, «El Día de Muertos: el regreso de lo querido» (consultado el 23-10-2026): https://www.unesco.org/es/articles/el-dia-de-muertos-el-regreso-de-lo-querido — cempasúchil, ofrendas, recuerdo de los seres queridos y diversidad de expresiones entre comunidades.
- INPI, «Aliento de cempasúchil. Celebración de Día de Muertos entre los pueblos indígenas del Estado de México»: https://www.gob.mx/inpi/articulos/aliento-de-cempasuchil-celebracion-de-dia-de-muertos-entre-los-pueblos-indigenas-del-estado-de-mexico — el resultado de búsqueda confirma el retrato en el altar; el acceso completo al sitio oficial quedó bloqueado. No se han reconstruido detalles del artículo.

El instituto encantado, los coleccionables, los poderes y el Guardián son ficción original del juego.

