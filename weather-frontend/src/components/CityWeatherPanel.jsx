import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../services/api';
import WeatherCard from './WeatherCard';
import DailyChart from './DailyChart';

export default function CityWeatherPanel({
  city,
  selectedDate,
  setSelectedDate,
  availableDates,
  setAvailableDates
}) {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    fetchWeatherData(city).then(data => {
      setWeatherData(data);

      const dates = [...new Set(data.map(item => item.date_time.slice(0, 10)))];

      // Global availableDates state'e tarihler ekle
      setAvailableDates(prev =>
        [...new Set([...prev, ...dates])].sort()
      );

      // Eğer başlangıçta tarih seçilmemişse ilkini set et
      if (!selectedDate && dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    });
  }, [city]);

  const filteredData = weatherData.filter(item =>
    item.date_time.startsWith(selectedDate)
  );

  let maxTempData = null;
  let minTempData = null;
  let avgTemp = null;
  let nowTempData = null;

  if (filteredData.length > 0) {
    maxTempData = filteredData.reduce((max, item) =>
      item.temperature > max.temperature ? item : max, filteredData[0]);

    minTempData = filteredData.reduce((min, item) =>
      item.temperature < min.temperature ? item : min, filteredData[0]);

    const total = filteredData.reduce((sum, item) => sum + item.temperature, 0);
    avgTemp = (total / filteredData.length).toFixed(1);

    // Anlık saate en yakın veri
    const now = new Date();
    const nowHour = now.getHours();
    nowTempData = filteredData.reduce((closest, item) => {
      const hour = parseInt(item.date_time.slice(11, 13));
      const diff = Math.abs(hour - nowHour);
      const closestDiff = Math.abs(parseInt(closest.date_time.slice(11, 13)) - nowHour);
      return diff < closestDiff ? item : closest;
    }, filteredData[0]);
  }

  return (
    <div className="city-panel">
      <h2 className="text-lg font-bold mb-2 text-center">{city}</h2>

      {maxTempData && minTempData && nowTempData && (
        <WeatherCard
          data={nowTempData}
          maxTemp={maxTempData.temperature}
          minTemp={minTempData.temperature}
          avgTemp={avgTemp}
          nowTemp={nowTempData.temperature}
        />
      )}

      <div className="day-buttons-container">
        {availableDates.map(date => {
          const dayName = new Date(date).toLocaleDateString('tr-TR', { weekday: 'long' });
          const display = `${date} - ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}`;
          const isSelected = date === selectedDate;

          return (
            <button
              key={date}
              className={`day-button ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              {display}
            </button>
          );
        })}
      </div>

      <h3 className="chart-title">{selectedDate} - Saatlik Sıcaklık Trendi</h3>
      <DailyChart data={filteredData} />
    </div>
  );
}
