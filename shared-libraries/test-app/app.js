require('dotenv').config()
// const express = require('express')
// const app = express()
const { Logger,
    startDebugging,
    stopDebugging,
    debugFor,
    setLogLevel,
    requestLoggingMiddleware } = require('logging')

const HttpClient = require('http-client')

const httpClient = new HttpClient()
httpClient.preRequest((config) => {
    console.log('Before request sent 1')
    console.log(config)
    config.headers = {}
    config.headers['added-header'] = 'sddsds'
    return config
})
httpClient.preRequest((config) => {
    console.log('Before request sent 2')
    console.log(config)
    return config
})
httpClient.preResponse((response) => {
    console.log('Before response is delivered 1')
    console.log(response);
    response.data = { a: 23 }
    return response
})
httpClient.preResponse((response) => {
    console.log('Before response is delivered 2')
    console.log(response);
    return response
})
httpClient.get('https://google.com').then((res) => {
    console.log('Response received');
    console.log(res);
}).catch(error => {
    console.log(error);
})

// app.use('/', requestLoggingMiddleware)

// app.use('/', (req, res) => {
//     res.send({ success: true })
// })

// app.listen(5050)
// const response = { access_token: 'kokoko', message: 'a replacement msg', loggerName: 678788, status: 200, error: { 'fb-page-access-token': '33', message: 'adfjkndsfjsnamdfd' } }
// const response = 'dskdsdksdsk'

// const logger = new Logger("lolo")

// logger.info('A msg')
// logger.setName('KOKOKOKOKO')
// logger.info('A msg')

// logger.info('A msg')
// logger.info(new Error("Error Message"))
// logger.info(response)
// logger.info('A msg', response)
// logger.info('A msg', new Error("Error Message"))
// logger.info(new Error("Error Message"), response)
// logger.info('A msg', new Error("Error Message"), response)

// logger.debug('A debug level message that will not be displayed')
// startDebugging()
// logger.debug('A debug level message')
// stopDebugging()
// logger.debug('A debug level message that will not be displayed')

// setInterval(() => {
//     logger.info('Logging debug message')
//     logger.debug('A debug level message')
// }, 1000)
// debugFor(60 * 2)

// logger.debug('A debug level message that will not be displayed')
// setLogLevel('silly')
// logger.debug('A debug level message')