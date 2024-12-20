import "./app.scss"
import { Table } from "antd"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons"
import { Button, Layout, Menu, theme } from "antd"
import { useState } from "react"

const { Header, Sider, Content } = Layout

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const dataSource = [
    {
      key: "1",
      order: "24-1002",
      client: "Ромашка",
      contact: "Иванов Иван",
      order_status: "В работе",
      pay_status: "Не оплачено",
      amount: "10 000,00",
      amount_dolg:'5 000,00',
      owner: "Глазунова Екатерина",
      order_date: "20.12.2024 13:40",
    },
    {
      key: "2",
      order: "24-1004",
      client: "ИП Васильев И.С.",
      contact: "Васильев Иван",
      order_status: "В работе",
      pay_status: "Оплачено",
      amount: "12 000,00",
      amount_dolg:'0,00',
      owner: "Глазунова Екатерина",
      order_date: "20.12.2024 13:32",
    },
  ]

  const columns = [
    {
      title: "Заказ #",
      dataIndex: "order",
      key: "order",
      render: (text) => <a>{text}</a>,
      width: 120, //ширина колонки
    },
    {
      title: "Клиент",
      dataIndex: "client",
      key: "client",
    },
    {
      title: "Контакт",
      dataIndex: "contact",
      key: "contact",
      ellipsis: true, // сокращение если не влезают данные ...
    },
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
      title: "Дата заказа",
      dataIndex: "order_date",
      key: "order_date",
    },
  ]
  //<Table dataSource={dataSource} columns={columns} />
  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: "Дашборд",
              },
              {
                key: "2",
                icon: <VideoCameraOutlined />,
                label: "Заказы",
              },
              {
                key: "3",
                icon: <UploadOutlined />,
                label: "Клиенты",
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              size="small"
            />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default App
