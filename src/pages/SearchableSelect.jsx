import React, { useState } from "react";
import { Select, Spin } from "antd";
import axios from "axios";

const { Option } = Select;

const SearchableSelect = ({ placeholder, fetchUrl, onSelect }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOptions = async (searchText) => {
    if (!searchText) {
      setOptions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(fetchUrl);
      const filteredUsers = response.data
        .filter((user) => user.name.toLowerCase().includes(searchText.toLowerCase()))
        .map((user) => ({
          value: user.id, // Уникальный идентификатор
          label: user.name, // Отображаемое имя
        }));
      setOptions(filteredUsers);
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      showSearch
      placeholder={placeholder}
      filterOption={false} // Отключаем локальную фильтрацию
      onSearch={fetchOptions} // Запрос при вводе текста
      onChange={onSelect} // Обработка выбора
      notFoundContent={loading ? <Spin size="small" /> : "Ничего не найдено"}
      style={{ width: "100%" }}
    >
      {options.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </Select>
  );
};

export default SearchableSelect;