
const once = (eventTarget, type) => new Promise((resolve, reject) => {
  const onResolve = (e) => {
    eventTarget.removeEventListener(type, onResolve);
    eventTarget.removeEventListener('error', onReject);
    resolve(e.target.result)
  }
  const onReject = (e) => {
    eventTarget.removeEventListener(type, onResolve);
    eventTarget.removeEventListener('error', onReject);
    reject(e.target.error)
  }
  eventTarget.addEventListener(type, onResolve);
  eventTarget.addEventListener('error', onReject);
})

export { once }
