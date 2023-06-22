import axios from 'axios';
import { Message } from 'element-ui';
// import { getToken, setToken } from '@/utils/cookie';

// const AUTH_KEY = 'Bearer';

const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // 跨域允许携带cookie
});

// 请求拦截
http.interceptors.request.use((config) => {
  // if (getToken()) {
  //   config.headers.Authorization = AUTH_KEY + getToken();
  // }
  return config;
}, err => Promise.reject(err));

// 响应拦截
http.interceptors.response.use((response) => {
  // if (response.config.url.endsWith('/api/login') && response.headers.authorization) {
  //   const token = response.headers.authorization.split(' ')[1];
  //   setToken(token);
  // }
  // blob
  if (response.config.responseType === 'blob') {
    return Promise.resolve(response);
  }
  // 成功
  if (response.data.code === 200) {
    return Promise.resolve(response.data.result);
  }

  // 错误
  Message.error({
    showClose: true,
    message: response.data.msg || `Error:${response.request.responseURL}`,
  });
  return Promise.reject(response.data);
}, (error) => {
  Message.error({
    showClose: true,
    message: error.message,
  });
  return Promise.reject(error);
});

export default http;
