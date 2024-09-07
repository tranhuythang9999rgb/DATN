import React, { useState } from 'react';
import { Checkbox } from 'antd';
import './index_login.css';
const CountryFilter = ({ onFilterChange }) => {
  const countries = [
    "United States",
    "United Kingdom",
    "France",
    "Germany",
    "Japan",
    "China",
    "Australia",
    "Canada",
    "Italy",
    "Spain"
  ];

  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountryChange = (country) => {
    const newSelection = selectedCountry === country ? null : country;
    setSelectedCountry(newSelection);
    onFilterChange(newSelection);
  };

  return (
    <div className="country-filter">
      {countries.map((country) => (
        <div key={country} className="country-checkbox">
          <Checkbox
            checked={selectedCountry === country}
            onChange={() => handleCountryChange(country)}
          >
            {country}
          </Checkbox>
        </div>
      ))}
    </div>
  );
};

export default CountryFilter;
