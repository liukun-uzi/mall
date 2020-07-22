import axios from 'axios'

export function request(config) {
    
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'xxxxx',
    timeout: 5000
  })

  //2.axios拦截器
  axios.interceptors.request.use(config => {
  return config
  },err => {

  })
  //响应拦截xx
  instance.interceptors.response.use(res => {
    return res.data
  },err => {
    console.log(err);
  })
  //3.发送真正的网络请求
  return instance(config)
}