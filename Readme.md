MVP:
Creación de una app, con conexión a las APIs de IMDB y Google Maps donde el usuario pueda, despues de hacer Sign Up y LogIn, acceder a un formulario de creación de película, parcialmente autocompletado con información extraida de la API de IMDB.

De IMDB, nos traemos información básica de la película, que se almacenará en nuestra BBDD.

Adicionalmente, el formulario cuenta con campos latitud y longitud, y descripción de la escena rodada en esa ubicación.

Esto crea una ficha de detalles de la película, en la cual otros usuarios pueden indicar una valoración en formato rating de 1 a 5 estrellas.

El auth cuenta con un admin que tiene proiviledios delete y edit, y usuarios básicos con privilegios create y read y rating

BONUS:
Que el usuario pueda subir una foto suya en el lugar de la película en la vista de detalles.


ENDPOINTS TABLE:

|HTTP Method|URI Path|Description|JSON|
|--------|--------|--------|--------|
|GET|/|Index Page|--------|
|GET|/crear-pelicula|New movie location form render|--------|
|POST|/crear-pelicula|New movie location form handler|--------|
|GET|/mapa|Render map|--------|
|GET|/registro|User SignUp form render|--------|
|POST|/registro|User SignUp form handler|--------|
|GET|/inicio-sesion|User LogIn form render|--------|
|POST|/inicio-sesion|User LogIn form handler|--------|
|GET|/mi-perfil|User profile|--------|
|GET|api/detalles/:id|Details list render|🎬|
|POST|api/detalles/:id|Admin could delete and edit the films and user's anly can edit their own registres with conditional rendering|🎬|
|GET|api/listado|Render movies list|🎬|
|GET|api/detalles/:id/valoracion|Rating form render|🎬|
|POST|api/detalles/:id/valoracion|Rating form render|🎬|
|GET|/editar-localizacion|Owner user could edit location details|--------|
|POST|/editar-localizacion|Owner user could edit location details|--------|

