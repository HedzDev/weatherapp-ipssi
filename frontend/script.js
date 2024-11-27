const cityList = document.querySelector("#cityList");
const addCity = document.querySelector("#addCity");
const input = document.querySelector("#cityNameInput");
const logout = document.querySelector("#logout");

const BASE_URL = "http://localhost:3000";

/**
 * This function is used to display the city details on the frontend.
 * @param {object} data - The data object containing the city details.
 * @returns {void}
 */
function displayCities(data) {
  const html = `
        <div class="cityContainer">
            <p class="name">${data.cityName}</p>
            <p class="description">${data.description}</p>
            <img class="weatherIcon" src="${data.imageId}" />
            <div class="temperature">
                <p class="tempMin">${data.tempMin}°C</p>
                <span>-</span>
                <p class="tempMax">${data.tempMax}°C</p>
            </div>
            <button class="deleteCity" id="${data.cityName}">Delete</button>
        </div>
        `;
  cityList.insertAdjacentHTML("beforeend", html);

  // Call the deleteCity function to delete a city from the list of cities displayed on the frontend
  deleteCity();
}

/**
 * This function is used to delete a city from the list
 * of cities displayed on the frontend.
 * @param {string} cityName - The name of the city to be deleted.
 * @returns {void}
 */
function deleteCity() {
  document.querySelectorAll(".deleteCity").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Fetch the city details from the backend and delete the city from the list of cities displayed on the frontend
      fetch(`${BASE_URL}/weather/${this.id}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => res.json())
        .then(() => {
          // Remove the city container from the frontend when the delete button is clicked
          this.parentNode.remove();
        });
    });
  });
}

fetch(`${BASE_URL}/weather/getAllCities`, {
  credentials: "include",
})
  .then((res) => res.json())
  .then((data) => {
    for (let i = 0; i < data.weather.length; i++) {
      displayCities(data.weather[i]);
    }
  });

// Fetch the list of cities from the backend and display them on the frontend

fetch(`${BASE_URL}/weather`, {
  credentials: "include",
})
  .then((res) => res.json())
  .then((data) => {
    for (let i = 0; i < data.weather.length; i++) {
      displayCities(data.weather[i]);
    }
  });

// Add a new city to the list of cities displayed on the frontend when the "Add City" button is clicked
addCity.addEventListener("click", () => {
  const cityName = input.value;

  if (cityName === "" || cityName.trim() === "") {
    return;
  }
  // Fetch the weather details of the city from the backend
  fetch(`${BASE_URL}/weather`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cityName: cityName }),
  })
    .then((res) => res.json())
    .then((data) => {
      displayCities(data.weather);
    });

  input.value = "";
});

logout.addEventListener("click", async () => {
  const response = await fetch("http://localhost:3000/users/logout", {
    credentials: "include",
  });

  const isLogout = await response.json();
  console.log(isLogout);

  if (isLogout.result) {
    window.location.assign("login.html");
  }
});
