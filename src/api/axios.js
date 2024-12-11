import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: 'http://127.0.0.1:3456', // url = base url + request url
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // const param = config.data;
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response
    return res
  },
  error => {
    console.log(error)

    return Promise.reject(error)
  }
)

export default service
