function createRpcProxy(worker) {
  const handler = {
    get(target, method) {
      return function (...args) {
        return new Promise((resolve, reject) => {
          const id = Date.now() + Math.random().toString(36).substr(2);

          worker.onmessage = function (event) {
            const { id: responseId, result, error } = event.data;
            if (responseId === id) {
              if (error) {
                reject(new Error(error));
              } else {
                resolve(result);
              }
            }
          };

          worker.postMessage({ id, method, args });
        });
      };
    },
  };

  return new Proxy({}, handler);
}

const worker = new Worker("worker.js");
const rpcProxy = createRpcProxy(worker);

rpcProxy
  .expensiveTask(2000)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
