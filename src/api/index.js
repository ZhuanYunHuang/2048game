import requestBase from './requestBase';

class Api {
  constructor() {
  }

  getBooksList(data, cb, cbErr) {
    requestBase.post('/getBooksList', data).then((res) => {
      cb(res)
    }).catch((err) => {
      cbErr(err)
    })  
  }

  getMaxScore(data, cb, cbErr) {
    requestBase.post('getMaxScore', data).then((res) => {
      cb(res)
    }).catch((err) => {
      cbErr(err)
    })  
  }

  addScore(data, cb, cbErr) {
    requestBase.post('/addScore', data).then((res) => {
      cb(res)
    }).catch((err) => {
      cbErr(err)
    })  
  }
}

export default new Api();