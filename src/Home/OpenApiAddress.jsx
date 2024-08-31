import { Select } from 'antd';
import React, { useState, useEffect } from 'react';

export default function OpenApiAddress({ onAddressChange }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);

  useEffect(() => {
    // Fetch list of cities
    fetch('http://localhost:8080/manager/public/customer/cities')
      .then(response => response.json())
      .then(data => setCities(data.cities.map(city => city['Tỉnh Thành Phố'])))
      .catch(error => console.error(error));
  }, []);

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setSelectedDistrict('');
    setSelectedCommune('');
    setDistricts([]);
    setCommunes([]);

    // Fetch districts based on selected city
    fetch(`http://localhost:8080/manager/public/customer/districts?name=${encodeURIComponent(value)}`)
      .then(response => response.json())
      .then(data => setDistricts(data.districts.map(district => district['Quận Huyện'])))
      .catch(error => console.error(error));
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedCommune('');
    setCommunes([]);

    // Fetch communes based on selected district
    fetch(`http://localhost:8080/manager/public/customer/communes?name=${encodeURIComponent(value)}`)
      .then(response => response.json())
      .then(data => setCommunes(data.communes.map(commune => commune['Phường Xã'])))
      .catch(error => console.error(error));
  };

  const handleCommuneChange = (value) => {
    setSelectedCommune(value);
    // Notify parent component about the selected address
    onAddressChange({
      city: selectedCity,
      district: selectedDistrict,
      commune: value
    });
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Select
        style={{ width: 200 }}
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={handleCityChange}
        value={selectedCity}
        placeholder="Chọn thành phố"
      >
        {cities.map(city => (
          <Select.Option key={city} value={city}>{city}</Select.Option>
        ))}
      </Select>
      <Select
        style={{ width: 200 }}
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={handleDistrictChange}
        value={selectedDistrict}
        placeholder="Chọn quận/huyện"
      >
        {districts.map(district => (
          <Select.Option key={district} value={district}>{district}</Select.Option>
        ))}
      </Select>
      <Select
        style={{ width: 200 }}
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={handleCommuneChange}
        value={selectedCommune}
        placeholder="Chọn phường/xã"
      >
        {communes.map(commune => (
          <Select.Option key={commune} value={commune}>{commune}</Select.Option>
        ))}
      </Select>
    </div>
  );
}
