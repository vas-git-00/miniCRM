import React, { useState } from "react";
import { Tabs, Form, Input, Button, Select, Card, Space, Typography, Popconfirm } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons"

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

const CreateOrder = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [incomingPayments, setIncomingPayments] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [orderStatus, setOrderStatus] = useState("Новый");
  const [manager, setManager] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  const calculateOrderTotal = () => {
    return orderItems.reduce((total, item) => total + (item.sellingPrice || 0), 0);
  };

  const calculateOrderDebt = () => {
    const total = calculateOrderTotal();
    const payments = incomingPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    return total - payments;
  };

  const addOrderItem = () => {
    const newItem = {
      id: Date.now(),
      position: "",
      supplier: "",
      quantity: 1,
      purchasePrice: 0,
      sellingPrice: 0,
    };
    setOrderItems([...orderItems, newItem]);
    recalculateSuppliers([...orderItems, newItem]);
  };

  const recalculateSuppliers = (items) => {
    const uniqueSuppliers = Array.from(new Set(items.map((item) => item.supplier).filter(Boolean)));
    setSuppliers(uniqueSuppliers);
  };

  const deleteOrderItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const tabs = [
    {
      key: "1",
      label: "Состав заказа",
      children: (
        <Card title="Позиции заказа" style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", marginBottom: "8px", fontWeight: "bold" }}>
            <Text style={{ width: "30px" }}>№</Text>
            <Text style={{ width: "150px" }}>Позиция</Text>
            <Text style={{ width: "200px" }}>Примечание</Text>
            <Text style={{ width: "200px" }}>Поставщик</Text>
            <Text style={{ width: "100px" }}>Кол-во</Text>
            <Text style={{ width: "150px" }}>Закупочная цена</Text>
            <Text style={{ width: "150px" }}>Продажная цена</Text>
            <Text style={{ width: "50px" }}>Удалить</Text>
          </div>
          {orderItems.map((item, index) => (
            <Space key={item.id} style={{ display: "flex", marginBottom: "8px" }} align="baseline">
              <Text style={{ width: "30px" }}>{index + 1}</Text>
              <Select
                showSearch
                value={item.position}
                onChange={(value) =>
                  setOrderItems(
                    orderItems.map((o) => (o.id === item.id ? { ...o, position: value } : o))
                  )
                }
                style={{ width: "150px" }}
                placeholder="Выберите позицию"
              >
                <Option value="Бирки">Бирки</Option>
                <Option value="Этикетки">Этикетки</Option>
                <Option value="Наклейки">Наклейки</Option>
              </Select>
              <Input
                placeholder="Примечание"
                value={item.note}
                onChange={(e) =>
                  setOrderItems(
                    orderItems.map((o) =>
                      o.id === item.id ? { ...o, note: e.target.value } : o
                    )
                  )
                }
                style={{ width: "200px" }}
              />
              <Select
                showSearch
                value={item.supplier}
                onChange={(value) =>
                  setOrderItems(
                    orderItems.map((o) => (o.id === item.id ? { ...o, supplier: value } : o))
                  )
                }
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
                onChange={(e) =>
                  setOrderItems(
                    orderItems.map((o) =>
                      o.id === item.id ? { ...o, quantity: parseFloat(e.target.value) } : o
                    )
                  )
                }
                style={{ width: "100px" }}
              />
              <Input
                type="number"
                placeholder="Закупочная цена"
                value={item.purchasePrice}
                onChange={(e) =>
                  setOrderItems(
                    orderItems.map((o) =>
                      o.id === item.id ? { ...o, purchasePrice: parseFloat(e.target.value) } : o
                    )
                  )
                }
                style={{ width: "150px" }}
              />
              <Input
                type="number"
                placeholder="Продажная цена"
                value={item.sellingPrice}
                onChange={(e) =>
                  setOrderItems(
                    orderItems.map((o) =>
                      o.id === item.id ? { ...o, sellingPrice: parseFloat(e.target.value) } : o
                    )
                  )
                }
                style={{ width: "150px" }}
              />
              <Popconfirm
                title="Удалить эту позицию?"
                onConfirm={() => deleteOrderItem(item.id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button danger>Удалить</Button>
              </Popconfirm>
            </Space>
          ))}
          <Button type="dashed" onClick={addOrderItem} block>
            Добавить позицию
          </Button>
        </Card>
      ),
    },
    {
      key: "2",
      label: "Платежи",
      children: <div>Платежи</div>,
    },
    {
      key: "3",
      label: "Инфо по клиенту",
      children: <div>Инфо по клиенту</div>,
    },
  ];

  return (
    <div >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Новый заказ</h1>
      </div>

      {/* Информация по заказу */}
      <Card style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {/* Первая строка */}
          <div>
            <Text strong>Сумма заказа:</Text>
            <Text style={{ color: "green", marginLeft: "8px" }}>
              {calculateOrderTotal().toFixed(2)} ₽
            </Text>
          </div>
          <div>
            <Text strong>Долг:</Text>
            <Text style={{ color: "red", marginLeft: "8px" }}>
              {calculateOrderDebt().toFixed(2)} ₽
            </Text>
          </div>
          <div>
            <Text strong>Статус оплаты:</Text>
            <Text style={{ marginLeft: "8px" }}>
              {calculateOrderDebt() > 0 ? "Не оплачено" : "Оплачено"}
            </Text>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
          {/* Вторая строка */}
          <div>
            <Form.Item label="Клиент" style={{ margin: 0 }}>
              <Select
                showSearch
                value={selectedClient}
                onChange={(value) => setSelectedClient(value)}
                style={{ width: "200px" }}
                placeholder="Выберите клиента"
              >
                <Option value="ООО Ромашка">ООО Ромашка</Option>
                <Option value="ИП Иванов">ИП Иванов</Option>
                <Option value="ООО Тюльпан">ООО Тюльпан</Option>
              </Select>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Статус заказа" style={{ margin: 0 }}>
              <Select
                value={orderStatus}
                onChange={(value) => setOrderStatus(value)}
                style={{ width: "200px" }}
              >
                <Option value="Новый">Новый</Option>
                <Option value="В работе">В работе</Option>
                <Option value="Готов">Готов</Option>
              </Select>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Менеджер" style={{ margin: 0 }}>
              <Select
                value={manager}
                onChange={(value) => setManager(value)}
                style={{ width: "200px" }}
                placeholder="Выберите менеджера"
              >
                <Option value="Иванов Иван">Иванов Иван</Option>
                <Option value="Петров Петр">Петров Петр</Option>
                <Option value="Сидоров Сидор">Сидоров Сидор</Option>
              </Select>
            </Form.Item>
          </div>
        </div>
      </Card>

      {/* Вкладки */}
      <Tabs defaultActiveKey="1">
        {/* Вкладка "Состав заказа" */}
        <TabPane tab="Состав заказа" key="1">
        <Card title="Позиции заказа" style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", marginBottom: "8px", fontWeight: "bold" }}>
              <Text style={{ width: "30px" }}>№</Text>
              <Text style={{ width: "150px" }}>Позиция</Text>
              <Text style={{ width: "200px" }}>Поставщик</Text>
              <Text style={{ width: "100px" }}>Кол-во</Text>
              <Text style={{ width: "150px" }}>Закупочная цена</Text>
              <Text style={{ width: "150px" }}>Продажная цена</Text>
            </div>
            {orderItems.map((item, index) => (
              <Space key={item.id} style={{ display: "flex", marginBottom: "8px" }} align="baseline">
                <Text style={{ width: "30px" }}>{index + 1}</Text>
                <Select
                  showSearch
                  value={item.position}
                  onChange={(value) =>
                    setOrderItems(
                      orderItems.map((o) => (o.id === item.id ? { ...o, position: value } : o))
                    )
                  }
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
                  onChange={(value) => {
                    setOrderItems(
                      orderItems.map((o) => (o.id === item.id ? { ...o, supplier: value } : o))
                    );
                    recalculateSuppliers(orderItems);
                  }}
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
                  onChange={(e) =>
                    setOrderItems(
                      orderItems.map((o) =>
                        o.id === item.id ? { ...o, quantity: parseFloat(e.target.value) } : o
                      )
                    )
                  }
                  style={{ width: "100px" }}
                />
                <Input
                  type="number"
                  placeholder="Закупочная цена"
                  value={item.purchasePrice}
                  onChange={(e) =>
                    setOrderItems(
                      orderItems.map((o) =>
                        o.id === item.id ? { ...o, purchasePrice: parseFloat(e.target.value) } : o
                      )
                    )
                  }
                  style={{ width: "150px" }}
                />
                <Input
                  type="number"
                  placeholder="Продажная цена"
                  value={item.sellingPrice}
                  onChange={(e) =>
                    setOrderItems(
                      orderItems.map((o) =>
                        o.id === item.id ? { ...o, sellingPrice: parseFloat(e.target.value) } : o
                      )
                    )
                  }
                  style={{ width: "150px" }}
                />
                <Popconfirm
                  title="Удалить эту позицию?"
                  onConfirm={() => deleteOrderItem(item.id)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <MinusCircleOutlined
                  style={{ color: "red", fontSize: "16px", cursor: "pointer" }}
                />
                </Popconfirm>
              </Space>
            ))}
            <Button type="dashed" onClick={addOrderItem} block>
              Добавить позицию
            </Button>
          </Card>
        </TabPane>

        {/* Остальные вкладки */}
        <TabPane tab="Платежи" key="2">
          <Card title="Платежи">
            {/* Входящие и исходящие платежи */}
          </Card>
        </TabPane>
        <TabPane tab="Инфо по клиенту" key="3">
          <Card>
            <Text>Клиент: {selectedClient}</Text>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CreateOrder;