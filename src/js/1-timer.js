import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

let selectedDate = null;

iziToast.settings({
  position: 'topRight',
  timeout: 3000,
});

const setElementState = (element, isEnabled) => {
  element.toggleAttribute('disabled', !isEnabled);
};

const handleDateSelection = (dates, triggerButton) => {
  if (dates[0] < new Date()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
    setElementState(triggerButton, false);
  } else {
    selectedDate = dates[0];
    setElementState(triggerButton, true);
  }
};

const formatWithLeadingZero = (num) => String(num).padStart(2, '0');

const calculateTimeUnits = (milliseconds) => {
  const timeUnits = {
    day: 86400000,
    hour: 3600000,
    minute: 60000,
    second: 1000,
  };
  return {
    days: formatWithLeadingZero(Math.floor(milliseconds / timeUnits.day)),
    hours: formatWithLeadingZero(
      Math.floor((milliseconds % timeUnits.day) / timeUnits.hour)
    ),
    minutes: formatWithLeadingZero(
      Math.floor((milliseconds % timeUnits.hour) / timeUnits.minute)
    ),
    seconds: formatWithLeadingZero(
      Math.floor((milliseconds % timeUnits.minute) / timeUnits.second)
    ),
  };
};

const refreshTimerDisplay = (timerElements, timeData) => {
  Object.keys(timeData).forEach((unit) => {
    timerElements[unit].textContent = timeData[unit];
  });
};

const initiateCountdown = (timerElements, inputField) => {
  const countdownInterval = setInterval(() => {
    const remainingTime = selectedDate - new Date();
    refreshTimerDisplay(timerElements, calculateTimeUnits(remainingTime));
    if (remainingTime < 1000) {
      clearInterval(countdownInterval);
      setElementState(inputField, true);
    }
  }, 1000);
};

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('button[data-start]');
  const dateInput = document.querySelector('#datetime-picker');
  const timerElements = ['days', 'hours', 'minutes', 'seconds'].reduce(
    (elements, unit) => {
      elements[unit] = document.querySelector(`[data-${unit}]`);
      return elements;
    },
    {}
  );

  setElementState(startButton, false);
  flatpickr(dateInput, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose: (dates) => handleDateSelection(dates, startButton),
  });

  startButton.addEventListener('click', () => {
    initiateCountdown(timerElements, dateInput);
    setElementState(startButton, false);
    setElementState(dateInput, false);
  });
});
