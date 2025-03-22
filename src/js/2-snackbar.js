import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

iziToast.settings({
  position: 'topRight',
  timeout: 3000,
});

const handleFormSubmission = (evt) => {
  evt.preventDefault();
  const formElements = evt.target.elements;

  const inputDelay = formElements.delay;
  const inputState = formElements.state;

  const selectedState = inputState.value;
  const delayTime = Number(inputDelay.value);
  let userPromise;

  if (selectedState === 'fulfilled') {
    userPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, delayTime);
    });
  } else {
    userPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject();
      }, delayTime);
    });
  }

  userPromise
    .then(() => {
      iziToast.success({
        icon: '',
        iconText: '',
        title: '✅ OK',
        message: `Fulfilled promise in ${delayTime}ms`,
      });
    })
    .catch(() => {
      iziToast.error({
        icon: '',
        iconText: '',
        title: '❌ Error',
        message: `Rejected promise in ${delayTime}ms`,
      });
    });
};

document.addEventListener('DOMContentLoaded', () => {
  const formElement = document.querySelector('form');

  formElement.addEventListener('submit', (evt) => {
    handleFormSubmission(evt);
  });
});
