import React from "react"
import { Table, Button } from "antd"
import { useNavigate } from "react-router-dom"

const dataSource = [
  {
    key: "1",
    clientCod: "CODE-1",
    client: "ООО Ромашка",
    orderCount: "2",
    clientStatus: "Повторный",
    clientType: "Юр.лицо",
    clientOwner: "Екатерина Глазунова",
    clientDateCreate: "20.12.2024 12:22",
  },
  {
    key: "2",
    clientCod: "CODE-2",
    client: "ИП Статкевич В.В.",
    orderCount: "0",
    clientStatus: "Новый",
    clientType: "Юр.лицо",
    clientOwner: "Екатерина Глазунова",
    clientDateCreate: "20.12.2024 15:00",
  },
  {
    key: "3",
    clientCod: "CODE-3",
    client: "Савельев Вячеслав",
    orderCount: "5",
    clientStatus: "Повторный",
    clientType: "Физ.лицо",
    clientOwner: "Екатерина Глазунова",
    clientDateCreate: "21.12.2024 12:00",
  },
]

const columns = [
  { title: "Код", dataIndex: "clientCod", key: "clientCod" },
  { title: "Клиент", dataIndex: "client", key: "client" },
  { title: "Кол-во заказов", dataIndex: "orderCount", key: "orderCount" },
  { title: "Статус клиента", dataIndex: "clientStatus", key: "clientStatus" },
  { title: "Тип клиента", dataIndex: "clientType", key: "clientType" },
  { title: "Менеджер", dataIndex: "clientOwner", key: "clientOwner" },
  { title: "Дата создания", dataIndex: "clientDateCreate", key: "clientDateCreate" },
]

const Clients = () => {
  const navigate = useNavigate()

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
        <h1 style={{ margin: 0 }}>Клиенты</h1>
        <Button type="primary" onClick={() => navigate("/clients/create")}>
          Создать клиента
        </Button>
      </div>
      <div style={{ flex: 1 }}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered={true}
          //pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  )
}

export default Clients
