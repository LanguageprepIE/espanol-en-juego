# Work 06 — interfaz vertical

Problema comunicado por el profesor mediante una captura real de Safari de iPad: los avisos largos se dibujan sobre el alumno y el borde del suelo. En móvil ocupan una proporción mayor de la zona jugable.

## Corrección preparada

- El escenario conserva el lienzo y el motor de 1280 × 720; no se altera arte, cámara, saltos ni colisiones.
- En pantallas verticales de hasta 1100 px de ancho, un grid reserva filas para HUD, escenario, pista de interacción, controles y avisos. HUD, pista, botones y mensajes dejan de superponerse al escenario.
- El HUD y la pista reservan altura para reducir cambios de posición cuando varía el texto. Los avisos largos pueden crecer debajo de los botones.
- El inicio, la pausa y la victoria siguen asociados a la celda del escenario; admiten desplazamiento para contenido largo.
- En horizontal se conserva la distribución superpuesta. Las reglas de ampliación ocupan el área disponible y mantienen el dibujo con object-fit:contain.
- Al cambiar entre disposiciones se liberan las entradas mantenidas sin reiniciar el progreso.
- Los botones conservan sus controles por puntero; el lienzo no desplaza la página al tocarlo y los paneles permiten desplazamiento vertical.

## Verificación realizada

Las 41 pruebas existentes del motor y de contenido pasan, incluidos diez recorridos completos y otro con los nueve encuentros y 18 preguntas. La compilación del HTML autónomo y git diff --check pasan. Estos resultados no verifican la distribución CSS.

## Pruebas visuales pendientes

No se ha podido abrir la vista local en el navegador remoto: el servidor está aislado en otro espacio de red; el intento de iniciarlo fuera del aislamiento fue rechazado por la política automática de permisos. No se presentan las comprobaciones de tamaños como superadas.

Pendientes: 834×1110 y 768×1024 (iPad vertical), 390×844 y 320×640 (teléfono vertical), iPad horizontal, giro sin pérdida de progreso, ampliación, avisos largos y diálogos en Safari/iPad real.

layout-review.html contiene un banco de revisión local con iframes de distintos tamaños y medidas visibles del canvas, HUD, botones, avisos y superposiciones. Se sirve desde la carpeta authoring con un servidor HTTP. Las medidas permiten comprobar que, en vertical, los botones y avisos empiezan después de la base del canvas, que el HUD queda encima y que el bitmap sigue en 1280×720. Ese banco está preparado, pero no se ha ejecutado con éxito en esta sesión.

Estado: rama de revisión; sin fusionar ni publicar esta corrección.
