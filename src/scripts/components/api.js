const handleResponse = (response) => {
  if (response.ok) {
    return response.json();
  }
};

export const handleError = (error) => console.log(error);

export const apiFns = {
  getUser: (config) => {
    return fetch(`${config.baseUrl}/users/me`, {
      headers: config.headers,
    }).then(handleResponse);
  },
  editUser: (config, bodyData) => {
    return fetch(`${config.baseUrl}/users/me`, {
      method: "PATCH",
      headers: config.headers,
      body: JSON.stringify(bodyData),
    }).then(handleResponse);
  },
  editUserAvatar: (config, bodyData) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: config.headers,
      body: JSON.stringify(bodyData),
    }).then(handleResponse);
  },
  getInitialCards: (config) => {
    return fetch(`${config.baseUrl}/cards`, {
      headers: config.headers,
    }).then(handleResponse);
  },
  addNewCardtoServer: (config, bodyData) => {
    return fetch(`${config.baseUrl}/cards`, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify(bodyData),
    }).then(handleResponse);
  },
  deleteCardFromServer: (config, cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: config.headers,
    }).then(handleResponse);
  },
  putLike: (config, cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: "PUT",
      headers: config.headers,
    }).then(handleResponse);
  },
  deleteLike: (config, cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: "DELETE",
      headers: config.headers,
    }).then(handleResponse);
  },
};
