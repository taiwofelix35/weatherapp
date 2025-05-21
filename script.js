document.getElementById('checkBtn').addEventListener('click', getWeather);

async function getWeather() {
  const apiKey = '21c6f50cb7a0298411844a210cb61da4'; 
  const city = document.getElementById('cityInput').value;
  const resultDiv = document.getElementById('weatherResult');
  const forecastDiv = document.getElementById('forecast');
  const forecastItems = document.getElementById('forecastItems');

  if (!city) {
    resultDiv.innerHTML = '<p>Please enter a city name.</p>';
    forecastDiv.style.display = 'none';
    return;
  }

  resultDiv.innerHTML = '<p>Loading...</p>';
  forecastDiv.style.display = 'none';

  try {
    // Current weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!weatherRes.ok) throw new Error('City not found');
    const weatherData = await weatherRes.json();

    resultDiv.innerHTML = `
      <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
      <p>${weatherData.weather[0].description}</p>
      <p><strong>${weatherData.main.temp}°C</strong></p>
      <p>Humidity: ${weatherData.main.humidity}%</p>
      <p>Wind: ${weatherData.wind.speed} m/s</p>
    `;

    // Forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!forecastRes.ok) throw new Error('Forecast not found');
    const forecastData = await forecastRes.json();

    forecastItems.innerHTML = '';
    const daily = {};

    forecastData.list.forEach(entry => {
      const date = entry.dt_txt.split(' ')[0];
      if (!daily[date]) {
        daily[date] = entry;
      }
    });

    Object.values(daily).slice(0, 5).forEach(day => {
      forecastItems.innerHTML += `
        <div class="forecast-item">
          <p><strong>${day.dt_txt.split(' ')[0]}</strong></p>
          <p>${day.weather[0].main}</p>
          <p>${day.main.temp}°C</p>
        </div>
      `;
    });

    forecastDiv.style.display = 'block';

  } catch (error) {
    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    forecastDiv.style.display = 'none';
  }
}
