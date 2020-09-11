const button = document.querySelector("button");
const inputBox = document.querySelector("input");

const city = document.querySelector("div.location p > span:first-child");
const date = document.querySelector("div.location p > span:last-child");
const temp = document.querySelector("div.degree > p");
const weather = document.querySelector("div.degree div.level > p");
const weatherImg = document.querySelector("div.degree div.level > img");
const hourlyContainer = document.querySelector("div.hourly");
const dailyContainer = document.querySelector("div.daily");
const mainDiv = document.querySelector("div.inner-wrapper main");
const wrapper = document.querySelector("div.wrapper");

const setHourlyDivs = (data) => {
  let imgSrc;
  let hourly = data.list.map((item, index) => {
    if (index === 0 || index > 5) return;
    const temp = Math.round(item.main.temp * 1) / 1;
    let baseHour = new Date(item.dt * 1000).getHours();
    let finalHour;
    if (baseHour === 0) {
      finalHour = "12AM";
    } else if (baseHour <= 11) {
      finalHour = baseHour + "AM";
    } else if (baseHour === 12) {
      finalHour = "12PM";
    } else if (baseHour > 12) {
      finalHour = (baseHour % 12) + "PM";
    }

    switch (item.weather[0].main.toLowerCase()) {
      case "clouds":
        imgSrc = "./assets/images/cloud-weather.svg";
        break;
      case "rain":
        imgSrc = "./assets/images/rain-weather.svg";
        break;
      case "clear":
        imgSrc = "./assets/images/sun-weather.svg";
        break;
    }

    return `<div>
    <img src="${imgSrc}" alt="" />
    <p>
      <span>${temp}&deg;C</span>
      <span>${finalHour}</span>
    </p>
  </div>`;
  });
  hourly = hourly.join("");
  hourlyContainer.innerHTML = hourly;
};

const setDailyDivs = (data) => {
  const currentDay = new Date(Date.now()).getDay();
  let sameDay;
  let imgSrc;
  let daily = data.list.map((item, index) => {
    const itemDay = new Date(item.dt * 1000).getDay();

    if (currentDay === itemDay) return;
    if (sameDay !== undefined && sameDay === itemDay) return;

    sameDay = itemDay;

    const minTemp = Math.round(item.main.temp_min * 10) / 10;
    const maxTemp = Math.round(item.main.temp_max * 10) / 10;

    let finalDate;
    switch (itemDay) {
      case 0:
        finalDate = "Sunday";
        break;
      case 1:
        finalDate = "Monday";
        break;
      case 2:
        finalDate = "Tuesday";
        break;
      case 3:
        finalDate = "Wednesday";
        break;
      case 4:
        finalDate = "Thursday";
        break;
      case 5:
        finalDate = "Friday";
        break;
      case 6:
        finalDate = "Saturday";
        break;
      default:
        finalDate = "Day";
    }
    if (itemDay === currentDay + 1) {
      finalDate = "Tomorrow";
    }

    switch (item.weather[0].main.toLowerCase()) {
      case "clouds":
        imgSrc = "./assets/images/cloud-weather.svg";
        break;
      case "rain":
        imgSrc = "./assets/images/rain-weather.svg";
        break;
      case "clear":
        imgSrc = "./assets/images/sun-weather.svg";
        break;
    }

    return `<div>
    <p>${finalDate}</p>
    <p>${minTemp}&deg;C / ${maxTemp}&deg;C</p>
    <img src="${imgSrc}" alt="" />
  </div>`;
  });
  daily = daily.join("");
  dailyContainer.innerHTML = daily;
};

const setMain = (data) => {
  city.innerHTML = data.city.name;
  date.innerHTML = new Date(data.list[0].dt * 1000).toDateString();
  temp.innerHTML = Math.round(data.list[0].main.temp * 10) / 10 + "&deg;C";
  759;
  weather.innerHTML = data.list[0].weather[0].main;
  switch (data.list[0].weather[0].main.toLowerCase()) {
    case "clouds":
      weatherImg.src = "./assets/images/cloud-weather.svg";
      break;
    case "rain":
      weatherImg.src = "./assets/images/rain-weather.svg";
      break;
    case "clear":
      weatherImg.src = "./assets/images/sun-weather.svg";
      break;
  }
};

const setPage = (data) => {
  //console.log(data);
  localStorage.setItem("lastQuery", JSON.stringify(data));
  setMain(data);
  setHourlyDivs(data);
  setDailyDivs(data);
  wrapper.style.display = "block";
  if (window.matchMedia("(min-width: 1000px)").matches)
    mainDiv.style.width = "45%";
};

button.addEventListener("click", (e) => {
  e.preventDefault();
  const location = inputBox.value.toLowerCase();
  const API_KEY = "b88f28378cd3b5baab1e28f17612802d";
  const query = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`;
  fetch(query)
    .then((response) => response.json())
    .then(setPage)
    .catch((error) => console.log(error));
});

const lastSearch = JSON.parse(localStorage.getItem("lastQuery"));
if (lastSearch) {
  //console.log("from LocalStorage");
  setPage(lastSearch);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then((SWRegistration) => {
      console.log(" Service Worker registered successfully");
    })
    .catch((error) => {
      console.log(`Service Worker Registration Error: ${error}`);
    });
}
