import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function ComparisonChart({ selectedDate }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchWeatherData("Istanbul"),
      fetchWeatherData("Ankara"),
      fetchWeatherData("Izmir")
    ]).then(([istanbul, ankara, izmir]) => {
      const cities = [
        { name: "İstanbul", list: istanbul },
        { name: "Ankara", list: ankara },
        { name: "İzmir", list: izmir }
      ];

      const result = cities.map(({ name, list }) => {
        const daily = list.filter(d => d.date_time.startsWith(selectedDate));
        const avg = daily.reduce((sum, d) => sum + d.temperature, 0) / (daily.length || 1);
        return { city: name, avgTemp: parseFloat(avg.toFixed(1)) };
      });

      setData(result);
    });
  }, [selectedDate]);

  return (
    <div style={{ width: '100%', height: 300, marginTop: '40px' }}>
      <h3 className="chart-title">{selectedDate} - Şehirler Arası Ortalama Sıcaklık Karşılaştırması</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="city" />
          <YAxis unit="°C" />
          <Tooltip />
          <Legend />
          <Bar dataKey="avgTemp" fill="#4a90e2" name="Ortalama Sıcaklık" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
