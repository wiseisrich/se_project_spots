import "../pages/index.css";

import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "7c613b8e-44f3-4a37-8cb3-929d62176891",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    setUserData(user);
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const avatarImage = document.querySelector(".profile__avatar");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close");
const avatarInput = avatarModal.querySelector("profile-avatar-input");

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#add-new-post-modal");
const addCardForm = newPostModal.querySelector(".modal__form");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const linkInputEl = newPostModal.querySelector("#card-link-input");
const nameInputEl = newPostModal.querySelector("#card-caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form_delete");
const deleteCancelBtn = deleteModal.querySelector(".modal__cancel-btn");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");

const modals = document.querySelectorAll(".modal");
let selectedCard;
let selectedCardId;

function handleModalClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function setUserData(data) {
  profileNameEl.textContent = data.name;
  profileDescriptionEl.textContent = data.about;
  avatarImage.src = data.avatar;
}

modals.forEach((modal) => {
  modal.addEventListener("mousedown", handleModalClick);
});

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", (evt) => handleLike(evt, data._id));

  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    document.querySelector(".modal__caption").textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) closeModal(openModal);
  }
}

document.addEventListener("keydown", handleEscape);

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      console.log(data.avatar);
      setUserData(data);
      evt.target.reset();
      disableButton(submitBtn, settings);
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Delete...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Delete";
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-btn_active");
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-btn_active");
    })
    .catch(console.error);
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  const editModalInputs = [
    ...editProfileModal.querySelectorAll("modal__input"),
  ];

  resetValidation(editProfileForm, editModalInputs);
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

addCardForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

deleteModalCloseBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = editProfileNameInput.value;
      profileDescriptionEl.textContent = editProfileDescriptionInput.value;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: nameInputEl.value,
    link: linkInputEl.value,
  };
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .addCard(inputValues)
    .then((res) => {
      const cardElement = getCardElement(res);
      cardsList.prepend(cardElement);
      addCardForm.reset();
      closeModal(newPostModal);
      disableButton(submitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);
deleteCancelBtn.addEventListener("click", () => closeModal(deleteModal));
editProfileForm.addEventListener("submit", handleEditProfileSubmit);
addCardForm.addEventListener("submit", handleAddCardSubmit);

enableValidation(settings);
