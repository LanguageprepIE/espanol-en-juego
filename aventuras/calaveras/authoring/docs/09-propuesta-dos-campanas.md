# Propuesta — dos campañas sobre un motor común

Documento de diseño para conversar con el profesor. No implementa mundos, avatares ni guardado nuevos.

## Estructura

Un mapa de mundos, una elección de campaña y un selector de avatar. Como estructura inicial de cada mundo: tres fases de aventura y un desafío final con un villano original. El nivel de Día de Muertos sirve como primera referencia de calidad y jugabilidad; habría que adaptar su progreso al mapa antes de añadir muchos mundos.

El motor, controles, colisiones, animaciones, recompensas y guardado se comparten. Los contenidos, escenarios y objetivos se definen por mundo. El guardado puede ser local, sin cuentas; el progreso pertenece al navegador del dispositivo.

## Campaña cultural — propuesta inicial

| Mundo | Posibles fases y variedad |
|---|---|
| Día de Muertos | Jardín, instituto iluminado, plaza y Guardián de la Niebla. Base ya existente. |
| Carnavales | Cádiz y Tenerife como lugares o submundos diferenciados, con escenarios y música propios; no mezclar sus tradiciones como si fueran idénticas. |
| Sanfermines | Plataformas urbanas, rutas de escape y una fase de persecución durante el encierro. |
| Cuarto destino por decidir | Elegir con el profesor un destino que aporte contraste visual y mecánico. |

Las pistas y personajes aportan información cultural breve durante la aventura. Los desafíos finales usan villanos fantásticos propios. Las figuras de la celebración pueden ser guías o aliados.

## Campaña académica — propuesta inicial

| Mundo | Lugares y contenido |
|---|---|
| Instituto | Taquillas, comedor, laboratorio, aula de español; asignaturas, horario, opiniones y normas. |
| Pueblo o ciudad | Plazas, tiendas y servicios; lugares, direcciones, compras y transporte. |
| Casa | Habitaciones, jardín y rutina diaria; descripción, tareas, horas y hábitos. |
| Cuarto mundo por decidir | Por ejemplo, ocio o viajes, según la progresión del curso. |

Prioridad: plataformas divertidas y objetivos concretos. Las conversaciones y misiones practican español sin convertir cada obstáculo en una pregunta obligatoria.

## Avatares

Tres diseños iniciales con personalidades y peinados distintos, incluido un diseño de apariencia andrógina. Pantalón o falda de cuadros y dos o tres paletas de uniforme disponibles para cualquiera, sin asociar obligatoriamente una prenda a un género.

Cada silueta y prenda necesita mantener proporciones, anclas y continuidad en las nueve acciones del protagonista. El cambio de color se puede preparar con máscaras de ropa, conservando piel, pelo, contornos y sombreado. El mayor trabajo es producir y revisar esas animaciones coherentes; no crear el menú de colores.

## Orden propuesto

1. Corregir y comprobar la interfaz táctil y vertical.
2. Acordar el mapa, la progresión de mundos y el criterio de las dos campañas.
3. Diseñar y validar un selector pequeño de avatares y uniformes.
4. Adaptar el mundo actual al mapa y al guardado.
5. Construir un único mundo nuevo completo que valide el sistema antes de ampliarlo a los demás.

El alcance requiere entregas sucesivas. La reutilización del motor permite concentrar el esfuerzo en ilustración, diseño de fases, variedad de enemigos y pruebas reales de cada salto.
