import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from '../services/api';
import {
  FaSun, FaCloud, FaCloudRain, FaCloudShowersHeavy,
  FaCloudSun, FaCloudSunRain, FaSnowflake, FaSmog
} from 'react-icons/fa';

export default function DaySidebar({ dates, selectedDate, onSelect, city }) {
  const [dailyInfo, setDailyInfo] = useState({});

  useEffect(() => {
    if (!dates.length) return;
    fetchWeatherData(city).then(data => {
      const info = {};
      dates.forEach(date => {
        const dayItems = data.filter(i => i.date_time.startsWith(date));
        if (dayItems.length) {
          const avg = (dayItems.reduce((s,i)=>s+i.temperature,0) / dayItems.length).toFixed(1);
          info[date] = {
            avg,
            condition: dayItems[0].weather_condition
          };
        } else {
          info[date] = { avg: '--', condition: '' };
        }
      });
      setDailyInfo(info);
    });
  }, [dates, city]);

  const getIcon = condRaw => {
    const cond = (condRaw || '').toLowerCase();
    if (cond.includes('kar')) return <FaSnowflake />;
    if (cond.includes('sağnak') || cond.includes('showers')) return <FaCloudShowersHeavy />;
    if (cond.includes('çisenti')||cond.includes('hafif yağmur')) return <FaCloudRain />;
    if (cond.includes('parçalı')) return <FaCloudSun />;
    if (cond.includes('bulutlu')) return <FaCloud />;
    if (cond.includes('güneş')||cond.includes('açık')) return <FaSun />;
    return <FaCloudSunRain />;
  };

  return (
    <div className="day-list">
      <h4>15 Günlük Hava</h4>
      {dates.map(date => {
        const dayName = new Date(date)
          .toLocaleDateString('tr-TR',{weekday:'long'})
          .replace(/^./,s=>s.toUpperCase());
        const { avg, condition } = dailyInfo[date] || { avg:'--', condition:'' };
        return (
          <div
            key={date}
            className={`day-item${date===selectedDate?' selected':''}`}
            onClick={()=>onSelect(date)}
          >
            <span className="icon">{getIcon(condition)}</span>
            <span className="label">{`${dayName} (${date})`}</span>
            <span className="temp">{avg}°C</span>
          </div>
        );
      })}
    </div>
  );
}
