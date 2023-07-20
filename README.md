# mcraAPI
API personalizada para proyecto cuatrimestral UTJ.
Recuerden el string de mongo db, este fue actualizado a una variable de entorno en el archivo .env, el cual no esta presente en sus pc's (cuestiones de seguridad). Tienen que crearlo ahi y declarar su valor, que es el string que les pase por whatsapp.

## HTTPS disponible ahora
Bros, quisiera saber si pudieran calar el https, o bueno @cesar si pudieras calarte la API corriendo en https que
corra tanto en tu PC como en tu cel.\  
Para compilar a android tienes que hacer lo siguiente:\
1° ng build, este comando lo das en tu proyecto de Angular\
2° En la carpeta "dist" estan los archivos que acabas de compilar para android\
3° Pasas todo lo de esa carpeta (no la carpeta en si, solo el contenido), a la carpeta\ 
www que esta en el proyecto de cordova\
4° Dentro de esa carpeta de cordova abres el CMD y corres "cordova build android"\
5° Ya que haya terminado, corres "cordova run android"\
