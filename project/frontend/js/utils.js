const CSRF_TOKEN = document.querySelector('meta[name=csrf-token]').getAttribute('content');
const GRAPH_ENDPOINT = '/graph';

function checkIsRequestSucceed(response) {
  if (!response.ok) {
    throw Error(`${response.status} ${response.statusText}: ${response.url}`);
  }
  return response;
}

export function fetchGetJson(url) {
  return fetch(url, {
    credentials: 'same-origin',
  })
        .then(checkIsRequestSucceed)
        .then((response) => response.json())
        .catch(logError);  // eslint-disable-line
}

export function fetchPostJson(url, payload) {
  return fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken:': CSRF_TOKEN,
    },
    body: JSON.stringify(payload),
  })
        .then(checkIsRequestSucceed)
        .then((response) => response.json())
        .catch(logError);  // eslint-disable-line
}

export function fetchGraphData(payload) {
  return fetch(GRAPH_ENDPOINT, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/edn',
      'X-CSRFToken': CSRF_TOKEN,
    },
    body: payload,
  })
        .then(checkIsRequestSucceed)
        .then((response) => response.json())
        .catch(logError);  // eslint-disable-line
}
