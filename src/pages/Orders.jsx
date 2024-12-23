import React from "react"
import { Table, Tag, Button } from "antd"
import { useNavigate } from "react-router-dom"

const Orders = () => {

  const navigate = useNavigate()

  const dataSource = [
    {
      key: "1",
      order: "24-1002",
      client: "Ромашка",
      //contact: "Иванов Иван",
      order_status: "В работе",
      pay_status: "Не оплачено",
      amount: "10 000,00",
      amount_dolg: "5 000,00",
      owner: "Глазунова Екатерина",
      order_date: "20.12.2024 13:40",
      description: "Компания: ООО Ромашка, Контакт: Иванов Иван Иванович",
    },
    {
      key: "2",
      order: "24-1004",
      client: "ИП Васильев И.С.",
      //contact: "Васильев Иван",
      order_status: "В работе",
      pay_status: "Оплачено",
      amount: "12 000,00",
      amount_dolg: "0,00",
      owner: "Глазунова Екатерина",
      order_date: "20.12.2024 13:32",
      description: "Hello",
    },
  ]

  const columns = [
    {
      title: "Заказ #",
      dataIndex: "order",
      key: "order",
      render: (text) => <a>{text}</a>,
      width: 120, //ширина колонки
      filters: [
        {
          text: "24-1002",
          value: "24-1002",
        },
        {
          text: "24-1004",
          value: "24-1004",
        },
      ],
      onFilter: (value, record) => record.order.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Клиент",
      dataIndex: "client",
      key: "client",
    },
    //{
    //  title: "Контакт",
    //  dataIndex: "contact",
    //  key: "contact",
    //  ellipsis: true, // сокращение если не влезают данные ...
    //},
    {
      title: "Статус заказа",
      dataIndex: "order_status",
      key: "order_status",
      width: 150, //ширина колонки
    },
    {
      title: "Статус оплаты",
      dataIndex: "pay_status",
      key: "pay_status",
      width: 150, //ширина колонки
      filtered: true,
    },
    {
      title: "Итого",
      dataIndex: "amount",
      key: "amount", 
    },
    {
      title: "Долг",
      dataIndex: "amount_dolg",
      key: "amount_dolg",
    },
    {
      title: "Менеджер",
      dataIndex: "owner",
      key: "owner",
    },
    {
      title: "Дата создания",
      dataIndex: "order_date",
      key: "order_date",
    },
  ]

  const onChange = (filters, sorter, extra) => {
    console.log("params", filters, sorter, extra)
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Заказы</h1>
        <Button type="primary" onClick={() => navigate("/orders/create")} >
          Создать заказ
        </Button>
      </div>
      <div style={{ flex: 1 }}>
        <Table
          //title={() => "Заказы"}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          //size="small"
          bordered={true}
          onChange={onChange}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>{record.description}</p>
            ),
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
        />
      </div>
    </div>
  )
}

export default Orders
