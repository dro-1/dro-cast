"use strict";

var button = document.querySelector("button");
var inputBox = document.querySelector("input");
var city = document.querySelector("div.location p > span:first-child");
var date = document.querySelector("div.location p > span:last-child");
var temp = document.querySelector("div.degree > p");
var weather = document.querySelector("div.degree div.level > p");
var weatherImg = document.querySelector("div.degree div.level > img");
var hourlyContainer = document.querySelector("div.hourly");
var dailyContainer = document.querySelector("div.daily");
var mainDiv = document.querySelector("div.inner-wrapper main");
var wrapper = document.querySelector("div.wrapper");

var reset = function reset() {
  city.innerHTML = "";
  date.innerHTML = "";
  temp.innerHTML = "";
  weather.innerHTML = "";
  weatherImg.src = "";
  dailyContainer.innerHTML = "";
  hourlyContainer.innerHTML = "";
};

var setHourlyDivs = function setHourlyDivs(data) {
  var imgSrc;
  var hourly = data.list.map(function (item, index) {
    if (index === 0 || index > 5) return;
    var temp = Math.round(item.main.temp * 1) / 1;
    var baseHour = new Date(item.dt * 1000).getHours();
    var finalHour;

    if (baseHour === 0) {
      finalHour = "12AM";
    } else if (baseHour <= 11) {
      finalHour = baseHour + "AM";
    } else if (baseHour === 12) {
      finalHour = "12PM";
    } else if (baseHour > 12) {
      finalHour = baseHour % 12 + "PM";
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

    return '<div>\n    <img src="'.concat(imgSrc, '" alt="" />\n    <p>\n      <span>').concat(temp, "&deg;C</span>\n      <span>").concat(finalHour, "</span>\n    </p>\n  </div>");
  });
  hourly = hourly.join("");
  hourlyContainer.innerHTML = hourly;
};

var setDailyDivs = function setDailyDivs(data) {
  var currentDay = new Date(Date.now()).getDay();
  var sameDay;
  var imgSrc;
  var daily = data.list.map(function (item, index) {
    var itemDay = new Date(item.dt * 1000).getDay();
    if (currentDay === itemDay) return;
    if (sameDay !== undefined && sameDay === itemDay) return;
    sameDay = itemDay;
    var minTemp = Math.round(item.main.temp_min * 10) / 10;
    var maxTemp = Math.round(item.main.temp_max * 10) / 10;
    var finalDate;

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

    return "<div>\n    <p>".concat(finalDate, "</p>\n    <p>").concat(minTemp, "&deg;C / ").concat(maxTemp, '&deg;C</p>\n    <img src="').concat(imgSrc, '" alt="" />\n  </div>');
  });
  daily = daily.join("");
  dailyContainer.innerHTML = daily;
};

var setMain = function setMain(data) {
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

var setPage = function setPage(data) {
  //console.log(data);
  if (data.cod === "404") {
    reset();
    city.innerHTML = "The city you entered was not found";
    return;
  }

  localStorage.setItem("lastQuery", JSON.stringify(data));
  setMain(data);
  setHourlyDivs(data);
  setDailyDivs(data);
  wrapper.style.display = "block";
  if (window.matchMedia("(min-width: 1000px)").matches) mainDiv.style.width = "45%";
}; //885033


button.addEventListener("click", function (e) {
  e.preventDefault();
  var location = inputBox.value.toLowerCase();
  var API_KEY = "b88f28378cd3b5baab1e28f17612802d";
  var query = "https://api.openweathermap.org/data/2.5/forecast?q=".concat(location, "&units=metric&appid=").concat(API_KEY);
  fetch(query).then(function (response) {
    return response.json();
  }).then(setPage)["catch"](function (error) {
    return console.log(error.message);
  });
});
var lastSearch = JSON.parse(localStorage.getItem("lastQuery"));
console.log(lastSearch);

if (lastSearch && lastSearch.cod === "200") {
  setPage(lastSearch);
} // document.querySelector("img.ghost").onload = () => {
//   document.querySelector("div.wrapper").style.backgroundImage =
//     'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("./assets/images/sun-3.jpg")';
// };


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").then(function (SWRegistration) {
    console.log(" Service Worker registered successfully");
  })["catch"](function (error) {
    console.log("Service Worker Registration Error: ".concat(error));
  });
}