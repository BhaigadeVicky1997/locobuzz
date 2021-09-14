// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//    production: false,
//    baseUrl: 'http://45.64.192.86:8030/api',
//    // baseUrl: 'http://192.168.1.34:8030/api',
//    hubUrl: 'http://45.64.192.86:8030/hubs/',
//    MediaUrl: 'http://45.64.192.86:8020/',
// };

export const environment = Object.assign({
   production: false,
 },
 (window as any).bootstrapSettings);

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
