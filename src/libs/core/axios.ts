import axios from 'axios'
axios.interceptors.request.use(
  function(config) {
    let qcToken: string | undefined
    let bookId: string | undefined
    if (!!window['SLP_STORAGE']) {
      qcToken = window['SLP_STORAGE'].getItem('qcToken', 'g')
      bookId = window['SLP_STORAGE'].getItem('bookId', 'g')
    }
    // console.log(config)
    if (config.data) {
      config.data.qcToken = qcToken
      config.data.bookId = bookId
    }
    if (config.params) {
      config.params.qcToken = qcToken
      config.params.bookId = bookId
    }
    if (config.method.toLocaleLowerCase() === 'get') {
      config.params = config.params || {}
      if (/^lc/.test(window.location.hostname)) {
        config.params.version = 'prod'
      } else if (/^pre/.test(window.location.hostname)) {
        config.params.version = 'pre'
      } else {
        config.params.version = 'test'
      }
    }
    return config
  },
  function(error) {
    console.log('sdk -------------', 'before request', error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function(response) {
    //console.log(response.config.url,'------', response)
    return response
  },
  function(error) {
    console.log('sdk -------------', 'after request', error)
    return Promise.reject(error)
  }
)

export { axios }
