// const logger = require('./logger');
const config = require('../config');

// const axiosRetry = require('axios-retry');
const axios = require('axios');
const tunnel = require('tunnel');

// axiosRetry(axios, {
//     retries: config.requestRetry,
//     retryCondition: () => true,
//     retryDelay: (count, err) => {
//         logger.error(`Request ${err.config.url} fail, retry attempt #${count}: ${err}`);
//         return 100;
//     },
// });

axios.defaults.headers.common['User-Agent'] = config.ua;
axios.defaults.headers.common['X-APP'] = 'RSSHub';

if (config.proxy.host && config.proxy.port) {
    axios.interceptors.request.use((options) => {
        if (new RegExp(config.proxy.url_regex).test(options.url)) {
            // options.proxy = {
            //     host: config.proxy.host,
            //     port: config.proxy.port,
            //     auth: {
            //         username: config.proxy.auth.username,
            //         password: config.proxy.auth.password,
            //     }
            // };
            options.proxy = false;
            options.httpsAgent = tunnel.httpsOverHttp({
                proxy: {
                    host: config.proxy.host,
                    port: parseInt(config.proxy.port),
                    proxyAuth: `${config.proxy.auth.username}:${config.proxy.auth.password}`,
                },
            });
        }
        console.log(options);
        return options;
    });
}

module.exports = axios;
