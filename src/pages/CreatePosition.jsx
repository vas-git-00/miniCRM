import React, { useState } from "react"
import SearchableSelect from "./SearchableSelect"
import { Button, Table, Input } from "antd"
import { NumericFormat } from "react-number-format"
import "antd/dist/reset.css"

const CreatePosition = () => {
  const handleSelect = (value) => {
    console.log("Выбрано значение:", value)
  }

  const [products, setProducts] = useState([])

  const handleAddProduct = () => {
    const newProduct = {
      key: Date.now(),
      name: "",
      quantity: 0,
      price: 0,
    }
    setProducts([...products, newProduct])
  }

  const handleInputChange = (key, field, value) => {
    const updatedProducts = products.map((product) => {
      if (product.key === key) {
        return { ...product, [field]: value }
      }
      return product
    })
    setProducts(updatedProducts)
  }

  const columns = [
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) =>
            handleInputChange(record.key, "name", e.target.value)
          }
        />
      ),
    },
    {
      title: "Кол-во",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <NumericFormat
          customInput={Input}
          value={text}
          onValueChange={(values) =>
            handleInputChange(record.key, "quantity", values.floatValue)
          }
          thousandSeparator=" "
          decimalSeparator=","
          decimalScale={0} // Кол-во должно быть целым числом
        />
      ),
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <NumericFormat
          customInput={Input}
          value={text}
          onValueChange={(values) =>
            handleInputChange(record.key, "price", values.floatValue)
          }
          thousandSeparator=" "
          decimalSeparator=","
          decimalScale={2} // Цена с двумя знаками после запятой
        />
      ),
    },
    {
      title: "Сумма",
      dataIndex: "sum",
      key: "sum",
      render: (text, record) => (
        <NumericFormat
          customInput={Input}
          value={record.quantity * record.price}
          displayType="text"
          thousandSeparator=" "
          decimalSeparator=","
          decimalScale={2}
          readOnly // Поле только для чтения
        />
      ),
    },
  ]

  return (
    <>
      <div style={{ width: "300px", margin: "50px auto" }}>
        <h2>Поиск с запросом</h2>
        <SearchableSelect
          placeholder="Введите для поиска"
          fetchUrl="https://jsonplaceholder.typicode.com/users" // URL для поиска
          onSelect={handleSelect}
        />
      </div>

      <div style={{ padding: "20px" }}>
        <Button type="primary" onClick={handleAddProduct}>
          Добавить изделие
        </Button>
        <Table
          columns={columns}
          dataSource={products}
          pagination={false}
          bordered
          style={{ marginTop: "20px" }}
        />
      </div>
    </>
  )
}

export default CreatePosition
