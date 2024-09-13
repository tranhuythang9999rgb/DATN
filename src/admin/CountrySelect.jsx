import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina',
  'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
  'Eritrea', 'Estonia', 'Eswatini (Swaziland)', 'Ethiopia', 'Fiji', 'Finland',
  'Liechtenstein', 'Lithuania'
];

// Component CountrySelect nhận prop 'onCountryChange' để trả giá trị quốc gia được chọn
const CountrySelect = ({ onCountryChange }) => {
  // Hàm xử lý khi chọn quốc gia
  const handleChange = (value) => {
    onCountryChange(value); // Trả giá trị quốc gia ra component cha
  };

  return (
    <div>
      <Select
        showSearch
        placeholder="Select a country"
        optionFilterProp="children"
        onChange={handleChange}  // Gọi handleChange khi người dùng chọn
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        style={{ width: 300, marginBottom: 20 }}
      >
        {countries.map((country, index) => (
          <Option key={index} value={country}>
            {country}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default CountrySelect;
