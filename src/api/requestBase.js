import request from './axios'
const requestBase = {
  // post 请求
  post(url, data) {
    return new Promise((resolve, reject) => {
      request({
        url,
        method: 'post',
        data,
        headers:  {
          //7026060
          // 'User-ID': access ? access.userId : '',
          // 'Access-Token': access ? access.accessToken  : '',
          // 'APP-Name': 'camhomme_web_pin'
        }
      }).then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err);
      })
    })
  },
  // get 请求
  // get(url, data) {
  //   return new Promise(resolve => {
  //     url = url + '?' + data.toString();
  //     chrome.storage.local.get(["access"]).then((result) => {
  //       const access = JSON.parse(result.access) 
  //       request({
  //         url: 'web/' + url,
  //         method: 'get',
  //         headers:  {
  //           //7026060
  //           'User-ID': access ? access.userId : '',
  //           'Access-Token': access ? access.accessToken  : '',
  //           'APP-Name': 'camhomme_web_pin'
  //         }
  //       }).then(res => {
  //         resolve(res.data);
  //       }).catch(err => {
  //         reject(err);
  //       })
  //     });
  //   })
  // }
}

export default requestBase;