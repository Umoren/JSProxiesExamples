// Create a worker pool
const pool = workerpool.pool("worker.js");

function createRpcProxy(pool) {
  return new Proxy(
    {},
    {
      get(target, prop, receiver) {
        return async function (...args) {
          const result = await pool.exec(prop, args);
          return result;
        };
      },
    }
  );
}

const rpcProxy = createRpcProxy(pool);

const apiUrls = [
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3",
];

const contentElement = document.getElementById("content");

Promise.all(apiUrls.map(fetchApi))
  .then((results) => {
    results.forEach((result, index) => {
      const apiResultElement = document.createElement("div");
      apiResultElement.classList.add("api-result");
      apiResultElement.innerHTML = `
        <h2>API Response ${index + 1}</h2>
        <pre>${truncate(JSON.stringify(result, null, 2), 150)}</pre>
      `;
      contentElement.appendChild(apiResultElement);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  })
  .finally(() => {
    pool.terminate();
  });

async function fetchApi(url) {
  const result = await rpcProxy.fetchApi(url);
  return result;
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength) + "...";
}
