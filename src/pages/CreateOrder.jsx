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
  Badge,
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

const { Option } = Select
const { Text } = Typography

const CreateOrder = () => {
  const [orderItems, setOrderItems] = useState([])
  const [incomingPayments, setIncomingPayments] = useState([]) // Входящие платежи
  const [outgoingPayments, setOutgoingPayments] = useState([]) // Исходящие платежи
  const [selectedClient, setSelectedClient] = useState(null)
  const [orderStatus, setOrderStatus] = useState("Новый")
  const [manager, setManager] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [supplier, setSupplier] = useState("")
  const [purchaseAmount, setPurchaseAmount] = useState(0)
  const [orderNumber, setOrderNumber] = useState("24-2322 от 22.12.2024")
  const [loading, setLoading] = useState(false) // Состояние загрузки
  const [saved, setSaved] = useState(false) // Состояние сохранения
  const [comment, setComment] = useState("")
  const [margin, setMargin] = useState(0)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  // Функция для расчёта маржи
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

  // Загружаем данные из LocalStorage при монтировании компонента
  useEffect(() => {
    const savedPayments = JSON.parse(localStorage.getItem("incomingPayments"))
    if (savedPayments) {
      setIncomingPayments(savedPayments)
    }
  }, [])

  // Сохраняем данные в LocalStorage, когда состояние incomingPayments изменяется
  useEffect(() => {
    if (incomingPayments.length > 0) {
      localStorage.setItem("incomingPayments", JSON.stringify(incomingPayments))
    }
  }, [incomingPayments])

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
        comment,
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
  }, [orderItems, selectedClient, orderStatus, manager, comment])

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
      note: null,
      supplier: null,
      //quantity: null,
      //purchasePrice: null,
      sellingPrice: null,
      status: "Не выдано",
      deliveryQuantity: 0, // Кол-во для выдачи
      selected: true, // Чекбокс по умолчанию включен
      quantity: 0, // Общее количество
      delivered: 0, // Сколько уже выдано
      //additionalCosts: [], // Новое поле для дополнительных расходов
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
    // Рассчитать доступное количество для выдачи перед открытием Drawer
    const updatedItems = orderItems.map((item) => ({
      ...item,
      deliveryQuantity: Math.max(0, item.quantity - item.delivered), // Остаток
      selected: item.quantity > item.delivered, // Отключить чекбокс, если всё выдано
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
        deliveryQuantity: 0, // Очистить поле
        status: newStatus,
      }
    })

    setOrderItems(updatedItems)
    setIsDrawerVisible(false)
    message.success("Позиции успешно отгружены!")
  }

  const tabs = [
    {
      key: "1",
      label: "Состав заказа",
      children: (
        <div>
          <Card
            title="Позиции заказа"
            style={{ marginBottom: "16px" }}
            extra={
              <Space>
                <Button type="dashed" onClick={addOrderItem} block>
                  Добавить позицию
                </Button>
                <Button type="dashed" onClick={handleDrawerOpen} block>
                  Отгрузка
                </Button>
              </Space>
            }
          >
            {orderItems.map((item, index) => (
              <div key={item.id} style={{ marginBottom: "8px" }}>
                <Space style={{ display: "flex" }} align="baseline">
                  {/* <Text style={{ width: "40px" }}>{index + 1}</Text> */}
                  <Input
                    value={index + 1}
                    disabled
                    style={{ width: "30px", padding: "4px" }}
                  />
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
                    placeholder="Название"
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
                    style={{ width: "110px" }}
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

                  <span style={{ marginLeft: "16px" }}>
                    {item.delivered}/{item.quantity} (
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

                  {/* ПОСТАВЩИК 
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
                    style={{ width: "250px", marginLeft: "16px" }}
                    placeholder="Поставщик"
                  >
                    <Option value="ПроПринт">ПроПринт</Option>
                    <Option value="Шалохин">Шалохин</Option>
                    <Option value="2 клена">2 клена</Option>
                  </Select>  */}

                  {/* ЗАКУПКА 
                  <Input
                    type="number"
                    placeholder="Закупка, руб."
                    value={item.purchasePrice}
                    onChange={(e) =>
                      setOrderItems(
                        orderItems.map((o) =>
                          o.id === item.id
                            ? {
                                ...o,
                                purchasePrice: parseFloat(e.target.value),
                              }
                            : o
                        )
                      )
                    }
                    style={{
                      width: "140px",
                      appearance: "none",
                      MozAppearance: "textfield",
                    }}
                  /> */}

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
                      setOrderItems([
                        ...orderItems.map((o) =>
                          o.id === item.id
                            ? {
                                ...o,
                                children: [
                                  ...(o.children || []),
                                  {
                                    id: Date.now(),
                                    supplier: null,
                                    purchasePrice: null,
                                  },
                                ],
                              }
                            : o
                        ),
                      ])
                    }
                  />
                </Space>

                {(item.children || []).map((child) => (
                  <Space
                    key={child.id}
                    style={{
                      display: "flex",
                      marginLeft: "38px", // Отступ для дочерних элементов
                      marginTop: "8px",
                    }}
                    align="baseline"
                  >
                    <Select
                      showSearch
                      value={child.supplier}
                      onChange={(value) =>
                        setOrderItems(
                          orderItems.map((o) =>
                            o.id === item.id
                              ? {
                                  ...o,
                                  children: o.children.map((c) =>
                                    c.id === child.id
                                      ? { ...c, supplier: value }
                                      : c
                                  ),
                                }
                              : o
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
                      placeholder="Закупка, руб."
                      value={child.purchasePrice}
                      onChange={(e) =>
                        setOrderItems(
                          orderItems.map((o) =>
                            o.id === item.id
                              ? {
                                  ...o,
                                  children: o.children.map((c) =>
                                    c.id === child.id
                                      ? {
                                          ...c,
                                          purchasePrice: parseFloat(
                                            e.target.value
                                          ),
                                        }
                                      : c
                                  ),
                                }
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
                      title="Удалить доп. расход?"
                      onConfirm={() =>
                        setOrderItems(
                          orderItems.map((o) =>
                            o.id === item.id
                              ? {
                                  ...o,
                                  children: o.children.filter(
                                    (c) => c.id !== child.id
                                  ),
                                }
                              : o
                          )
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
              </div>
            ))}
          </Card>
          <Card title="Комментарий" style={{ marginBottom: "16px" }}>
            <Input.TextArea
              rows={5}
              placeholder="Введите комментарий"
              value={comment}
              onChange={(e) => setComment(e.target.value)} // Здесь обработка
            />
          </Card>

          {/* Drawer компонент ОТГРУЗКА*/}
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
                    disabled={item.quantity === item.delivered} // Заблокировать, если всё выдано
                    onChange={(e) =>
                      setOrderItems(
                        orderItems.map((o) =>
                          o.id === item.id
                            ? { ...o, selected: e.target.checked }
                            : o
                        )
                      )
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
                    style={{ width: "200px" }}
                    placeholder="Позиция"
                  />
                  <Input
                    type="number"
                    placeholder="Кол-во для выдачи"
                    disabled={item.quantity === item.delivered}
                    value={item.deliveryQuantity}
                    onChange={(e) =>
                      setOrderItems(
                        orderItems.map((o) =>
                          o.id === item.id
                            ? {
                                ...o,
                                deliveryQuantity: Math.min(
                                  parseFloat(e.target.value) || 0,
                                  o.quantity - o.delivered
                                ),
                              }
                            : o
                        )
                      )
                    }
                    style={{ width: "150px" }}
                  />
                </Space>
              </div>
            ))}
            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <Button
                type="primary"
                onClick={handleDelivery}
                disabled={
                  // Блокируем кнопку, если все чекбоксы сняты или все элементы заблокированы
                  orderItems.every(
                    (item) => !item.selected || item.quantity === item.delivered // Либо чекбокс снят, либо все выдано
                  )
                }
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
                    return: false, // Флаг возврата
                  }
                  setIncomingPayments([...incomingPayments, newPayment])
                }}
                disabled={!selectedClient} // Кнопка неактивна, если клиент не выбран
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
                    setIncomingPayments(
                      incomingPayments.map((p) =>
                        p.id === payment.id
                          ? {
                              ...p,
                              paymentType: value,
                              updatedAt: new Date().toLocaleString(),
                            }
                          : p
                      )
                    )
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
                    setIncomingPayments(
                      incomingPayments.map((p) =>
                        p.id === payment.id
                          ? {
                              ...p,
                              details: e.target.value,
                              updatedAt: new Date().toLocaleString(),
                            }
                          : p
                      )
                    )
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
                      setIncomingPayments(
                        incomingPayments.map((p) =>
                          p.id === payment.id
                            ? {
                                ...p,
                                amount: value,
                                updatedAt: new Date().toLocaleString(),
                              }
                            : p
                        )
                      )
                    }
                  }}
                  style={{ width: "150px" }}
                />
                <Select
                  placeholder="Статус оплаты"
                  value={payment.status}
                  onChange={(value) =>
                    setIncomingPayments(
                      incomingPayments.map((p) =>
                        p.id === payment.id
                          ? {
                              ...p,
                              status: value,
                              updatedAt: new Date().toLocaleString(),
                            }
                          : p
                      )
                    )
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
                  onClick={() => {
                    setIncomingPayments(
                      incomingPayments.map((p) =>
                        p.id === payment.id
                          ? {
                              ...p,
                              return: !p.return,
                              updatedAt: new Date().toLocaleString(),
                            }
                          : p
                      )
                    )
                  }}
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
          <div style={{ width: "210px" }}>
            <Text strong>Маржа:</Text>
            <Text style={{ color: "green", marginLeft: "8px" }}>
              {margin.toFixed(2)} ₽
            </Text>
          </div>
          <div style={{ width: "210px" }}>
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
