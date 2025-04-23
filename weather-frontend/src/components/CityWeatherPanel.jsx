import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../services/api';
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaCloudShowersHeavy,
  FaCloudSun,
  FaCloudSunRain,
  FaSnowflake,
  FaSmog
} from 'react-icons/fa';
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
  setSelectedDate = () => {},
  availableDates = [],
  setAvailableDates = () => {},
  showChart = true,
  showDateButtons = true,
  onCardClick
}) {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [hourlyData, setHourlyData] = useState(null);

  // Şehir değişince verileri çek
  useEffect(() => {
    fetchWeatherData(city).then(data => {
      setWeatherData(data);
      if (showDateButtons) {
        const dates = Array.from(
          new Set(data.map(i => i.date_time.slice(0,10)))
        ).sort();
        setAvailableDates(dates);
        if (!selectedDate && dates.length) {
          setSelectedDate(dates[0]);
        }
      }
    });
  }, [city, showDateButtons, setAvailableDates, setSelectedDate, selectedDate]);

  // Tarih değişince önceki saati sıfırla
  useEffect(() => {
    setHourlyData(null);
  }, [city, selectedDate]);

  // O günün verileri
  const filtered = weatherData.filter(i =>
    i.date_time.startsWith(selectedDate)
  );

  // Şu anki saate en yakın veri
  const nowData = filtered.length > 0
    ? filtered.reduce((closest, i) => {
        const h = new Date().getHours();
        const d1 = Math.abs(parseInt(i.date_time.slice(11,13),10) - h);
        const d2 = Math.abs(parseInt(closest.date_time.slice(11,13),10) - h);
        return d1 < d2 ? i : closest;
      }, filtered[0])
    : null;

  const displayData = hourlyData || nowData;

  // Küçük ikon seçici (WeatherCard’dakiyle aynı mantık)
  const getIcon = condRaw => {
    const cond = (condRaw || '').toLowerCase();
    if (cond.includes('kar'))                return <FaSnowflake />;
    if (cond.includes('sağnak') || cond.includes('showers')) return <FaCloudShowersHeavy />;
    if (cond.includes('çisenti') || cond.includes('hafif yağmur')) return <FaCloudRain />;
    if (cond.includes('parçalı'))            return <FaCloudSun />;
    if (cond.includes('sis') || cond.includes('duman')) return <FaSmog />;
    if (cond.includes('bulutlu'))            return <FaCloud />;
    if (cond.includes('güneş') || cond.includes('açık')) return <FaSun />;
    return <FaCloudSunRain />;
  };

  return (
    <div
      className="city-panel detail-mode"
      onClick={onCardClick ? () => onCardClick(city) : undefined}
    >
      {/* ◀︎ Soldaki Gün Listesi */}
      {showDateButtons && (
        <aside className="sidebar-dates">
          <h4>Günler</h4>
          {availableDates.map(date => {
            const dayName = new Date(date)
              .toLocaleDateString('tr-TR', { weekday: 'long' });
            const label   = `${dayName.charAt(0).toUpperCase()+dayName.slice(1)} (${date})`;
            const daily   = weatherData.filter(i => i.date_time.startsWith(date));
            const avg     = daily.length
              ? (daily.reduce((s,i)=>s+i.temperature,0)/daily.length).toFixed(1)
              : '-';
            const isSel   = date === selectedDate;
            const cond    = daily[0]?.weather_condition;

            return (
              <div
                key={date}
                className={`day-item${isSel ? ' selected' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="icon">{getIcon(cond)}</span>
                <span className="label">{label}</span>
                <span className="temp">{avg}°C</span>
              </div>
            );
          })}
        </aside>
      )}

      {/* ▶︎ Sağdaki Ana İçerik */}
      <main className="main-content">
        {displayData && (
          <WeatherCard
            data={displayData}
            maxTemp={Math.max(...filtered.map(i => i.temperature))}
            minTemp={Math.min(...filtered.map(i => i.temperature))}
            avgTemp={(
              filtered.reduce((sum,i)=>sum+i.temperature,0)/filtered.length
            ).toFixed(1)}
            nowTemp={displayData.temperature}
          />
        )}

        {showChart && (
          <section style={{ marginTop: 20 }}>
            <h3 className="chart-title">
              {selectedDate} – Saatlik {METRICS.find(m=>m.key===selectedMetric).label} Trendi
            </h3>
            <DailyChart
              data={filtered}
              metric={selectedMetric}
              onPointClick={setHourlyData}
            />
            <div style={{
              display:'flex',
              justifyContent:'flex-end',
              gap:10, marginTop:12, flexWrap:'wrap'
            }}>
              {METRICS.map(m=>(
                <button
                  key={m.key}
                  type="button"
                  onClick={()=>setSelectedMetric(m.key)}
                  style={{
                    padding:'8px 12px',
                    borderRadius:6,
                    border: m.key===selectedMetric?'2px solid #0077ff':'2px solid #ccc',
                    background: m.key===selectedMetric?'#0077ff':'#fff',
                    color: m.key===selectedMetric?'#fff':'#333',
                    cursor:'pointer',
                    whiteSpace:'nowrap'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
