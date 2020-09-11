"use strict";

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open("v1").then(function (cache) {
    return cache.addAll(["/", "/index.html", "/script.js", "/styles.css", "/assets/images/cloud-weather.svg", "/assets/images/cloud.svg", "/assets/images/rain-weather.svg", "/assets/images/sun-weather.svg", "/assets/images/sun-3.jpg", "/assets/font/Raleway.woff2", "/assets/font/Raleway-latin.woff2"]);
  }));
});
self.addEventListener("fetch", function (event) {
  event.respondWith( // Return cached file if it exists
  fetch(event.request)["catch"](function () {
    return caches.match(event.request);
  }));
});
self.addEventListener("activate", function (event) {
  var cacheWhitelist = ["v1"];
  event.waitUntil(caches.keys().then(function (keyList) {
    return Promise.all(keyList.map(function (key) {
      if (cacheWhitelist.indexOf(key) === -1) {
        return caches["delete"](key);
      }
    }));
  }));
});