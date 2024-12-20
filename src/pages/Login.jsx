import React, { useState } from "react"
import { Form, Input, Button, Card } from "antd"
import authStore from "../store/authStore"

const Login = () => {
  const [loading, setLoading] = useState(false)
  const { login } = authStore()

  const handleFinish = (values) => {
    setLoading(true)

    // Пример проверки (можно заменить на запрос к API)
    
      if (values.email === "admin@mail.ru" && values.password === "123456") {
        // Успешная авторизация
        login(values.email)
      } else {
        alert("Неверный email или пароль!")
      }
      setLoading(false)
   
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card title="Авторизация" style={{ width: 300 }}>
        <Form name="email" onFinish={handleFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Введите email'!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Введите пароль!" }]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
