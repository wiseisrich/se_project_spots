class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
    return promise.all([this.getInitialCards()]);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      promise.reject(`Error: ${res.status}`);
    });
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      promise.reject(`Error: ${res.status}`);
    });
  }

  editAvatarInfo(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      promise.reject(`Error: ${res.status}`);
    });
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${Id}`, {
      method: "Delete",
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      promise.reject(`Error: ${res.status}`);
    });
  }

  addLike(id) {
    return fetch(`${this._baseUrl}/cards/${Id}/likes`, {
      method: "put",
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      promise.reject(`Error: ${res.status}`);
    });
  }

  changeLikeStatus(id, isLiked) {
    return fetch(`${this._baseUrl}/cards/${Id}/likes`, {
      method: isLiked ? "delete" : "put",
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      promise.reject(`Error: ${res.status}`);
    });
  }
}
export default Api;
