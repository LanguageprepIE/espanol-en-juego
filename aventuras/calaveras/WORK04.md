# Work 04 — personajes, tres fases y guardián

El único nivel existente se organiza en tres fases continuas: El sendero de las flores (0–7900), Los faroles del recuerdo (7900–15900) y El guardián y el regreso (15900–23200). No se han creado mundos adicionales.

- Luz, Inés y Tomás: ilustraciones originales con transparencia, dos preguntas sencillas por personaje; E / Hablar; conversaciones opcionales. Error: reintento sin daño ni límite de tiempo. Acierto: vida, energía o pluma, una sola vez; guarda punto de descanso si avanza el checkpoint.
- Guardián de la Niebla: búho fantástico original, tres poses ilustradas. Avisa durante 1,3 s, lanza una ráfaga y baja las alas; hay una ventana de 4,2 s para saltar sobre su cabeza. Cada salto abre una pregunta; tres recuerdos liberados abren el portal. Punto de control antes del combate, errores de español sin daño, energía restaurada después de cada recuerdo. No representa una figura religiosa.
- 17 enemigos frente a los 12 anteriores; cinco encuentros adicionales en los tramos posteriores. Los escarabajos finales son algo más rápidos. Se mantienen los dos patrones originales y sus avisos.
- Subidas opcionales 2390, 6800 y 13400: primer peldaño a 520 y siguientes a 425/330; ascensos de 82/95/95 px frente a los 112–122 px iniciales inalcanzables del prototipo. Plumas recolocadas para poder recogerlas sobre la última plataforma.
- Botón Controles: auto / sí / no. Botones de dirección, correr, Hablar/E y salto, compatibles con entrada simultánea; no hay palanca analógica. `any-pointer:coarse` además del modo manual, cabecera adaptada a teléfonos.
- Atlas nuevo `assets/work04/characters.webp`: 768×512, seis celdas de 256, anclaje 128/238, 149.064 bytes; recursos gráficos de ejecución 1.104.028 bytes. Los píxeles visibles aprobados del alumno conservan exactamente sus valores.

## Verificación

34 pruebas automatizadas superadas. Diez recorridos mediante inputs normales alcanzan la victoria, incluidos tres saltos sobre el guardián y las tres respuestas; no se usan teletransportes ni vidas extra en esos recorridos. Nueve sin muertes y uno con dos muertes; todos completados.

Chrome real: conversación de Luz abierta con teclado, respuesta incorrecta y correcta, segunda pregunta, premio de una vida, vuelta a juego; botón para mostrar controles táctiles. Recorrido completo en navegador a 32× mediante el controlador de pruebas: victoria, 3 faroles, 3 vidas, 62 flores, 83 saltos y 61 aterrizajes, 89,108 s de simulación. Los atajos de posición se usaron únicamente para las pruebas aisladas de la interfaz, no para ese recorrido completo.

Pendiente: prueba física de esta versión en Safari/iPad y multitáctil real; la captura del profesor confirma los controles de la versión anterior, no certifica estos cambios. No se considera que la automatización sustituya la valoración humana de diversión/dificultad ni una medición de fluidez en el dispositivo. El navegador de pruebas entrega aproximadamente un cuadro por segundo; no sirve para certificar rendimiento móvil.
