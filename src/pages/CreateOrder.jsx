import React, { useState } from "react";
import { Form, Input, Button, Select, Card, Space, Typography, Divider } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const CreateOrder = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [managerBonus, setManagerBonus] = useState(0);

  // Функция для добавления новой позиции
  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      {
        id: Date.now(),
        position: "",
        supplier: "",
        quantity: 1,
        purchasePrice: 0,
        sellingPrice: 0,
        totalPurchase: 0,
        totalSelling: 0,
      },
    ]);
  };

  // Функция для удаления позиции
  const removeOrderItem = (id) => {
    const updatedItems = orderItems.filter((item) => item.id !== id);
    setOrderItems(updatedItems);
    recalculateTotals(updatedItems);
  };

  // Функция для обновления позиции
  const updateOrderItem = (id, field, value) => {
    const updatedItems = orderItems.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        if (field === "quantity" || field === "purchasePrice" || field === "sellingPrice") {
          const quantity = parseFloat(updatedItem.quantity) || 0;
          const purchasePrice = parseFloat(updatedItem.purchasePrice) || 0;
          const sellingPrice = parseFloat(updatedItem.sellingPrice) || 0;

          updatedItem.totalPurchase = quantity * purchasePrice;
          updatedItem.totalSelling = quantity * sellingPrice;
        }

        return updatedItem;
      }
      return item;
    });

    setOrderItems(updatedItems);
    recalculateTotals(updatedItems);
  };

  // Пересчет итоговых значений
  const recalculateTotals = (items) => {
    const totalSelling = items.reduce((sum, item) => sum + item.totalSelling, 0);
    const totalPurchase = items.reduce((sum, item) => sum + item.totalPurchase, 0);
    const bonus = (totalSelling - totalPurchase) * 0.2;

    setTotalAmount(totalSelling);
    setTotalPurchase(totalPurchase);
    setManagerBonus(bonus);
  };

  const handleSubmit = () => {
    console.log("Заказ отправлен:", { totalAmount, totalPurchase, managerBonus, orderItems });
    alert("Заказ успешно создан!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Создать заказ</Title>
      <Card style={{ marginBottom: "16px" }}>
        <Space direction="horizontal" style={{ justifyContent: "space-between", width: "100%" }}>
          <Text>
            Сумма заказа: <Text strong style={{ color: "green" }}>{totalAmount.toFixed(2)} ₽</Text>
          </Text>
          <Text>
            Итоговая закупка: <Text strong>{totalPurchase.toFixed(2)} ₽</Text>
          </Text>
          <Text>
            Премия менеджера: <Text strong>{managerBonus.toFixed(2)} ₽</Text>
          </Text>
        </Space>
        <Divider />
        <Form layout="inline">
          <Form.Item label="Клиент">
            <Select
              showSearch
              placeholder="Выберите клиента"
              optionFilterProp="children"
              style={{ width: 200 }}
            >
              <Option value="client1">Клиент 1</Option>
              <Option value="client2">Клиент 2</Option>
              <Option value="client3">Клиент 3</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Статус заказа">
            <Select defaultValue="новый" style={{ width: 150 }}>
              <Option value="новый">Новый</Option>
              <Option value="в работе">В работе</Option>
              <Option value="готов">Готов</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Статус оплаты">
            <Select defaultValue="Нет оплаты" style={{ width: 150 }}>
              <Option value="Нет оплаты">Нет оплаты</Option>
              <Option value="Оплачено">Оплачено</Option>
              <Option value="Частично оплачено">Частично оплачено</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Позиции заказа" style={{ marginBottom: "16px" }}>
        {/* Заголовок таблицы */}
        <div style={{ display: "flex", marginBottom: "8px", fontWeight: "bold" }}>
          <Text style={{ width: "30px" }}>№</Text>
          <Text style={{ width: "150px" }}>Позиция</Text>
          <Text style={{ width: "200px" }}>Поставщик</Text>
          <Text style={{ width: "100px" }}>Кол-во</Text>
          <Text style={{ width: "150px" }}>Закупочная цена</Text>
          <Text style={{ width: "150px" }}>Продажная цена</Text>
          <Text style={{ width: "150px" }}>Итого закупка</Text>
          <Text style={{ width: "150px" }}>Итого продажа</Text>
        </div>
        {orderItems.map((item, index) => (
          <Space key={item.id} style={{ display: "flex", marginBottom: "8px" }} align="baseline">
            <Text style={{ width: "30px" }}>{index + 1}</Text>
            <Select
              showSearch
              value={item.position}
              onChange={(value) => updateOrderItem(item.id, "position", value)}
              style={{ width: "150px" }}
              placeholder="Выберите позицию"
            >
              <Option value="Бирки">Бирки</Option>
              <Option value="Этикетки">Этикетки</Option>
              <Option value="Наклейки">Наклейки</Option>
            </Select>
            <Select
              showSearch
              value={item.supplier}
              onChange={(value) => updateOrderItem(item.id, "supplier", value)}
              style={{ width: "200px" }}
              placeholder="Выберите поставщика"
            >
              <Option value="ПроПринт">ПроПринт</Option>
              <Option value="Шалохин">Шалохин</Option>
              <Option value="2 клена">2 клена</Option>
            </Select>
            <Input
              type="number"
              placeholder="Кол-во"
              value={item.quantity}
              onChange={(e) => updateOrderItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
              style={{ width: "100px" }}
            />
            <Input
              type="number"
              placeholder="Закупочная цена"
              value={item.purchasePrice}
              onChange={(e) => updateOrderItem(item.id, "purchasePrice", parseFloat(e.target.value) || 0)}
              style={{ width: "150px" }}
            />
            <Input
              type="number"
              placeholder="Продажная цена"
              value={item.sellingPrice}
              onChange={(e) => updateOrderItem(item.id, "sellingPrice", parseFloat(e.target.value) || 0)}
              style={{ width: "150px" }}
            />
            <Input
              type="number"
              placeholder="Итого закупка"
              value={item.totalPurchase}
              disabled
              style={{ width: "150px" }}
            />
            <Input
              type="number"
              placeholder="Итого продажа"
              value={item.totalSelling}
              disabled
              style={{ width: "150px" }}
            />
            <Button type="link" onClick={() => removeOrderItem(item.id)} danger>
              Удалить
            </Button>
          </Space>
        ))}
        <Button type="dashed" onClick={addOrderItem} block>
          Добавить позицию
        </Button>
      </Card>

      <Card>
        <Text strong>ИТОГО: {totalAmount.toFixed(2)} ₽</Text>
      </Card>

      <Button type="primary" onClick={handleSubmit} style={{ marginTop: "16px" }}>
        Сохранить заказ
      </Button>
    </div>
  );
};

export default CreateOrder;