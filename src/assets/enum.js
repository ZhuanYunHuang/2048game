//格子颜色
export const getBgColor = (number) => {
  switch(number){
    case 2: return "#eee4da"
    case 4: return "#ede0c8"
    case 8: return "#f2b179"
    case 16: return "#f59563"
    case 32: return "#f67c5f"
    case 64: return "#f65e3b"
    case 128: return "#edcf72"
    case 256: return "#edcc61"
    case 512: return "#9c0"
    case 1024: return "#33b5e5"
    case 2048: return "#09c"
    case 4096: return "#a6c"
    case 8192: return "#93c"
  }
  return "#C8BEB2";
}

export const getNumColor = (number) => {
  return number <= 4 ? '#776e65' : '#fff'
}

export const getFontSize = (number) => {
  if(number < 128) {
    return 30
  } else if(number < 1024) {
    return 28
  } else if(number >= 1024) {
    return 20
  }
}

//防抖函数
export const debounce = (func, delay, immediate) => {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    if (immediate) {
      // 复杂的防抖函数
      // 判断定时器是否为空，如果为空，则会直接执行回调函数
      let firstRun = !timer;
      // 不管定时器是否为空，都会重新开启一个新的定时器,不断输入，不断开启新的定时器，当不在输入的delay后，再次输入就会立即执行回调函数
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      if (firstRun) {
        func.apply(this, arguments);
      }
      // 简单的防抖函数
    } else {
      timer = setTimeout(() => {
        func.apply(this, arguments);
      }, delay);
    }
  };
}
 
/**
 * 节流函数
 * @param {*} fn 要执行的函数
 * @param {*} interval 时间间隔
 * @param {*} options 可选参数： leading第一次是否执行, trailing 最后一次是否执行
 * @returns 
 */
export const throttle = (fn, interval, options = { leading: false, trailing: true }) => {
  // 1.记录上一次的开始时间
  const { leading,trailing,resultCallback} = options
  let lastTime = 0
  let timer = null
 
  // 2.事件触发时, 真正执行的函数
  const _throttle = function (...args) {
      // 2.1.获取当前事件触发时的时间
      const nowTime = new Date().getTime()
      if (!lastTime && !leading) lastTime = nowTime
 
      // 2.2.使用当前触发的时间和之前的时间间隔以及上一次开始的时间, 计算出还剩余多长事件需要去触发函数
      const remainTime = interval - (nowTime - lastTime)
      if (remainTime <= 0) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
 
        // 2.3.真正触发函数
        const result = fn.apply(this, args)
        if (resultCallback && typeof resultCallback === 'function') 
           resultCallback(result) //函数回调返回返回值
        // 2.4.保留上次触发的时间
        lastTime = nowTime
        return
      }
 
      if (trailing && !timer) {
        timer = setTimeout(() => {
          const result = fn.apply(this, args)
          if (resultCallback  && typeof resultCallback === 'function')  
           resultCallback(result) //函数回调返回返回值
          timer = null
          lastTime = !leading ? 0 : new Date().getTime()
        }, remainTime)
      }
  }
 
  _throttle.cancel = function () {
    if (timer) clearTimeout(timer)
    timer = null
    lastTime = 0
  }
 
  return _throttle
}