// 获取token的方法
export function getItem (key) {
  return JSON.parse(window.localStorage.getItem(key))
}
// 设置token的方法
export function setItem (key, value) {
  return window.localStorage.setItem(key, JSON.stringify(value))
}
// 移除token的方法
export function removeItem (key) {
  return window.localStorage.removeItem(key)
}
