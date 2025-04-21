import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function CitySelector({ selectedCity, onCityChange }) {
  return (
    <div className="city-selector">
      <label htmlFor="city" className="city-label">
        <FaMapMarkerAlt style={{ marginRight: '8px' }} />
        Şehir Seçin:
      </label>
      <select
        id="city"
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="city-dropdown"
      >
        <option value="Istanbul">İstanbul</option>
        <option value="Ankara">Ankara</option>
        <option value="Izmir">İzmir</option>
      </select>
    </div>
  );
}
