import React from "react"
import { Routes, Route, Link } from "react-router-dom"
import { Layout, Menu } from "antd"
import Clients from "./pages/Clients"
import CreateClient from "./pages/CreateClient";
import Orders from "./pages/Orders"

const { Header, Content, Footer } = Layout

const MainApp = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ height: "48px", lineHeight: "48px", padding: "0px"}}>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} style={{ height: "48px", lineHeight: "48px", marginLeft:"20px" }}>
          <Menu.Item key="1">
            <Link to="/clients">Клиенты</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/orders">Заказы</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/">Поставщики</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "20px", overflow: "auto" }}>
        <Routes>
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/create" element={<CreateClient />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: "center", padding: "10px 0", fontSize: "12px" }}>CRM JustLable ©2024</Footer>
    </Layout>

  )
}

export default MainApp
