// src/components/CityWeatherPanel.jsx
import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../services/api';
import WeatherCard from './WeatherCard';
import DailyChart from './DailyChart';

const METRICS = [
  { key: 'temperature', label: 'Sıcaklık (°C)' },
  { key: 'humidity',    label: 'Nem (%)'   },
  { key: 'wind_speed',  label: 'Rüzgar (km/h)' }
];

export default function CityWeatherPanel({
  city,
  selectedDate,
  setSelectedDate,
  availableDates,
  setAvailableDates,
  showChart = true,
  showDateButtons = true,
  onCardClick
}) {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('temperature');

  useEffect(() => {
    fetchWeatherData(city).then(data => {
      setWeatherData(data);
      if (showDateButtons) {
        const dates = [...new Set(data.map(i => i.date_time.slice(0, 10)))].sort();
        setAvailableDates(prev => [...new Set([...prev, ...dates])].sort());
        if (!selectedDate && dates.length) setSelectedDate(dates[0]);
      }
    });
  }, [city, showDateButtons]);

  const filtered = weatherData.filter(i =>
    i.date_time.startsWith(selectedDate)
  );

  // En yakın veri noktası
  const nowData = filtered.length > 0
    ? filtered.reduce((closest, i) => {
        const h = new Date().getHours();
        const d1 = Math.abs(parseInt(i.date_time.slice(11,13),10) - h);
        const d2 = Math.abs(parseInt(closest.date_time.slice(11,13),10) - h);
        return d1 < d2 ? i : closest;
      }, filtered[0])
    : null;

  return (
    <div
      className="city-panel"
      onClick={onCardClick ? () => onCardClick(city) : undefined}
      style={{
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Weather Card */}
        {nowData && (
          <WeatherCard
            data={nowData}
            maxTemp={Math.max(...filtered.map(i => i.temperature))}
            minTemp={Math.min(...filtered.map(i => i.temperature))}
            avgTemp={(filtered.reduce((s, i) => s + i.temperature, 0) / filtered.length).toFixed(1)}
            nowTemp={nowData.temperature}
          />
        )}

        {/* Date Buttons */}
        {showDateButtons && (
          <div className="day-buttons-container">
            {availableDates.map(date => {
              const day = new Date(date).toLocaleDateString('tr-TR', { weekday: 'long' });
              const label = `${date} – ${day.charAt(0).toUpperCase() + day.slice(1)}`;
              return (
                <button
                  key={date}
                  type="button"
                  className={`day-button${date === selectedDate ? ' selected' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Chart & Metric Selector */}
        {showChart && (
          <div style={{ width: '100%', marginTop: '20px' }}>
            <h3 className="chart-title">
              {selectedDate} – Saatlik {METRICS.find(m => m.key === selectedMetric).label} Trendi
            </h3>
            <DailyChart
              data={filtered}
              metric={selectedMetric}
            />
            {/* Metric butonları grafiğin altında, sağa yaslı */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '12px',
              flexWrap: 'wrap'
            }}>
              {METRICS.map(m => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setSelectedMetric(m.key)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: m.key === selectedMetric ? '2px solid #0077ff' : '2px solid #ccc',
                    background: m.key === selectedMetric ? '#0077ff' : '#fff',
                    color: m.key === selectedMetric ? '#fff' : '#333',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
