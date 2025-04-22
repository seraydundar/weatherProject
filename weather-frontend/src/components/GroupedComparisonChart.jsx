// src/components/GroupedComparisonChart.jsx
import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CITY_CONFIGS = [
  { key: "Istanbul", label: "İstanbul", color: "#1E90FF" }, // DodgerBlue
  { key: "Ankara",   label: "Ankara",   color: "#28A745" }, // Green
  { key: "Izmir",    label: "İzmir",    color: "#8A2BE2" }  // BlueViolet
];

export default function GroupedComparisonChart({ selectedDate }) {
  const [data, setData] = useState([]);
  const [hoveredCity, setHoveredCity] = useState(null);

  // Sadece hover edilen bar'ın bilgisini gösteren tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && hoveredCity) {
      const entry = payload.find(item => item.name === hoveredCity);
      if (entry) {
        return (
          <div style={{
            background: '#fff',
            padding: '6px 10px',
            border: '1px solid #ccc',
            borderRadius: 4,
            fontSize: '0.9rem'
          }}>
            <strong>{entry.name}: </strong>{entry.value}°C
          </div>
        );
      }
    }
    return null;
  };

  // Veri çekme ve chartData hazırlama
  useEffect(() => {
    Promise.all(CITY_CONFIGS.map(c => fetchWeatherData(c.key)))
      .then(results => {
        const metrics = [
          { key: "max", label: "En Yüksek" },
          { key: "min", label: "En Düşük" }
        ];
        const chartData = metrics.map(({ key, label }) => {
          const row = { metric: label };
          CITY_CONFIGS.forEach((c, idx) => {
            const daily = results[idx].filter(d =>
              d.date_time.startsWith(selectedDate)
            );
            row[c.label] = daily.length
              ? (key === "max"
                  ? Math.max(...daily.map(d => d.temperature))
                  : Math.min(...daily.map(d => d.temperature))
                )
              : 0;
          });
          return row;
        });
        setData(chartData);
      });
  }, [selectedDate]);

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
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            unit="°C"
            domain={[0, 'dataMax + 5']}
            tickCount={7}
          />
          <YAxis
            type="category"
            dataKey="metric"
            width={80}
            tick={{ fill: '#333', fontSize: 14 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            shared={false}
            cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
          />
          <Legend verticalAlign="top" />
          {CITY_CONFIGS.map(c => (
            <Bar
              key={c.key}
              dataKey={c.label}
              fill={c.color}
              barSize={20}
              onMouseEnter={() => setHoveredCity(c.label)}
              onMouseLeave={() => setHoveredCity(null)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
