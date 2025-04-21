import React from 'react';
import {
  FaTemperatureHigh,
  FaTemperatureLow,
  FaTint,
  FaWind,
  FaCloudSun,
  FaThermometerHalf,
  FaRegClock
} from 'react-icons/fa';
import './WeatherStyles.css';

export default function WeatherCard({ data, maxTemp, minTemp, avgTemp, nowTemp }) {
  if (!data) return null;

  const normalize = (val, max) => `${Math.min((val / max) * 100, 100)}%`;

  return (
    <div className="weather-card">
      <h2 className="weather-title">{data.city}</h2>
      <p className="weather-info"><FaCloudSun /> <strong>Tarih:</strong> {data.date_time.slice(0, 10)}</p>

      <div className="bar-row">
        <span><FaRegClock /> Anlık</span>
        <div className="bar"><div style={{ width: normalize(nowTemp, 50) }} /></div>
        <span>{nowTemp}°C</span>
      </div>

      <div className="bar-row">
        <span><FaTemperatureHigh /> En Yüksek</span>
        <div className="bar"><div style={{ width: normalize(maxTemp, 50) }} /></div>
        <span>{maxTemp}°C</span>
      </div>

      <div className="bar-row">
        <span><FaTemperatureLow /> En Düşük</span>
        <div className="bar"><div style={{ width: normalize(minTemp, 50) }} /></div>
        <span>{minTemp}°C</span>
      </div>

      <div className="bar-row">
        <span><FaThermometerHalf /> Ortalama</span>
        <div className="bar"><div style={{ width: normalize(avgTemp, 50) }} /></div>
        <span>{avgTemp}°C</span>
      </div>

      <div className="bar-row">
        <span><FaTint /> Nem</span>
        <div className="bar"><div style={{ width: normalize(data.humidity, 100) }} /></div>
        <span>{data.humidity}%</span>
      </div>

      <div className="bar-row">
        <span><FaWind /> Rüzgar</span>
        <div className="bar"><div style={{ width: normalize(data.wind_speed, 100) }} /></div>
        <span>{data.wind_speed} km/h</span>
      </div>

      <p className="weather-info"><strong>Durum:</strong> {data.weather_condition}</p>
    </div>
  );
}
