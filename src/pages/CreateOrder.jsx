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
  Popover,
  Drawer,
  Checkbox,
  message,
} from "antd"
import {
  MinusCircleOutlined,
  CheckCircleTwoTone,
  InfoCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons"
import debounce from "lodash/debounce"

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
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [comment, setComment] = useState("")
  const [margin, setMargin] = useState(0)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [deliveries, setDeliveries] = useState([]) // Состояние для доставок

  useEffect(() => {
    const totalSellingPrice = orderItems.reduce(
      (acc, item) => acc + (item.sellingPrice || 0),
      0
    )
    const totalPurchasePrice = orderItems.reduce(
      (acc, item) =>
        acc +
        (item.purchasePrice || 0) +
        (item.children || []).reduce(
          (childAcc, child) => childAcc + (child.purchasePrice || 0),
          0
        ),
      0
    )
    setMargin(totalSellingPrice - totalPurchasePrice)
  }, [orderItems])

  const saveOrderData = async () => {
    try {
      setLoading(true)
      setSaved(false)
      const orderData = {
        orderNumber,
        orderStatus,
        selectedClient,
        manager,
        orderItems,
        comment,
        deliveries, // Добавляем доставки в данные заказа
      }
      console.log(orderData)
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      setLoading(false)
      console.error("Ошибка при сохранении:", error)
      message.error("Ошибка при сохранении заказа")
    }
  }

  const debouncedSaveOrderData = debounce(saveOrderData, 1000)

  useEffect(() => {
    debouncedSaveOrderData()
  }, [orderItems, selectedClient, orderStatus, manager, comment, deliveries])

  const calculateOrderTotal = () => {
    const totalOrderItems = orderItems.reduce(
      (total, item) => total + (parseFloat(item.sellingPrice) || 0),
      0
    )
    const totalDeliveries = deliveries.reduce(
      (total, delivery) => total + (parseFloat(delivery.amount) || 0),
      0
    )
    return totalOrderItems + totalDeliveries // Учитываем сумму доставок
  }

  const totalOrderPrice = Number(calculateOrderTotal()).toFixed(2)

  const calculateItemTotalPrice = (quantity, pricePerUnit) => {
    return quantity && pricePerUnit
      ? (quantity * pricePerUnit).toFixed(2)
      : "0.00"
  }

  const calculatePricePerUnit = (totalPrice, quantity) => {
    return quantity && totalPrice ? (totalPrice / quantity).toFixed(2) : "0.00"
  }

  const calculateOrderDebt = () => {
    const total = totalOrderPrice
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
      note: null,
      supplier: null,
      pricePerUnit: null,
      sellingPrice: null,
      status: "Не выдано",
      deliveryQuantity: 0,
      selected: true,
      quantity: 0,
      delivered: 0,
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

  const handleDrawerOpen = () => {
    const updatedItems = orderItems.map((item) => ({
      ...item,
      deliveryQuantity: Math.max(0, item.quantity - item.delivered),
      selected: item.quantity > item.delivered,
    }))
    setOrderItems(updatedItems)
    setIsDrawerVisible(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerVisible(false)
  }

  const handleDelivery = () => {
    const updatedItems = orderItems.map((item) => {
      if (!item.selected || item.deliveryQuantity === 0) {
        return item
      }

      const newDelivered = item.delivered + item.deliveryQuantity

      let newStatus = "Не выдано"
      if (newDelivered === item.quantity) {
        newStatus = "Выдано"
      } else if (newDelivered < item.quantity) {
        newStatus = "Частично выдано"
      }

      return {
        ...item,
        delivered: newDelivered,
        deliveryQuantity: 0,
        status: newStatus,
      }
    })

    setOrderItems(updatedItems)
    setIsDrawerVisible(false)
    message.success("Позиции успешно отгружены!")
  }

  const addDelivery = () => {
    const newDelivery = {
      id: Date.now(),
      type: null, // Тип доставки
      address: "", // Адрес
      amount: 0, // Сумма доставки
    }
    setDeliveries([...deliveries, newDelivery])
  }

  const updateDelivery = (id, updates) => {
    setDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, ...updates } : delivery
      )
    )
  }

  const deleteDelivery = (id) => {
    setDeliveries(deliveries.filter((delivery) => delivery.id !== id))
  }

  const tabs = [
    {
      key: "1",
      label: "Состав заказа",
      children: (
        <div>
          <Card
            title="Позиции"
            style={{ marginBottom: "16px" }}
            extra={
              <Space>
                <Button
                  type="dashed"
                  onClick={addOrderItem}
                  block
                  disabled={!selectedClient}
                >
                  Добавить позицию
                </Button>
                <Button
                  type="dashed"
                  onClick={handleDrawerOpen}
                  block
                  disabled={
                    !selectedClient || !manager || orderItems.length === 0
                  }
                >
                  Отгрузка
                </Button>
              </Space>
            }
          >
            {orderItems.map((item, index) => (
              <div key={item.id} style={{ marginBottom: "8px" }}>
                <Space style={{ display: "flex" }} align="baseline">
                  <Input
                    value={index + 1}
                    disabled
                    style={{ width: "30px", padding: "4px" }}
                  />
                  <Select
                    showSearch
                    value={item.position}
                    onChange={(value) =>
                      updateOrderItem(item.id, { position: value })
                    }
                    style={{ width: "200px" }}
                    placeholder="Позиция"
                  >
                    <Option value="Бирки">Бирки</Option>
                    <Option value="Этикетки">Этикетки</Option>
                    <Option value="Наклейки">Наклейки</Option>
                  </Select>
                  <Input
                    placeholder="Название"
                    value={item.note}
                    onChange={(e) =>
                      updateOrderItem(item.id, { note: e.target.value })
                    }
                    style={{ width: "200px" }}
                  />
                  <Input
                    type="number"
                    placeholder="Кол-во"
                    value={item.quantity || 0} // Убедимся, что значение всегда число
                    onChange={(e) => {
                      const newQuantity = parseFloat(e.target.value) || 0

                      // Обновляем количество и пересчитываем цену
                      updateOrderItem(item.id, {
                        quantity: newQuantity,
                        pricePerUnit: (item.sellingPrice || 0) / newQuantity,
                      })
                    }}
                    style={{ width: "110px" }}
                  />
                  <Input
                    type="text"
                    placeholder="Цена, руб."
                    value={
                      item.pricePerUnit !== null &&
                      item.pricePerUnit !== undefined
                        ? item.pricePerUnit.toFixed(2).replace(".", ",")
                        : ""
                    } // Отображаем запятую
                    readOnly // Поле только для чтения
                    style={{ width: "140px" }}
                  />
                  <Input
                    type="text"
                    placeholder="Сумма, руб."
                    value={item.sellingPriceInput || ""} // Используем сырой ввод
                    onChange={(e) => {
                      const value = e.target.value

                      // Разрешаем ввод цифр, одной точки или одной запятой, и ограничиваем количество знаков после запятой до двух
                      if (/^\d*[,.]?\d{0,2}$/.test(value)) {
                        // Сохраняем сырой ввод
                        updateOrderItem(item.id, {
                          sellingPriceInput: value,
                        })

                        // Заменяем запятую на точку для корректного преобразования в число
                        const numericValue =
                          parseFloat(value.replace(",", ".")) || 0

                        // Обновляем сумму и пересчитываем цену
                        updateOrderItem(item.id, {
                          sellingPrice: numericValue,
                          pricePerUnit: numericValue / (item.quantity || 1),
                        })
                      }
                    }}
                    onBlur={() => {
                      // Форматируем значение при потере фокуса
                      if (
                        item.sellingPrice !== null &&
                        item.sellingPrice !== undefined
                      ) {
                        updateOrderItem(item.id, {
                          sellingPriceInput: item.sellingPrice
                            .toFixed(2)
                            .replace(".", ","),
                        })
                      }
                    }}
                    style={{ width: "140px" }}
                  />

                  <span style={{ marginLeft: "16px" }}>
                    {item.delivered} из {item.quantity} (
                    {item.status === "Выдано" ? (
                      <strong style={{ color: "green" }}>Выдано</strong>
                    ) : item.status === "Частично выдано" ? (
                      <strong style={{ color: "orange" }}>
                        Частично выдано
                      </strong>
                    ) : (
                      <strong style={{ color: "red" }}>Не выдано</strong>
                    )}
                    )
                  </span>

                  <Popconfirm
                    title="Удалить позицию?"
                    onConfirm={() => deleteOrderItem(item.id)}
                    okText="Да"
                    cancelText="Нет"
                  >
                    <MinusCircleOutlined
                      style={{
                        color: "red",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    />
                  </Popconfirm>
                  <PlusCircleOutlined
                    style={{
                      color: "orange",
                      fontSize: "16px",
                      cursor: "pointer",
                      marginLeft: "8px",
                    }}
                    onClick={() =>
                      updateOrderItem(item.id, {
                        children: [
                          ...(item.children || []),
                          {
                            id: Date.now(),
                            supplier: null,
                            purchasePrice: null,
                          },
                        ],
                      })
                    }
                  />
                </Space>

                {(item.children || []).map((child) => (
                  <Space
                    key={child.id}
                    style={{
                      display: "flex",
                      marginLeft: "38px",
                      marginTop: "8px",
                    }}
                    align="baseline"
                  >
                    <Select
                      showSearch
                      value={child.supplier}
                      onChange={(value) =>
                        updateOrderItem(item.id, {
                          children: item.children.map((c) =>
                            c.id === child.id ? { ...c, supplier: value } : c
                          ),
                        })
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
                      placeholder="Закупка, руб."
                      value={child.purchasePrice}
                      onChange={(e) =>
                        updateOrderItem(item.id, {
                          children: item.children.map((c) =>
                            c.id === child.id
                              ? {
                                  ...c,
                                  purchasePrice: parseFloat(e.target.value),
                                }
                              : c
                          ),
                        })
                      }
                      style={{
                        width: "140px",
                        appearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <Popconfirm
                      title="Удалить доп. расход?"
                      onConfirm={() =>
                        updateOrderItem(item.id, {
                          children: item.children.filter(
                            (c) => c.id !== child.id
                          ),
                        })
                      }
                      okText="Да"
                      cancelText="Нет"
                    >
                      <MinusCircleOutlined
                        style={{
                          color: "red",
                          fontSize: "16px",
                          cursor: "pointer",
                        }}
                      />
                    </Popconfirm>
                  </Space>
                ))}
              </div>
            ))}
          </Card>

          <Card
            title="Доставка"
            style={{ marginBottom: "16px" }}
            extra={
              <Button
                type="dashed"
                onClick={addDelivery}
                block
                disabled={!selectedClient}
              >
                Добавить доставку
              </Button>
            }
          >
            {deliveries.map((delivery, index) => (
              <div key={delivery.id} style={{ marginBottom: "8px" }}>
                <Space style={{ display: "flex" }} align="baseline">
                  <Input
                    value={index + 1}
                    disabled
                    style={{ width: "30px", padding: "4px" }}
                  />
                  <Select
                    value={delivery.type}
                    onChange={(value) =>
                      updateDelivery(delivery.id, { type: value })
                    }
                    style={{ width: "200px" }}
                    placeholder="Тип доставки"
                  >
                    <Option value="Пеший курьер">Пеший курьер</Option>
                    <Option value="Достависта">Достависта</Option>
                    <Option value="Яндекс.Доставка">Яндекс.Доставка</Option>
                  </Select>
                  <Input
                    placeholder="Адрес"
                    value={delivery.address}
                    onChange={(e) =>
                      updateDelivery(delivery.id, { address: e.target.value })
                    }
                    style={{ width: "200px" }}
                  />
                  <Input
                    type="text"
                    placeholder="Сумма, руб."
                    value={delivery.amount || ""}
                    onChange={(e) => {
                      const value = e.target.value

                      // Разрешаем ввод цифр, одной точки или одной запятой, и ограничиваем количество знаков после запятой до двух
                      if (/^\d*[,.]?\d{0,2}$/.test(value)) {
                        // Заменяем запятую на точку для корректного преобразования в число
                        const numericValue =
                          parseFloat(value.replace(",", ".")) || 0

                        // Обновляем сумму доставки
                        updateDelivery(delivery.id, { amount: numericValue })
                      }
                    }}
                    style={{ width: "140px" }}
                  />
                  <Popconfirm
                    title="Удалить доставку?"
                    onConfirm={() => deleteDelivery(delivery.id)}
                    okText="Да"
                    cancelText="Нет"
                  >
                    <MinusCircleOutlined
                      style={{
                        color: "red",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    />
                  </Popconfirm>
                </Space>
              </div>
            ))}
          </Card>

          <Card title="Комментарий" style={{ marginBottom: "16px" }}>
            <Input.TextArea
              rows={5}
              placeholder="Введите комментарий"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Card>

          <Drawer
            title="Отгрузка по заказу"
            placement="right"
            onClose={handleDrawerClose}
            open={isDrawerVisible}
            width={600}
          >
            {orderItems.map((item, index) => (
              <div key={item.id} style={{ marginBottom: "8px" }}>
                <Space style={{ display: "flex" }} align="baseline">
                  <Checkbox
                    checked={item.selected}
                    disabled={item.quantity === item.delivered}
                    onChange={(e) =>
                      updateOrderItem(item.id, { selected: e.target.checked })
                    }
                  />
                  <Input
                    value={index + 1}
                    disabled
                    style={{ width: "30px", padding: "4px" }}
                  />
                  <Input
                    value={item.position || ""}
                    disabled
                    style={{ width: "160px" }}
                    placeholder="Позиция"
                  />
                  <Input
                    value={item.note || ""}
                    disabled
                    style={{ width: "180px" }}
                    placeholder="Название"
                  />
                  <Input
                    type="number"
                    placeholder="Кол-во для выдачи"
                    disabled={item.quantity === item.delivered}
                    value={item.deliveryQuantity}
                    onChange={(e) =>
                      updateOrderItem(item.id, {
                        deliveryQuantity: Math.min(
                          parseFloat(e.target.value) || 0,
                          item.quantity - item.delivered
                        ),
                      })
                    }
                    style={{ width: "135px" }}
                  />
                </Space>
              </div>
            ))}
            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <Button
                type="primary"
                onClick={handleDelivery}
                disabled={orderItems.every(
                  (item) => !item.selected || item.quantity === item.delivered
                )}
              >
                Отгрузить
              </Button>
            </div>
          </Drawer>
        </div>
      ),
    },
    {
      key: "2",
      label: "Платежи",
      children: (
        <div>
          <Card
            title="Входящие платежи"
            extra={
              <Button
                type="dashed"
                onClick={() => {
                  const newPayment = {
                    id: Date.now(),
                    number: incomingPayments.length + 1,
                    paymentType: null,
                    payer: selectedClient || "Клиент не выбран",
                    details: null,
                    amount: null,
                    status: "Новый",
                    manager: manager || "Менеджер не выбран",
                    createdAt: new Date().toLocaleString(),
                    updatedAt: new Date().toLocaleString(),
                    return: false,
                  }
                  setIncomingPayments([...incomingPayments, newPayment])
                }}
                disabled={
                  !selectedClient || !manager || orderItems.length === 0
                }
              >
                Добавить платеж
              </Button>
            }
            style={{ marginBottom: "16px" }}
          >
            {incomingPayments.map((payment, index) => (
              <Space
                key={payment.id}
                style={{ display: "flex", marginBottom: "8px" }}
                align="baseline"
              >
                <Text style={{ width: "40px" }}>{index + 1}</Text>
                <Select
                  placeholder="Тип оплаты"
                  value={payment.paymentType}
                  onChange={(value) =>
                    updatePayment(payment.id, { paymentType: value })
                  }
                  style={{ width: "200px" }}
                >
                  <Option value="Банковская карта">Банковская карта</Option>
                  <Option value="Наличные">Наличные</Option>
                  <Option value="Безналичный расчет">Безналичный расчет</Option>
                </Select>

                <Input
                  disabled
                  value={payment.payer}
                  style={{ width: "200px" }}
                />

                <Input
                  placeholder="Реквизиты"
                  value={payment.details}
                  onChange={(e) =>
                    updatePayment(payment.id, { details: e.target.value })
                  }
                  style={{ width: "200px" }}
                />
                <Input
                  type="number"
                  placeholder="Сумма"
                  value={payment.amount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value)
                    if (value <= calculateOrderDebt()) {
                      updatePayment(payment.id, { amount: value })
                    }
                  }}
                  style={{ width: "150px" }}
                />
                <Select
                  placeholder="Статус оплаты"
                  value={payment.status}
                  onChange={(value) =>
                    updatePayment(payment.id, { status: value })
                  }
                  style={{ width: "150px" }}
                >
                  <Option value="Новый">Новый</Option>
                  <Option value="Проверено">Проверено</Option>
                  <Option value="Отменен">Отменен</Option>
                </Select>

                <Button
                  type="primary"
                  danger
                  onClick={() =>
                    updatePayment(payment.id, { return: !payment.return })
                  }
                >
                  {payment.return ? "Возврат выполнен" : "Возврат"}
                </Button>

                <Input
                  disabled
                  value={payment.manager}
                  style={{ width: "150px" }}
                />
                <Popover
                  content={
                    <div>
                      <Text>Создано: {payment.createdAt}</Text>
                      <br />
                      <Text>Изменено: {payment.updatedAt}</Text>
                    </div>
                  }
                  title="Информация"
                  trigger="hover"
                >
                  <InfoCircleOutlined
                    style={{
                      color: "#1890ff",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  />
                </Popover>
                <Popconfirm
                  title="Удалить этот платеж?"
                  onConfirm={() =>
                    setIncomingPayments(
                      incomingPayments.filter((p) => p.id !== payment.id)
                    )
                  }
                  okText="Да"
                  cancelText="Нет"
                >
                  <MinusCircleOutlined
                    style={{
                      color: "red",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  />
                </Popconfirm>
              </Space>
            ))}
          </Card>
        </div>
      ),
    },
  ]

  const updateOrderItem = (id, updates) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  const updatePayment = (id, updates) => {
    setIncomingPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id
          ? { ...payment, ...updates, updatedAt: new Date().toLocaleString() }
          : payment
      )
    )
  }

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
        <h1 style={{ margin: 0 }}>Заказ: {orderNumber}</h1>
      </div>

      <Card style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ width: "200px" }}>
            <Text strong>Сумма:</Text>
            <Text
              style={{ color: "green", fontWeight: "bold", marginLeft: "8px" }}
            >
              {totalOrderPrice} ₽
            </Text>
          </div>
          <div style={{ width: "200px" }}>
            <Text strong>Долг:</Text>
            <Text style={{ color: "red", marginLeft: "8px" }}>
              {calculateOrderDebt().toFixed(2)} ₽
            </Text>
          </div>
          <div style={{ width: "215px" }}>
            <Text strong>Маржа:</Text>
            <Text style={{ color: "green", marginLeft: "8px" }}>
              {margin.toFixed(2)} ₽
            </Text>
          </div>
          <div style={{ width: "305px" }}>
            <Text strong>Статус оплаты:</Text>
            <Text style={{ marginLeft: "8px" }}>
              {(() => {
                const total = totalOrderPrice
                const payments = incomingPayments.reduce(
                  (sum, payment) => sum + (payment.amount || 0),
                  0
                )
                const debt = total - payments

                if (total === 0) {
                  return "Не оплачено" // Если сумма заказа равна 0
                } else if (payments === 0) {
                  return "Не оплачено" // Если платежей нет
                } else if (debt === 0) {
                  return "Оплачено" // Если долг равен 0
                } else if (debt === total) {
                  return "Не оплачено" // Если платежей нет и долг равен сумме заказа
                } else {
                  return "Частично оплачено" // Если оплачена только часть
                }
              })()}
            </Text>
          </div>

          <div style={{ width: "250px" }}>
            <Text strong>Статус отгрузки:</Text>
            <Text style={{ marginLeft: "8px" }}>
              Частично
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
          {/*<div>
            <Input
              disabled
              value={orderNumber}
              onChange={(value) => setOrderNumber(value)}
              style={{ width: "220px", fontWeight: "bold" }}
            />
          </div> */}
          <div>
            <Form.Item label="Клиент" style={{ margin: 0 }}>
              <Select
                showSearch
                value={selectedClient}
                onChange={(value) => setSelectedClient(value)}
                style={{ width: "250px" }}
                placeholder="Выберите клиента"
              >
                <Option value="ООО Ромашка">ООО Ромашка</Option>
                <Option value="ИП Иванов">ИП Иванов</Option>
                <Option value="ООО Тюльпан">ООО Тюльпан</Option>
              </Select>
            </Form.Item>
          </div>

          <div>
            <Form.Item label="Контакт" style={{ margin: 0 }}>
              <Select
                showSearch
                //value={selectedClient}
                //onChange={(value) => setSelectedClient(value)}
                style={{ width: "250px" }}
                placeholder="Выберите контактное лицо"
              >
                <Option value="ООО Ромашка">Вячеслав Просветов</Option>
                <Option value="ИП Иванов">Вера Кузнецова</Option>
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

      <Tabs items={tabs} />

      {(loading || saved) && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            right: 15,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "5px 5px",
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
