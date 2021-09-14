(function (window) {
    let locationurl = window.location.href;
    window.bootstrapSettings = {
        baseUrl: 'http://45.64.192.86:8030/api',
        // baseUrl: 'http://192.168.1.34:8030/api',
        hubUrl: 'https://signalr.locobuzz.com/signalr/groupID=17&UserRole=Admin',
        MediaUrl: 'http://45.64.192.86:8020/',
    };
    if(locationurl.includes('http://192.168.1.34:8040/'))
    {
        window.bootstrapSettings = {
            baseUrl: 'http://192.168.1.34:8030/api',
            // baseUrl: 'http://192.168.1.34:8030/api',
            hubUrl: 'https://signalr.locobuzz.com/signalr/groupID=17&UserRole=Admin',
            MediaUrl: 'http://192.168.1.34:8020/',
        };

    }
  }(this));
