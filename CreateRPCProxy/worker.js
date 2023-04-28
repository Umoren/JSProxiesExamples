self.onmessage = function (event) {
  const { id, method, args } = event.data;

  if (typeof self[method] === "function") {
    self[method](...args)
      .then((result) => {
        self.postMessage({ id, result });
      })
      .catch((error) => {
        self.postMessage({ id, error });
      });
  } else {
    self.postMessage({ id, error: "Method not found" });
  }
};

async function expensiveTask(duration) {
  await new Promise((resolve) => setTimeout(resolve, duration));
  return `Task completed after ${duration}ms`;
}
