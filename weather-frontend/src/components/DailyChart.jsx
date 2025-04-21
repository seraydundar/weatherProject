// src/components/DailyChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const CONFIG = {
  temperature: { name: 'Sıcaklık', unit: '°C', stroke: '#ff6f61' },
  humidity:    { name: 'Nem',      unit: '%',  stroke: '#4a90e2' },
  wind_speed:  { name: 'Rüzgar Hızı', unit: ' km/h', stroke: '#50e3c2' }
};

export default function DailyChart({ data, metric }) {
  const { name, unit, stroke } = CONFIG[metric] || CONFIG.temperature;

  return (
    <div className="chart-container" style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top:10, right:30, left:0, bottom:0 }}>
          <XAxis
            dataKey="date_time"
            tickFormatter={(val) => val.slice(11,16)}
          />
          <YAxis unit={unit.trim()} />
          <Tooltip formatter={(val) => `${val}${unit}`} />
          <CartesianGrid strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey={metric}
            stroke={stroke}
            name={`${name} (${unit.trim()})`}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
