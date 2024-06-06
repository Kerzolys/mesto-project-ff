const handleResponse = (response) => {
  if (response.ok) {
    return response.json();
  } 
};

const handleError = (error) => console.log(error);

const getUser = (config) => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(handleResponse);
};

const editUser = (config, bodyData) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify(bodyData),
  }).then(handleResponse);
};

const editUserAvatar = (config, bodyData) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify(bodyData),
  }).then(handleResponse);
};

const getInitialCards = (config) => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(handleResponse);
};

const addNewCardtoServer = (config, bodyData) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify(bodyData),
  }).then(handleResponse);
};

const deleteCardFromServer = (config, cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(handleResponse);
};

const putLike = (config, cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  }).then(handleResponse);
};

const deleteLike = (config, cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(handleResponse);
};

export {
  getUser,
  editUser,
  editUserAvatar,
  getInitialCards,
  addNewCardtoServer,
  deleteCardFromServer,
  putLike,
  deleteLike,
  handleError
};
