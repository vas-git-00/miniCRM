import React, { useEffect, useState } from "react"
import {
  Tabs,
  Form,
  Input,
  Button,
  Select,
  Card,
  Space,
  Typography,
  Popconfirm,
  Spin,
} from "antd"
import { MinusCircleOutlined, CheckCircleTwoTone } from "@ant-design/icons"

const { Option } = Select
const { Text } = Typography

const CreateOrder = () => {
  const [orderItems, setOrderItems] = useState([])
  const [incomingPayments, setIncomingPayments] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [orderStatus, setOrderStatus] = useState("Новый")
  const [manager, setManager] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [orderNumber, setOrderNumber] = useState("24-2322 от 22.12.2024")
  const [loading, setLoading] = useState(false) // Состояние загрузки
  const [saved, setSaved] = useState(false) // Состояние сохранения

  const saveOrderData = async () => {
    try {
      setLoading(true) // Показать Spin
      setSaved(false) // Скрыть статус "Сохранено"
      const orderData = {
        orderNumber,
        orderStatus,
        selectedClient,
        manager,
        orderItems,
      }

      // Имитируем запрос на сохранение
      //await axios.post("/api/orders", orderData);
      console.log(orderData)

      setLoading(false) // Скрыть Spin
      setSaved(true) // Показать статус "Сохранено"
      setTimeout(() => setSaved(false), 2000) // Убрать "Сохранено" через 2 сек.
    } catch (error) {
      setLoading(false) // Скрыть Spin
      console.error("Ошибка при сохранении:", error)
    }
  }

  // Сохранение при изменении данных
  useEffect(() => {
    saveOrderData()
  }, [orderItems, selectedClient, orderStatus, manager])

  const calculateOrderTotal = () => {
    return orderItems.reduce(
      (total, item) => total + (item.sellingPrice || 0),
      0
    )
  }

  const calculateOrderDebt = () => {
    const total = calculateOrderTotal()
    const payments = incomingPayments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    )
    return total - payments
  }

  const addOrderItem = () => {
    const newItem = {
      id: Date.now(),
      position: null,
      supplier: null,
      quantity: null,
      purchasePrice: null,
      sellingPrice: null,
    }
    setOrderItems([...orderItems, newItem])
    recalculateSuppliers([...orderItems, newItem])
  }

  const recalculateSuppliers = (items) => {
    const uniqueSuppliers = Array.from(
      new Set(items.map((item) => item.supplier).filter(Boolean))
    )
    setSuppliers(uniqueSuppliers)
  }

  const deleteOrderItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const tabs = [
    {
      key: "1",
      label: "Состав заказа",
      children: (
        <Card title="Позиции заказа" style={{ marginBottom: "16px" }}>
          {orderItems.map((item, index) => (
            <Space
              key={item.id}
              style={{ display: "flex", marginBottom: "8px" }}
              align="baseline"
            >
              <Text style={{ width: "40px" }}>{index + 1}</Text>
              <Select
                showSearch
                value={item.position}
                onChange={(value) =>
                  setOrderItems(
                    orderItems.map((o) =>
                      o.id === item.id ? { ...o, position: value } : o
                    )
                  )
                }
                style={{ width: "200px" }}
                placeholder="Позиция"
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
                    orderItems.map((o) =>
                      o.id === item.id ? { ...o, supplier: value } : o
                    )
                  )
                }
                style={{ width: "250px" }}
                placeholder="Поставщик"
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
                      o.id === item.id
                        ? { ...o, quantity: parseFloat(e.target.value) }
                        : o
                    )
                  )
                }
                style={{ width: "100px" }}
              />

              <Input
                type="number"
                placeholder="Закупка, руб."
                value={item.purchasePrice}
                onChange={(e) =>
                  setOrderItems(
                    orderItems.map((o) =>
                      o.id === item.id
                        ? { ...o, purchasePrice: parseFloat(e.target.value) }
                        : o
                    )
                  )
                }
                style={{
                  width: "140px",
                  appearance: "none",
                  MozAppearance: "textfield",
                }}
              />
              <Input
                type="number"
                placeholder="Продажа, руб."
                value={item.sellingPrice}
                onChange={(e) =>
                  setOrderItems(
                    orderItems.map((o) =>
                      o.id === item.id
                        ? { ...o, sellingPrice: parseFloat(e.target.value) }
                        : o
                    )
                  )
                }
                style={{
                  width: "140px",
                  appearance: "none",
                  MozAppearance: "textfield",
                }}
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
          <Button
            type="dashed"
            onClick={addOrderItem}
            style={{ marginTop: "8px" }}
            block
          >
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
  ]

  return (
    <div>
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
          <div style={{ width: "220px" }}>
            <Text strong>Сумма заказа:</Text>
            <Text
              style={{ color: "green", fontWeight: "bold", marginLeft: "8px" }}
            >
              {calculateOrderTotal().toFixed(2)} ₽
            </Text>
          </div>
          <div style={{ width: "220px" }}>
            <Text strong>Долг:</Text>
            <Text style={{ color: "red", marginLeft: "8px" }}>
              {calculateOrderDebt().toFixed(2)} ₽
            </Text>
          </div>
          <div>
            <Text strong>Статус оплаты:</Text>
            <Text style={{ marginLeft: "8px" }}>
              
              {(() => {
                const total = calculateOrderTotal()
                const debt = calculateOrderDebt()

                if (total === 0 && debt > 0) {
                  return "Ошибка: сумма заказа равна 0, но долг больше 0"
                } else if (debt === total) {
                  return "Не оплачено"
                } else if (debt === 0 && total > 0) {
                  return "Оплачено"
                } else if (debt === 0 && total === 0) {
                  return "Не оплачено"
                } else {
                  return "Частично оплачено"
                }
              })()}
            </Text>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          {/* Вторая строка */}
          <div>
            <Input
              disabled
              value={orderNumber}
              onChange={(value) => setOrderNumber(value)}
              style={{ width: "220px", fontWeight: "bold" }}
            />
          </div>
          <div>
            <Form.Item label="Клиент" style={{ margin: 0 }}>
              <Select
                showSearch
                value={selectedClient}
                onChange={(value) => setSelectedClient(value)}
                style={{ width: "275px" }}
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
      <Tabs items={tabs} />

      {/* Spin в правом нижнем углу */}
      {(loading || saved) && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 20px",
          }}
        >
          {loading ? (
            <>
              <Spin size="default" />
            </>
          ) : (
            <>
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: "22px" }}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CreateOrder
