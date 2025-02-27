import React, { useState } from "react"
import { Button, Input, Row, Col, Card, Select } from "antd"
import "antd/dist/reset.css"

const CreatePosition = () => {
  // Исходные данные
  const initialData = [
    {
      id: 1,
      position: "Этикетки",
      name: "Этикетки",
      quantity: 1000,
      price: 12,
      total: 12000,
    },
    {
      id: 2,
      position: "Бирки",
      name: "Бирки",
      quantity: 5000,
      price: 3,
      total: 15000,
    },
    {
      id: 3,
      position: "Бирки",
      name: "Бирки",
      quantity: 7000,
      price: 9,
      total: 24000,
    },
  ]

  const [data, setData] = useState(initialData)
  const [subRows, setSubRows] = useState({})

  // Функция для форматирования чисел с разделителями
  const formatNumber = (value, isPrice = false) => {
    if (typeof value !== "number") return value
    const options = isPrice
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    return value.toLocaleString("ru-RU", options)
  }

  // Функция для очистки форматирования
  const cleanNumber = (value) => {
    return parseFloat(value.replace(/\s/g, "").replace(",", ".")) || 0
  }

  // Обработчик изменения значения
  const handleChange = (id, field, value, isPrice = false) => {
    if (isPrice) {
      const decimalPart = value.split(/[,.]/)[1]
      if (decimalPart && decimalPart.length > 2) {
        return
      }
    }

    const newData = data.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    )
    setData(newData)
  }

  // Обработчик потери фокуса (форматирование числа)
  const handleBlur = (id, field, value, isPrice = false) => {
    const cleanedValue = cleanNumber(value)
    const formattedValue = formatNumber(cleanedValue, isPrice)
    handleChange(id, field, formattedValue, isPrice)
  }

  // Функция для добавления новой позиции
  const addPosition = () => {
    const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1
    const newPosition = {
      id: newId,
      position: "Новая позиция",
      name: "Новая позиция",
      quantity: "0",
      price: "0,00",
      total: "0,00",
    }
    setData([...data, newPosition])
  }

  // Функция для удаления позиции и перенумерации
  const deletePosition = (id) => {
    // Удаляем позицию
    const newData = data.filter((item) => item.id !== id)

    // Перенумеровываем оставшиеся позиции
    const renumberedData = newData.map((item, index) => ({
      ...item,
      id: index + 1,
    }))

    setData(renumberedData)

    // Удаляем подстроки для удаленной позиции
    setSubRows((prev) => {
      const updatedSubRows = { ...prev }
      delete updatedSubRows[id]
      return updatedSubRows
    })
  }

  // Функция для добавления подстроки
  const addSubRow = (id) => {
    const newSubRow = { supplier: "", purchase: "0,00" }
    setSubRows((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), newSubRow],
    }))
  }

  // Функция для удаления подстроки
  const deleteSubRow = (id, index) => {
    setSubRows((prev) => {
      const updatedSubRows = [...prev[id]]
      updatedSubRows.splice(index, 1)
      return { ...prev, [id]: updatedSubRows }
    })
  }

  // Функция для изменения значений в подстроке
  const handleSubRowChange = (id, index, field, value) => {
    if (field === "purchase") {
      const decimalPart = value.split(/[,.]/)[1]
      if (decimalPart && decimalPart.length > 2) {
        return
      }
    }

    setSubRows((prev) => {
      const updatedSubRows = [...prev[id]]
      updatedSubRows[index][field] = value
      return { ...prev, [id]: updatedSubRows }
    })
  }

  // Обработчик потери фокуса для подстрок (форматирование числа)
  const handleSubRowBlur = (id, index, field, value) => {
    if (field === "purchase") {
      const cleanedValue = cleanNumber(value)
      const formattedValue = formatNumber(cleanedValue, true) // Форматируем как цену
      setSubRows((prev) => {
        const updatedSubRows = [...prev[id]]
        updatedSubRows[index][field] = formattedValue
        return { ...prev, [id]: updatedSubRows }
      })
    }
  }

  return (
    <>
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

      <Card style={{ marginBottom: "16px", display: "flex", flexWrap: "wrap" }}>
        <Row
          gutter={[16, 16]}
          style={{
            marginBottom: "8px" 
          }}
        >
          <Col span={1}>Сумма:</Col>
          <Col span={2}>1 000 000,00</Col>
          <Col span={1}>Маржа:</Col>
          <Col span={2}>1 000 000,00</Col>
          <Col style={{ width: "130px" }}>Статус оплаты:</Col>
          <Col span={2}>Частично</Col>
          <Col style={{ width: "130px" }}>Статус заказа:</Col>
          <Col>
            <Select
              //value={orderStatus}
              //onChange={(value) => setOrderStatus(value)}
              style={{ width: "200px" }}
            >
              <Option value="Новый">Новый</Option>
              <Option value="В работе">В работе</Option>
              <Option value="Готов">Готов</Option>
            </Select>
          </Col>
          <Col style={{ width: "130px" }}>Менеджер:</Col>
          <Col>
            <Select
              //value={orderStatus}
              //onChange={(value) => setOrderStatus(value)}
              style={{ width: "200px" }}
            >
              <Option value="Екатерина Глазунова">Екатерина Глазунова</Option>
              <Option value="Михаил Тельпов">Михаил Тельпов</Option>
            </Select>
          </Col>
        </Row>
        <Row
          gutter={[16, 16]}
          style={{
            
          }}
        >
          <Col span={1}>Долг:</Col>
          <Col span={2}>1 000 000,00</Col>
          <Col span={1}></Col>
          <Col span={2}></Col>
          <Col style={{ width: "130px" }}>Статус отгрузки:</Col>
          <Col span={2}>Не выдано</Col>
          <Col style={{ width: "130px" }}>Клиент:</Col>
          <Col>
            <Select
              //value={orderStatus}
              //onChange={(value) => setOrderStatus(value)}
              style={{ width: "275px" }}
            >
              <Option value="Иванов И.А.">Иванов И.А.</Option>
              <Option value="Ромашка">ООО "Ромашка"</Option>
              <Option value="Васильев Е.А.">ИП Васильев Е.А.</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card
        title="Позиции"
        style={{ marginBottom: "16px" }}
        extra={<Button onClick={addPosition}>Добавить позицию</Button>} 
        
      >
        <div style={{ }}>
          {/* Заголовки */}
          <Row
            gutter={[16, 16]}
            style={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <Col span={1}>№</Col>
            <Col span={5}>Позиция</Col>
            <Col span={4}>Название</Col>
            <Col span={2}>Кол-во</Col>
            <Col span={3}>Цена</Col>
            <Col span={3}>Сумма</Col>
            <Col span={3}>Отгрузка</Col>
            <Col span={2}>Действия</Col>
          </Row>

          {/* Данные с редактируемыми полями */}
          {data.map((item) => (
            <React.Fragment key={item.id}>
              {/* Основная строка с данными */}
              <Row
                gutter={[16, 16]}
                style={{ borderTop: "1px solid #ddd", padding: "8px 0" }}
              >
                <Col span={1}>
                  <Input
                    value={item.id}
                    style={{ textAlign: "center" }}
                    readOnly
                  />
                </Col>
                <Col span={5}>
                  <Input
                    value={item.position}
                    onChange={(e) =>
                      handleChange(item.id, "position", e.target.value)
                    }
                  />
                </Col>
                <Col span={4}>
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      handleChange(item.id, "name", e.target.value)
                    }
                  />
                </Col>
                <Col span={2}>
                  <Input
                    value={item.quantity.toString()}
                    onChange={(e) =>
                      handleChange(item.id, "quantity", e.target.value)
                    }
                    onBlur={(e) =>
                      handleBlur(item.id, "quantity", e.target.value)
                    }
                    style={{ textAlign: "center" }}
                  />
                </Col>
                <Col span={3}>
                  <Input
                    value={item.price.toString()}
                    onChange={(e) =>
                      handleChange(item.id, "price", e.target.value, true)
                    }
                    onBlur={(e) =>
                      handleBlur(item.id, "price", e.target.value, true)
                    }
                    style={{ textAlign: "center" }}
                  />
                </Col>
                <Col span={3}>
                  <Input
                    value={item.total.toString()}
                    onChange={(e) =>
                      handleChange(item.id, "total", e.target.value, true)
                    }
                    onBlur={(e) =>
                      handleBlur(item.id, "total", e.target.value, true)
                    }
                    style={{ textAlign: "center" }}
                  />
                </Col>
                <Col span={3}>
                  <Input
                    value={"0 из 1 000"}
                    readOnly
                    disabled
                    style={{ textAlign: "center", fontSize: "12px" }}
                  />
                </Col>
                <Col span={2}>
                  <Button onClick={() => addSubRow(item.id)}>+</Button>
                  <Button
                    onClick={() => deletePosition(item.id)}
                    style={{ marginLeft: "8px" }}
                  >
                    -
                  </Button>
                </Col>
              </Row>

              {/* Подстроки с поставщиками и закупками */}
              {subRows[item.id]?.map((subRow, index) => (
                <Row
                  key={index}
                  gutter={[16, 16]}
                  style={{ padding: "8px 0", background: "#f9f9f9" }}
                >
                  <Col span={1}></Col>
                  <Col span={5}>
                    <Input
                      placeholder="Поставщик"
                      value={subRow.supplier}
                      onChange={(e) =>
                        handleSubRowChange(
                          item.id,
                          index,
                          "supplier",
                          e.target.value
                        )
                      }
                    />
                  </Col>
                  <Col span={4}></Col>
                  <Col span={2}></Col>
                  <Col span={3}></Col>
                  <Col span={3}>
                    <Input
                      placeholder="Закупка"
                      value={subRow.purchase}
                      onChange={(e) =>
                        handleSubRowChange(
                          item.id,
                          index,
                          "purchase",
                          e.target.value
                        )
                      }
                      onBlur={(e) =>
                        handleSubRowBlur(
                          item.id,
                          index,
                          "purchase",
                          e.target.value
                        )
                      }
                      style={{ textAlign: "center" }}
                    />
                  </Col>
                  <Col span={3}></Col>
                  <Col span={2}>
                    <Button onClick={() => deleteSubRow(item.id, index)}>
                      -
                    </Button>
                  </Col>
                </Row>
              ))}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </>
  )
}

export default CreatePosition
