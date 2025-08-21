
const once = (eventTarget, eventName) => {
  const { promise, resolve, reject } = Promise.withResolvers();
  const onResolve = (e) => void resolve(e.target.result);
  const onReject = (e) => void reject(e.target.error);
  eventTarget.addEventListener(eventName, onResolve);
  eventTarget.addEventListener('error', onReject);
  return promise.finally(() => {
    eventTarget.removeEventListener(eventName, onResolve);
    eventTarget.removeEventListener('error', onReject);
  })
}

async function* on(eventTarget, eventName) {
  let result = await once(eventTarget, eventName);
  while (result) {
    yield result;
    cursor = await once(eventTarget, eventName);
  }
}

export { once, on }
