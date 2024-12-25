import React, { useState } from "react";
import { Button, Input, Checkbox, Space, message, Divider, Row, Col } from "antd";

const CreatePosition = () => {
  const [rows, setRows] = useState([]);

  // Функция для добавления строки
  const addRow = (type) => {
    const newRow = {
      id: rows.length + 1,
      type,
      checkbox: false,
      position: type === "position" ? "" : undefined,
      name: type === "position" ? "" : undefined,
      expenseType: type === "delivery" ? "Доставка" : type === "bonus" ? "Бонус" : undefined,
      address: type === "delivery" ? "" : undefined,
      client: type === "bonus" ? "" : undefined,
      amount: "",
    };
    setRows([...rows, newRow]);
  };

  // Обработчик изменения чек-бокса
  const handleCheckboxChange = (id, checked) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, checkbox: checked } : row))
    );
  };

  // Обработчик изменения значения поля
  const handleFieldChange = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Удаление отмеченных строк
  const deleteSelectedRows = () => {
    const updatedRows = rows.filter((row) => !row.checkbox);
    if (updatedRows.length === rows.length) {
      message.warning("Выберите хотя бы одну строку для удаления");
      return;
    }
    setRows(updatedRows);
    message.success("Выбранные строки успешно удалены");
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <Button type="primary" onClick={() => addRow("position")}>
          Добавить позицию
        </Button>
        <Button type="default" onClick={() => addRow("delivery")}>
          Добавить доставку
        </Button>
        <Button type="dashed" onClick={() => addRow("bonus")}>
          Добавить бонус
        </Button>
        <Button type="danger" onClick={deleteSelectedRows}>
          Удалить отмеченные
        </Button>
      </div>

      <div>
        {rows.map((row, index) => (
          <div
            key={row.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
              padding: 8,
              border: "1px solid #f0f0f0",
              borderRadius: 4,
            }}
          >
            <Checkbox
              checked={row.checkbox}
              onChange={(e) => handleCheckboxChange(row.id, e.target.checked)}
            />
            <span>{index + 1}</span>
            {row.type === "position" && (
              <>
                <Input
                  placeholder="Позиция"
                  value={row.position}
                  onChange={(e) => handleFieldChange(row.id, "position", e.target.value)}
                  style={{ width: 150 }}
                />
                <Input
                  placeholder="Название"
                  value={row.name}
                  onChange={(e) => handleFieldChange(row.id, "name", e.target.value)}
                  style={{ width: 200 }}
                />
                <Input
                  placeholder="Сумма продажи"
                  value={row.amount}
                  onChange={(e) => handleFieldChange(row.id, "amount", e.target.value)}
                  style={{ width: 120 }}
                />
              </>
            )}
            {row.type === "delivery" && (
              <>
                <span>{row.expenseType}</span>
                <Input
                  placeholder="Адрес"
                  value={row.address}
                  onChange={(e) => handleFieldChange(row.id, "address", e.target.value)}
                  style={{ width: 200 }}
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(row.address);
                    message.success("Адрес скопирован");
                  }}
                >
                  Копировать
                </Button>
                <Input
                  placeholder="Сумма доставки"
                  value={row.amount}
                  onChange={(e) => handleFieldChange(row.id, "amount", e.target.value)}
                  style={{ width: 120 }}
                />
              </>
            )}
            {row.type === "bonus" && (
              <>
                <span>{row.expenseType}</span>
                <Input
                  placeholder="Клиент"
                  value={row.client}
                  onChange={(e) => handleFieldChange(row.id, "client", e.target.value)}
                  style={{ width: 200 }}
                />
                <Input
                  placeholder="Сумма бонуса"
                  value={row.amount}
                  onChange={(e) => handleFieldChange(row.id, "amount", e.target.value)}
                  style={{ width: 120 }}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePosition;