// src/components/ComparisonChart.jsx
import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function ComparisonChart({ selectedDate, mode, title }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchWeatherData("Istanbul"),
      fetchWeatherData("Ankara"),
      fetchWeatherData("Izmir")
    ]).then(([ist, ank, izm]) => {
      const cities = [
        { name: "İstanbul", list: ist },
        { name: "Ankara",   list: ank },
        { name: "İzmir",    list: izm }
      ];

      const result = cities.map(({ name, list }) => {
        const daily = list.filter(d => d.date_time.startsWith(selectedDate));
        if (daily.length === 0) return { city: name, value: 0 };

        let value;
        if (mode === "max") {
          value = daily.reduce((mx, d) =>
            d.temperature > mx ? d.temperature : mx,
            daily[0].temperature
          );
        } else {
          value = daily.reduce((mn, d) =>
            d.temperature < mn ? d.temperature : mn,
            daily[0].temperature
          );
        }
        return { city: name, value: parseFloat(value.toFixed(1)) };
      });

      setData(result);
    });
  }, [selectedDate, mode]);

  return (
    <div style={{
      flex: 1,
      minWidth: '300px',
      height: '350px',            /* Sabit yükseklik */
      padding: '20px',
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>
        {title}
      </h3>
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 40, bottom: 0 }}
          >
            <XAxis
              type="number"
              unit="°C"
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="city"
              orientation="left"
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip formatter={val => `${val}°C`} />
            <Bar dataKey="value" barSize={20} fill="#4a90e2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
