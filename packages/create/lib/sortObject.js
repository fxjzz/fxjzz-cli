export default function sortObject(obj, keyArr) {
  const res = {}

  if (keyArr) {
    keyArr.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        res[key] = obj[key];
        delete obj[key];
      }
    })
  }
  Object.keys(obj).forEach(k => {
    res[k] = obj[k]
  })
  return res
}