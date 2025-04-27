const pastSearches = {};

// Listen for "Enter" key on input field
document.getElementById("locationInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission if inside a form
        getWeather(); // Call your getWeather function
    }
});


async function getWeather() {
    const location = document.getElementById("locationInput").value.trim();
    if (location === "") return;

    const apiKey = "656fb19893304c9a984190827252304";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    const resultDiv = document.getElementById("weatherResult");
    const loader = document.getElementById("loader");
    const weatherTitle = document.getElementById("weatherTitle");
    const locationNameHistory = document.getElementById("locationNameHistory");

    loader.style.display = "block";
    resultDiv.innerHTML = "";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Location not found!");
        }
        const data = await response.json();

        const temperature = data.current.temp_c;
        const condition = data.current.condition.text;
        const [date, time] = data.location.localtime.split(" ");

        // Store the search only if not already done for this location
        if (!pastSearches[location.toLowerCase()]) {
            pastSearches[location.toLowerCase()] = {
                temperature,
                date,
                condition
            };
            updateHistoryList(location); // Only update history for the searched location
        }

        resultDiv.className = "weather-result"; // reset
        document.body.className = ""; // reset

        // Set background and icon
        const conditionText = condition.toLowerCase();
        if (conditionText.includes("sunny") || conditionText.includes("clear")) {
            resultDiv.classList.add("sunny");
            document.body.classList.add("sunny");
            weatherTitle.innerHTML = "☀️ Weather Forecast";
        } else if (conditionText.includes("cloud")) {
            resultDiv.classList.add("cloudy");
            document.body.classList.add("cloudy");
            weatherTitle.innerHTML = "☁️ Weather Forecast";
        } else if (conditionText.includes("rain")) {
            resultDiv.classList.add("rainy");
            document.body.classList.add("rainy");
            weatherTitle.innerHTML = "🌧️ Weather Forecast";
        } else if (conditionText.includes("storm")) {
            resultDiv.classList.add("stormy");
            weatherTitle.innerHTML = "⛈️ Weather Forecast";
        } else if (conditionText.includes("snow")) {
            resultDiv.classList.add("snowy");
            weatherTitle.innerHTML = "❄️ Weather Forecast";
        } else if (conditionText.includes("fog") || conditionText.includes("mist")) {
            resultDiv.classList.add("foggy");
            weatherTitle.innerHTML = "🌫️ Weather Forecast";
        } else {
            weatherTitle.innerHTML = "🌤️ Weather Forecast";
        }

        resultDiv.innerHTML = ` 
            <strong>Location:</strong> ${data.location.name}, ${data.location.country}<br>
            <strong>Temperature:</strong> ${temperature}°C<br>
            <strong>Date:</strong> ${date}<br>
            <strong>Time:</strong> ${time}<br>
            <strong>Condition:</strong> ${condition}
        `;

        // Update the location name for history
        locationNameHistory.innerText = location;

    } catch (error) {
        resultDiv.className = "weather-result";
        resultDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    } finally {
        loader.style.display = "none";
    }
}

function updateHistoryList(location) {
    const historyList = document.getElementById("historyList");
    const historyTitle = document.getElementById("historyTitle");

    historyList.innerHTML = "";
    const locationData = pastSearches[location.toLowerCase()];

    if (locationData) {
        historyTitle.style.display = "block";
        const li = document.createElement("li");
        li.innerHTML = `<strong>${location.toUpperCase()}</strong> - ${locationData.temperature}°C, ${locationData.condition} on ${locationData.date}`;
        historyList.appendChild(li);
    } else {
        historyTitle.style.display = "none";
    }
}

// Reset Function
function resetSearch() {
    document.getElementById("locationInput").value = ""; // Clears input field
}
