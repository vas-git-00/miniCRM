import React from "react"
import { Routes, Route, Link, Navigate } from "react-router-dom"
import { Layout, Menu } from "antd"
import Clients from "./pages/Clients"
import CreateClient from "./pages/CreateClient";
import Orders from "./pages/Orders"

const { Header, Content, Footer } = Layout

const menuItems = [
  {
    key: "1",
    label: <Link to="/clients">Клиенты</Link>,
  },
  {
    key: "2",
    label: <Link to="/orders">Заказы</Link>,
  },
];

const MainApp = () => {

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ height: "48px", lineHeight: "48px", padding: "0px"}}>
        <Menu theme="dark" mode="horizontal" items={menuItems} defaultSelectedKeys={["1"]} style={{ height: "48px", lineHeight: "48px", marginLeft:"20px" }} />
      </Header>
      <Content style={{ padding: "20px", overflow: "auto" }}>
        <Routes>
          <Route path="/" element={<Navigate to="clients" replace /> } />
          <Route path="clients" element={ <Clients /> } />
          <Route path="clients/create" element={ <CreateClient /> } />
          <Route path="orders" element={ <Orders />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: "center", padding: "10px 0", fontSize: "12px" }}>CRM JustLable ©2024</Footer>
    </Layout>

  )
}

export default MainApp
