import React, { useState } from "react"
import { Routes, Route, Link, Navigate } from "react-router-dom"
import { Layout, Menu, Space, Dropdown } from "antd"
import { UserOutlined, PoweroffOutlined } from "@ant-design/icons"
import Clients from "./pages/Clients"
import CreateClient from "./pages/CreateClient"
import Orders from "./pages/Orders"
import authStore from "./store/authStore"

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
]

const MainApp = () => {
  const { email, logout } = authStore()

  // Логика для выхода
  const handleLogout = () => {
    logout()
    // Логика выхода, например, очистка токенов и редирект на страницу логина
  }

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          height: "48px",
          lineHeight: "48px",
          padding: "0px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          items={menuItems}
          defaultSelectedKeys={["1"]}
          style={{ height: "48px", lineHeight: "48px", marginLeft: "21px" }}
        />

        <Space
          style={{ color: "white", marginRight: "21px" }}
        >
          <UserOutlined style={{ fontSize: "20px" }} />
          {email}
          <PoweroffOutlined className="logout-icon" style={{ fontSize: "20px", marginLeft: "30px", cursor: "pointer" }} onClick={handleLogout}/>
        </Space>
      </Header>
      <Content style={{ padding: "20px", overflow: "auto" }}>
        <Routes>
          <Route path="/" element={<Navigate to="clients" replace />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/create" element={<CreateClient />} />
          <Route path="orders" element={<Orders />} />
        </Routes>
      </Content>
      <Footer
        style={{ textAlign: "center", padding: "10px 0", fontSize: "12px" }}
      >
        CRM JustLable ©2024
      </Footer>
    </Layout>
  )
}

export default MainApp
