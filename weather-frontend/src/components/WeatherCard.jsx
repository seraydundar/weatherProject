// src/components/WeatherCard.jsx
import React, { useState, useEffect } from 'react';
import {
  FaTemperatureHigh,
  FaTemperatureLow,
  FaTint,
  FaWind,
  FaCloudSun,
  FaThermometerHalf,
  FaRegClock,
  FaSun,
  FaCloud,
  FaCloudRain
} from 'react-icons/fa';
import './WeatherStyles.css';

export default function WeatherCard({ data, maxTemp, minTemp, avgTemp, nowTemp }) {
  const [currentTime, setCurrentTime] = useState('');

  // Yüklenince ve her dakika güncelle (saniyesiz)
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return null;

  // Ortalama barı -10…60°C arası ölçekle
  const normalizeAvg = val => {
    const pct = ((val + 10) / 70) * 100;
    return `${Math.min(Math.max(pct, 0), 100)}%`;
  };

  // Duruma göre ikon seç
  let conditionIcon;
  const cond = data.weather_condition;
  if (cond === 'Açık') {
    conditionIcon = <FaSun style={{ margin: '0 6px' }} />;
  } else if (cond === 'Bulutlu') {
    conditionIcon = <FaCloud style={{ margin: '0 6px' }} />;
  } else if (cond.includes('Yağmur') || cond.includes('çisenti')) {
    conditionIcon = <FaCloudRain style={{ margin: '0 6px' }} />;
  } else {
    conditionIcon = <FaCloudSun style={{ margin: '0 6px' }} />;
  }

  return (
    <div className="weather-card">
      {/* Şehir başlığı */}
      <h2 className="weather-title">{data.city}</h2>

      {/* Tarih başlık gibi ortada */}
      <p className="weather-date">
        <FaCloudSun /> <strong>Tarih:</strong> {data.date_time.slice(0, 10)}
      </p>

      {/* Saat da başlık gibi ortada */}
      <p className="weather-date">
        <FaRegClock /> <strong>Saat:</strong> {currentTime}
      </p>

      {/* Anlık sıcaklık: farklı ikon */}
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

      {/* Ortalama bar — “Durum”un hemen üstünde */}
      <div className="bar-row average-row">
        <span><FaThermometerHalf /> Ortalama</span>
        <div className="bar">
          <div style={{ width: normalizeAvg(avgTemp) }} />
        </div>
        <span>{avgTemp}°C</span>
      </div>

      {/* Durum satırı, ikonlu */}
      <p className="weather-info">
        <strong>Durum:</strong> {conditionIcon}{data.weather_condition}
      </p>
    </div>
  );
}
