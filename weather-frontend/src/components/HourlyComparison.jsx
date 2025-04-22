// src/components/HourlyComparison.jsx
import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CITY_CONFIGS = [
  { key: "Istanbul", label: "İstanbul", color: "#1E90FF" },
  { key: "Ankara",   label: "Ankara",   color: "#28A745" },
  { key: "Izmir",    label: "İzmir",    color: "#8A2BE2" }
];

const METRIC_DETAILS = {
  temperature: { label: "Sıcaklık", unit: "°C" },
  humidity:    { label: "Nem",      unit: "%"  },
  wind_speed:  { label: "Rüzgar",   unit: " km/h" }
};

export default function HourlyComparison({ selectedDate, metric }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    Promise.all(CITY_CONFIGS.map(c => fetchWeatherData(c.key)))
      .then(results => {
        // Saatleri topla (ilk şehrin saatleri üzerinden)
        const hours = Array.from(
          new Set(
            results[0]
              .filter(d => d.date_time.startsWith(selectedDate))
              .map(d => d.date_time.slice(11,16))
          )
        ).sort();

        // Her saate karşılık şehir değerlerini ekle
        const chartData = hours.map(h => {
          const row = { time: h };
          CITY_CONFIGS.forEach((c, idx) => {
            const match = results[idx].find(d => d.date_time.slice(11,16) === h);
            row[c.label] = match ? match[metric] : null;
          });
          return row;
        });

        setData(chartData);
      });
  }, [selectedDate, metric]);

  const { label, unit } = METRIC_DETAILS[metric] || METRIC_DETAILS.temperature;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.9)',
      borderRadius: 20,
      boxShadow: '0 12px 25px rgba(0,0,0,0.1)',
      padding: 30,
      width: '90%',
      maxWidth: 900,
      margin: '0 auto 40px'
    }}>
      <h3 style={{ textAlign:'center', marginBottom:16 }}>
        {selectedDate} – Saatlik {label} Trendi
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top:20, right:20, left:20, bottom:20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis unit={unit.trim()} />
          <Tooltip formatter={val => `${val}${unit}`} />
          <Legend verticalAlign="top" />
          {CITY_CONFIGS.map(c => (
            <Line
              key={c.key}
              type="monotone"
              dataKey={c.label}
              stroke={c.color}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
