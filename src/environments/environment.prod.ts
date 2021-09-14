// export const environment = {
//   production: true,
//   baseUrl: 'http://45.64.192.86:8030/api',
//   // baseUrl: 'http://192.168.1.34:8030/api',
//   hubUrl: 'http://45.64.192.86:8030/hubs/',
//   MediaUrl: 'http://45.64.192.86:8020/',
// };
export const environment = Object.assign({
  production: true,
},
(window as any).bootstrapSettings);
