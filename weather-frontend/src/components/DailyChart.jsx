import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function DailyChart({ data }) {
    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
          <XAxis dataKey="date_time" tickFormatter={(val) => val.slice(11, 16)} />

            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="temperature" stroke="#ff6f61" name="Sıcaklık (°C)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
