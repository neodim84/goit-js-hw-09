import { Notify } from 'notiflix/build/notiflix-notify-aio';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const inputRef = document.querySelector('#datetime-picker');
const startRef = document.querySelector('[data-start]');
startRef.style.backgroundColor = 'yellowgreen';

let timerDeadline = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    timerDeadline = selectedDates[0].getTime();
    if (timerDeadline < Date.now()) {
      startRef.disabled = true;
      Notify.warning('Please choose a date in the future');
    } else {
      startRef.disabled = false;
    }
  },
};

flatpickr(inputRef, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

const timer = {
  intervalId: null,
  refs: {
    daysRef: document.querySelector('[data-days]'),
    hoursRef: document.querySelector('[data-hours]'),
    minutesRef: document.querySelector('[data-minutes]'),
    secondsRef: document.querySelector('[data-seconds]'),
  },
  start() {
    if (timerDeadline < 1000) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      const deltaTime = timerDeadline - Date.now();
      const timeMs = convertMs(deltaTime);
      //   const { daysRef, hoursRef, minutesRef, secondsRef } = this.refs;
      this.refs.daysRef.textContent = pad(timeMs.days);
      this.refs.hoursRef.textContent = pad(timeMs.hours);
      this.refs.minutesRef.textContent = pad(timeMs.minutes);
      this.refs.secondsRef.textContent = pad(timeMs.seconds);
    }, 1000);
  },
};

startRef.addEventListener('click', timer.start.bind(timer));
