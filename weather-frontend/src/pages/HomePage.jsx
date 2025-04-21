// src/pages/HomePage.jsx
import React, { useState } from 'react';
import CityWeatherPanel from '../components/CityWeatherPanel';
import ComparisonChart from '../components/ComparisonChart';

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState('2025-04-21'); // varsayılan örnek tarih
  const [availableDates, setAvailableDates] = useState([]); // tüm şehirlerden gelen tarihlerle doldurulacak

  return (
    <div className="homepage-container">
      <div className="dashboard-grid">
        <CityWeatherPanel
          city="Istanbul"
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availableDates={availableDates}
          setAvailableDates={setAvailableDates}
        />
        <CityWeatherPanel
          city="Ankara"
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availableDates={availableDates}
          setAvailableDates={setAvailableDates}
        />
        <CityWeatherPanel
          city="Izmir"
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          availableDates={availableDates}
          setAvailableDates={setAvailableDates}
        />
      </div>

      {/* 📊 Alt kısım: karşılaştırmalı grafik + gün seçimi */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <label htmlFor="date-select"><strong>Karşılaştırmak için gün seçin:</strong></label>
        <select
          id="date-select"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '8px', marginLeft: '10px', borderRadius: '8px' }}
        >
          {availableDates.map(date => {
            const day = new Date(date).toLocaleDateString('tr-TR', { weekday: 'long' });
            return (
              <option key={date} value={date}>
                {date} - {day.charAt(0).toUpperCase() + day.slice(1)}
              </option>
            );
          })}
        </select>
      </div>

      <ComparisonChart selectedDate={selectedDate} />
    </div>
  );
}
