import React, { useState } from "react";
import "./App.css";

const API_KEY = "0f24b9ef3289598b3efaa0f0f40e51ff";

const WeatherInput = ({ city, setCity, fetchWeatherData }) => (
    <div className="weather-input">
      <input
          type="text"
          placeholder="Введите город:"
          value={city}
          onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeatherData}>Узнать погоду</button>
    </div>
);

const WeatherDisplay = ({ weatherData, getCircleColor }) => (
    <div className="weather-display">
      <div
          className="temperature-circle"
          style={{ backgroundColor: getCircleColor(weatherData.temperature) }}
      >
        {weatherData.temperature}°C
      </div>
      <div className="weather-info">
        <h2>{weatherData.city}</h2>
        <p>Ощущается как: {weatherData.feelsLike}</p>
        <p>Влажность: {weatherData.humidity}</p>
        <p>Ветер: {weatherData.wind}</p>
        <p>Описание: {weatherData.description}</p>
      </div>
    </div>
);

const WeatherHistory = ({ history, clearHistory }) => (
    <div className="history">
      <h3>История запросов:</h3>
      <table>
        <thead>
        <tr>
          <th>Время</th>
          <th>Город</th>
          <th>Температура</th>
        </tr>
        </thead>
        <tbody>
        {history.map((entry, index) => (
            <tr key={index}>
              <td>{entry.time}</td>
              <td>{entry.city}</td>
              <td>{entry.temperature}°C</td>
            </tr>
        ))}
        </tbody>
      </table>
      <button onClick={clearHistory}>Очистить историю</button>
    </div>
);

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchWeatherData = async () => {
    if (!city) {
      alert("Введите название города!");
      return;
    }
    try {
      const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${API_KEY}`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        alert(data.message);
        return;
      }

      const weatherInfo = {
        time: new Date().toLocaleTimeString(),
        city: data.name,
        temperature: Math.round(data.main.temp),
        feelsLike: `${Math.round(data.main.feels_like)}°C`,
        humidity: `${data.main.humidity}%`,
        wind: `${data.wind.speed} м/с`,
        description: data.weather[0].description,
      };

      setWeatherData(weatherInfo);

      setHistory((prev) => {
        const isDuplicate = prev.some(
            (entry) =>
                entry.city === weatherInfo.city &&
                entry.temperature === weatherInfo.temperature
        );
        return isDuplicate ? prev : [...prev, weatherInfo];
      });
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      alert("Не удалось загрузить данные. Попробуйте еще раз.");
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getCircleColor = (temp) => {
    if (temp < -20) return "#00008b";
    if (temp < 0) return "#00bfff";
    if (temp <= 17) return "#007bff";
    if (temp <= 24) return "#ffd700";
    return "#ff4500"; // Red
  };

  return (
      <div className="app">
        <div className="container">
          <h1>Погодный информатор</h1>

          <WeatherInput
              city={city}
              setCity={setCity}
              fetchWeatherData={fetchWeatherData}
          />

          {weatherData && (
              <WeatherDisplay
                  weatherData={weatherData}
                  getCircleColor={getCircleColor}
              />
          )}

          <WeatherHistory history={history} clearHistory={clearHistory} />
        </div>
      </div>
  );
}

export default App;