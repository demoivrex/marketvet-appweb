// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Conexion database prueba

/*export const environment = {
 /* production: false,
  firebase: {
    apiKey: 'AIzaSyDL3h2taSYgZXQCMmnF0ABviIUvhIOIG1A',
    authDomain: 'pruebamarketvetweb.firebaseapp.com',
    projectId: 'pruebamarketvetweb',
    storageBucket: 'pruebamarketvetweb.appspot.com',
    messagingSenderId: '983273856213',
    appId: '1:983273856213:web:2151e60b30ed775fd8165c',
    measurementId: 'G-8VBWDSVBWY',
  },
};
 */
// Conexion database produccion
export const environment = {
  production: false,
  mapboxAccessToken: 'pk.eyJ1IjoiZGVtb2l2cmUiLCJhIjoiY2twZmJpbGJ5MGd6eTJ2bGUzZjJkYzN6NCJ9.n_PkU6cnN536atyddmoz5Q',
  firebase: {
    apiKey: 'AIzaSyCbvC-B09uUkUUxOSb_R1FgDpQMjjP8wzo',
    authDomain: 'recibosaf-c64ad.firebaseapp.com',
    databaseURL: 'https://recibosaf-c64ad.firebaseio.com',
    projectId: 'recibosaf-c64ad',
    storageBucket: 'recibosaf-c64ad.appspot.com',
    messagingSenderId: '854510400251',
    appId: '1:854510400251:web:0be9966929c816ba25b65e',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
