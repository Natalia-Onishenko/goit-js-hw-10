import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
  input: document.querySelector("#datetime-picker"),
  startBtn: document.querySelector("[data-start]"),
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};

let userSelectedDate = null;
let timerId = null;

// спочатку кнопка неактивна
refs.startBtn.disabled = true;

// ініціалізація flatpickr
flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];
    if (pickedDate <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      refs.startBtn.disabled = true;
      return;
    }
    userSelectedDate = pickedDate;
    refs.startBtn.disabled = false; // кнопка активна після вибору валідної дати
  },
});

refs.startBtn.addEventListener("click", () => {
  refs.startBtn.disabled = true; // кнопка блокується під час таймера
  refs.input.disabled = true;    // інпут блокується під час таймера

  timerId = setInterval(() => {
    const diff = userSelectedDate - new Date();

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimerFace({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      refs.input.disabled = false; // інпут знову активний
      return;
    }

    updateTimerFace(convertMs(diff));
  }, 1000);
});

function updateTimerFace({ days, hours, minutes, seconds }) {
  refs.days.textContent = String(days).padStart(2, "0");
  refs.hours.textContent = String(hours).padStart(2, "0");
  refs.minutes.textContent = String(minutes).padStart(2, "0");
  refs.seconds.textContent = String(seconds).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}