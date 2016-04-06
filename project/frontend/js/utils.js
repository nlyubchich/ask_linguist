let csrftoken = document.querySelector('meta[name=csrf-token]').getAttribute('content');

export function fetchGetJson(url) {
    return fetch(url, {
        credentials: 'same-origin'
    })
        .then((response) => response.json());
}

export function fetchPostJson(url, payload) {
    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(payload)
    })
        .then((response) => response.json());
}
