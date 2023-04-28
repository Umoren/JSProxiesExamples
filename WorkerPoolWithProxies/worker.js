importScripts("https://unpkg.com/workerpool@6.1.2/dist/workerpool.min.js");

async function fetchApi(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

workerpool.worker({
  fetchApi,
});
