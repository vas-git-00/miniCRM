import React from "react"
import { Table, Tag } from "antd"

const dataSource = [
  { key: "1", orderId: "001", client: "Иван Иванов", status: "Завершен" },
  { key: "2", orderId: "002", client: "Петр Петров", status: "В процессе" },
]

const columns = [
  { title: "Номер заказа", dataIndex: "orderId", key: "orderId" },
  { title: "Клиент", dataIndex: "client", key: "client" },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const color = status === "Завершен" ? "green" : "orange"
      return <Tag color={color}>{status}</Tag>
    },
  },
]

const Orders = () => {
  return (
    <div>
      <h1>Заказы</h1>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  )
}

export default Orders
