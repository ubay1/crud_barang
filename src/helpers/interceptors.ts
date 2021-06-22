/* eslint-disable @typescript-eslint/no-unused-vars */
import Axios, { AxiosInstance } from "axios";

export const DevUrl = 'http://localhost:8001';
export const DevImageUrl = 'http://localhost:8001/foto_barang';
export const DevApiUrl = 'http://localhost:8001/api';

export function AxiosNormal<AxiosInstance>(timeout?: number) {
  let instance = Axios.create({
    baseURL: DevApiUrl,
    timeout: timeout || 10 * 1000,
  });

  // Add a request interceptor
  instance.interceptors.request.use(function (config) {
    // console.log(config)
    if (typeof config.data === 'undefined') {
      return config;
    } else {
      // get data with bearer
      config.headers.Authorization = `Bearer ${config.data.token}`
      return config;
    }
  }, function (error) {

    return Promise.reject(error);
  });

  // Add a response interceptor
  instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      // console.trace(error.response)
      return Promise.reject(error.response);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.log(error.request);
      return Promise.reject(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.log('Error', error.message);
    }
    console.trace("ndak tau errornya")
    return Promise.reject(error);
  });

  return instance
}