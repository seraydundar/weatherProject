// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import CityWeatherPanel from '../components/CityWeatherPanel';
import GroupedComparisonChart from '../components/GroupedComparisonChart';
import HourlyComparison from '../components/HourlyComparison';
import { fetchWeatherData } from '../services/api';

export default function HomePage() {
  const today = new Date().toISOString().slice(0,10);

  // Detay modu için
  const [detailCity,   setDetailCity]   = useState(null);
  const [detailDate,   setDetailDate]   = useState(today);
  const [detailDates,  setDetailDates]  = useState([]);

  // Ana sayfa tarih seçimi
  const [selectedDate, setSelectedDate] = useState(today);
  const [availableDates, setAvailableDates] = useState([]);

  // Hangi chart’ı gösteriyoruz?
  // 'temperature' | 'humidity' | 'wind_speed'
  const [chartMetric, setChartMetric] = useState('temperature');

  // Başlangıçta İstanbul’dan tarihleri al
  useEffect(() => {
    fetchWeatherData("Istanbul").then(data => {
      const dates = Array.from(new Set(data.map(i => i.date_time.slice(0,10)))).sort();
      setAvailableDates(dates);
      if (!dates.includes(selectedDate)) {
        setSelectedDate(dates[0] || today);
      }
    });
  }, []);

  const cities = ["Istanbul","Ankara","Izmir"];
  const METRIC_LABELS = {
    temperature: "Sıcaklık",
    humidity:    "Nem",
    wind_speed:  "Rüzgar"
  };

  return (
    <div className="homepage-container">
      {detailCity === null ? (
        <>
          {/* Üç şehir kartı */}
          <div className="dashboard-grid">
            {cities.map(cityName => (
              <div
                key={cityName}
                style={{
                  flex: '0 0 300px',
                  width: '300px',
                  display: 'flex',
                  alignItems: 'stretch'
                }}
              >
                <CityWeatherPanel
                  city={cityName}
                  selectedDate={selectedDate}
                  showChart={false}
                  showDateButtons={false}
                  onCardClick={c => {
                    setDetailCity(c);
                    setDetailDate(selectedDate);
                    setDetailDates([]);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Gün seçme butonları */}
          <div style={{
            display:'flex',
            flexWrap:'wrap',
            gap:'8px',
            justifyContent:'center',
            margin:'20px 0'
          }}>
            {availableDates.map(date => {
              const day = new Date(date).toLocaleDateString('tr-TR',{weekday:'long'});
              const label = `${day.charAt(0).toUpperCase()+day.slice(1)} (${date})`;
              const sel = date === selectedDate;
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  style={{
                    padding:'8px 12px',
                    borderRadius:'8px',
                    border: sel ? '2px solid #0077ff' : '2px solid #ccc',
                    background: sel ? '#0077ff' : '#fff',
                    color: sel ? '#fff' : '#333',
                    cursor:'pointer'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Chart tipi butonları */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {Object.entries(METRIC_LABELS).map(([key, label]) => {
              const sel = chartMetric === key;
              return (
                <button
                  key={key}
                  onClick={() => setChartMetric(key)}
                  style={{
                    padding:'8px 16px',
                    borderRadius:8,
                    border: sel ? '2px solid #0077ff' : '2px solid #ccc',
                    background: sel ? '#0077ff' : '#fff',
                    color: sel ? '#fff' : '#333',
                    cursor:'pointer'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Seçilen grafiği göster */}
          {chartMetric === 'temperature' ? (
            <GroupedComparisonChart selectedDate={selectedDate} />
          ) : (
            <HourlyComparison 
              selectedDate={selectedDate} 
              metric={chartMetric} 
            />
          )}
        </>
      ) : (
        <div style={{ textAlign:'center' }}>
          {/* Detay modu geri butonu */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setDetailCity(null);
            }}
            style={{
              margin:'20px',
              padding:'10px 20px',
              borderRadius:'8px',
              border:'none',
              background:'#0077ff',
              color:'#fff',
              cursor:'pointer'
            }}
          >
            ← Geri
          </button>
          {/* Detay sayfası */}
          <CityWeatherPanel
            city={detailCity}
            selectedDate={detailDate}
            setSelectedDate={setDetailDate}
            availableDates={detailDates}
            setAvailableDates={setDetailDates}
            showChart={true}
            showDateButtons={true}
          />
        </div>
      )}
    </div>
  );
}
