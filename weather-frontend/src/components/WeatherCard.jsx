// src/components/WeatherCard.jsx
import React, { useState, useEffect } from 'react';
import {
  FaTemperatureHigh,
  FaTemperatureLow,
  FaTint,
  FaWind,
  FaThermometerHalf,
  FaRegClock,

  /* Yeni ikonlar */
  FaSun,
  FaCloud,
  FaCloudRain,
  FaCloudSun,
  FaCloudShowersHeavy,
  FaCloudSunRain,
  FaSnowflake,
  FaSmog
} from 'react-icons/fa';
import './WeatherStyles.css';

export default function WeatherCard({ data, maxTemp, minTemp, avgTemp, nowTemp }) {
  const [currentTime, setCurrentTime] = useState('');

  // Saat güncellemesi
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return null;

  // Ortalama çubuğunu normalize et
  const normalizeAvg = val => {
    const pct = ((val + 10) / 70) * 100;
    return `${Math.min(Math.max(pct, 0), 100)}%`;
  };

  // ---- Duruma göre ikon seçme ----
  const condRaw = data.weather_condition || '';
  const cond = condRaw.toLowerCase();
  let conditionIcon;

  if (cond.includes('kar')) {
    conditionIcon = <FaSnowflake style={{ margin: '0 6px' }} />;
  } else if (cond.includes('sağnak') || (cond.includes('yağmur') && !cond.includes('hafif'))) {
    conditionIcon = <FaCloudShowersHeavy style={{ margin: '0 6px' }} />;
  } else if (cond.includes('çisenti') || cond.includes('hafif yağmur')) {
    conditionIcon = <FaCloudRain style={{ margin: '0 6px' }} />;
  } else if (cond.includes('parçalı')) {
    conditionIcon = <FaCloudSun style={{ margin: '0 6px' }} />;
  } else if (cond.includes('sis') || cond.includes('duman')) {
    conditionIcon = <FaSmog style={{ margin: '0 6px' }} />;
  } else if (cond.includes('bulutlu')) {
    conditionIcon = <FaCloud style={{ margin: '0 6px' }} />;
  } else if (cond.includes('güneş') || cond.includes('açık')) {
    conditionIcon = <FaSun style={{ margin: '0 6px' }} />;
  } else {
    // Karışık, güneşli yağışlı vb.
    conditionIcon = <FaCloudSunRain style={{ margin: '0 6px' }} />;
  }
  // ---------------------------------

  return (
    <div className="weather-card">
      <h2 className="weather-title">{data.city}</h2>

      <p className="weather-date">
        <FaCloudSun /> <strong>Tarih:</strong> {data.date_time.slice(0, 10)}
      </p>
      <p className="weather-date">
        <FaRegClock /> <strong>Saat:</strong> {currentTime}
      </p>

      <p className="weather-info">
        <FaThermometerHalf /> Anlık: {nowTemp}°C
      </p>
      <p className="weather-info">
        <FaTemperatureHigh /> En Yüksek: {maxTemp}°C
      </p>
      <p className="weather-info">
        <FaTemperatureLow /> En Düşük: {minTemp}°C
      </p>
      <p className="weather-info">
        <FaTint /> Nem: {data.humidity}%  
      </p>
      <p className="weather-info">
        <FaWind /> Rüzgar: {data.wind_speed} km/h
      </p>

      <div className="bar-row average-row">
        <span><FaThermometerHalf /> Ortalama</span>
        <div className="bar">
          <div style={{ width: normalizeAvg(avgTemp) }} />
        </div>
        <span>{avgTemp}°C</span>
      </div>

      <p className="weather-info">
        <strong>Durum:</strong> {conditionIcon}{data.weather_condition}
      </p>
    </div>
  );
}
