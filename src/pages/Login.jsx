import React, { useState } from "react"
import { Form, Input, Button, Card } from "antd"

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false)

  const handleFinish = (values) => {
    setLoading(true)

    // Пример проверки (можно заменить на запрос к API)
    setTimeout(() => {
      if (values.username === "admin" && values.password === "123456") {
        onLogin(true) // Успешная авторизация
      } else {
        alert("Неверное имя пользователя или пароль")
      }
      setLoading(false)
    }, 1000)
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
        <Form name="login" onFinish={handleFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Введите имя пользователя!" }]}
          >
            <Input placeholder="Имя пользователя" />
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
