import React, { useState, useEffect, useRef } from 'react';
import CityWeatherPanel from '../components/CityWeatherPanel';
import GroupedComparisonChart from '../components/GroupedComparisonChart';
import HourlyComparison from '../components/HourlyComparison';
import DaySidebar from '../components/DaySidebar';
import { fetchWeatherData } from '../services/api';
import '../components/WeatherStyles.css';

export default function HomePage() {
  const today = new Date().toISOString().slice(0,10);

  // — Detay modu için
  const [detailCity,  setDetailCity]   = useState(null);
  const [detailDate,  setDetailDate]   = useState(today);
  const [detailDates, setDetailDates]  = useState([]);

  // — Ana sayfa tarih seçimi
  const [selectedDate,  setSelectedDate]   = useState(today);
  const [availableDates, setAvailableDates] = useState([]);

  // — Dropdown kontrolü
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const pickerRef = useRef();

  // — Grafik tipi
  const [chartMetric, setChartMetric] = useState('temperature');

  // — İstanbul’dan tarihleri çek
  useEffect(() => {
    fetchWeatherData("Istanbul").then(data => {
      const dates = Array.from(new Set(data.map(i => i.date_time.slice(0,10)))).sort();
      setAvailableDates(dates);
      if (!dates.includes(selectedDate)) {
        setSelectedDate(dates[0] || today);
      }
    });
  }, []);

  // — Dış tıklama ile dropdown’u kapat
  useEffect(() => {
    const handler = e => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // — Detay modu açıldığında o şehrin tarihlerini çek
  useEffect(() => {
    if (!detailCity) return;
    fetchWeatherData(detailCity).then(data => {
      const dates = Array.from(new Set(data.map(i => i.date_time.slice(0,10)))).sort();
      setDetailDates(dates);
      if (!dates.includes(detailDate)) {
        setDetailDate(dates[0] || today);
      }
    });
  }, [detailCity]);

  const cities = ["Istanbul","Ankara","Izmir"];
  const METRIC_LABELS = {
    temperature: "Sıcaklık",
    humidity:    "Nem",
    wind_speed:  "Rüzgar"
  };

  const formatDay = date =>
    new Date(date)
      .toLocaleDateString('tr-TR',{weekday:'long'})
      .replace(/^./, s=>s.toUpperCase());

  return (
    <div className="homepage-container">
      {detailCity === null ? (
        <>
          {/* ——— ANA SAYFA ——— */}
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

          {/* → Tekli Açılır Gün Seçici ← */}
          <div className="date-picker" ref={pickerRef}>
            <button
              type="button"
              className="date-picker-btn"
              onClick={() => setDatePickerOpen(o => !o)}
            >
              {formatDay(selectedDate)} ({selectedDate})
            </button>
            {datePickerOpen && (
              <div className="date-options">
                {availableDates.map(date => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setDatePickerOpen(false);
                    }}
                    className={date === selectedDate ? 'selected' : ''}
                  >
                    {`${formatDay(date)} (${date})`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* — Grafik tipi butonları — */}
          <div className="metric-selector">
            {Object.entries(METRIC_LABELS).map(([key,label])=>{
              const sel = key === chartMetric;
              return (
                <button
                  key={key}
                  onClick={() => setChartMetric(key)}
                  className={`metric-button${sel?' selected':''}`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* — Seçilen grafiği göster — */}
          {chartMetric === 'temperature'
            ? <GroupedComparisonChart selectedDate={selectedDate} />
            : <HourlyComparison selectedDate={selectedDate} metric={chartMetric} />
          }
        </>
      ) : (
        /* ——— DETAY MODU ——— */
        <div className="detail-page">
          {/* Liste sol blok olarak */}
          <DaySidebar
            dates={detailDates}
            selectedDate={detailDate}
            onSelect={setDetailDate}
            city={detailCity}
          />

          {/* Kart + Grafik ortada */}
          <div className="detail-content">
            <button className="btn-back" onClick={() => setDetailCity(null)}>
              ← Geri
            </button>
            <CityWeatherPanel
              city={detailCity}
              selectedDate={detailDate}
              setSelectedDate={setDetailDate}
              showChart={true}
              showDateButtons={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
