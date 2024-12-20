import React, { useState } from "react"
import { Form, Input, Button, Card, Space, Row, Col } from "antd"
import { DeleteOutlined } from '@ant-design/icons';

const CreateClient = () => {
  const [contacts, setContacts] = useState([
    { id: 1, surName: "", firstName: "", middleName: "", phone: "", email: "" },
  ])
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "",
      inn: "",
      kpp: "",
      requisites: [
        { bank: "", bic: "", account: "", correspondentAccount: "" },
      ],
    },
  ])

  // Логика для добавления и удаления контактов
  const addContact = () => {
    setContacts([
      ...contacts,
      { id: Date.now(), surName: "", firstName: "", middleName: "", phone: "", email: "" },
    ])
  }

  const removeContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
  }

  // Логика для добавления и удаления компаний
  const addCompany = () => {
    setCompanies([
      ...companies,
      {
        id: Date.now(),
        name: "",
        inn: "",
        kpp: "",
        requisites: [
          { bank: "", bic: "", account: "", correspondentAccount: "" },
        ],
      },
    ])
  }

  const removeCompany = (id) => {
    setCompanies(companies.filter((company) => company.id !== id))
  }

  // Логика для добавления и удаления реквизитов
  const addRequisite = (companyId) => {
    setCompanies(
      companies.map((company) => {
        if (company.id === companyId) {
          company.requisites.push({
            bank: "",
            bic: "",
            account: "",
            correspondentAccount: "",
          })
        }
        return company
      })
    )
  }

  const removeRequisite = (companyId, requisiteIndex) => {
    setCompanies(
      companies.map((company) => {
        if (company.id === companyId) {
          company.requisites = company.requisites.filter(
            (_, index) => index !== requisiteIndex
          )
        }
        return company
      })
    )
  }

  const onFinish = (values) => {
    console.log("Форма отправлена:", values)
    alert("Клиент создан успешно!")
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
        <h1 style={{ margin: 0 }}>Новый клиент</h1>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        {/* Блок 1: Основная информация */}
        <Card title="Основная информация" style={{ marginBottom: "14px" }}>
          <Space style={{ display: "flex"}} align="start">
           
            <Row gutter={16}>

              <Col span={6}>
                <Form.Item name="clientCode" label="Код клиента">
                  <Input placeholder="" disabled />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name="clientName"
                  label="Название клиента"
                  rules={[{ required: true, message: "Введите название клиента!" }]}
                  //style={{ flex: 1 }} // Увеличиваем ширину в 2 раза
                >
                    <Input placeholder="Название клиента" />
                  </Form.Item>
              </Col>
            
            </Row>

          </Space>
        </Card>

        
                   
        {/* Блок 2: Контакты */}
        <Card title="Контакты" style={{ marginBottom: "14px" }}>
          {contacts.map((contact, index) => (
            <Space
              key={contact.id}
              style={{ display: "flex", marginBottom: "8px" }}
              align="baseline"
            >
              <Form.Item
                name={`contacts[${index}].surName`}
                label="Фамилия"
                rules={[{ required: true, message: "Введите фамилию!" }]}
              >
                <Input placeholder="Фамилия" />
              </Form.Item>
              <Form.Item
                name={`contacts[${index}].firstName`}
                label="Имя"
                rules={[{ required: true, message: "Введите имя!" }]}
              >
                <Input placeholder="Имя" />
              </Form.Item>
              <Form.Item
                name={`contacts[${index}].MiddleName`}
                label="Отчество"
                rules={[{ required: true, message: "Введите отчество!" }]}
              >
                <Input placeholder="Отчество" />
              </Form.Item>
              <Form.Item
                name={`contacts[${index}].phone`}
                label="Телефон"
                rules={[{ required: true, message: "Введите телефон!" }]}
              >
                <Input placeholder="Телефон" />
              </Form.Item>
              <Form.Item
                name={`contacts[${index}].email`}
                label="Email"
                rules={[{ required: true, message: "Введите email!" }]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Button
                type="link"
                onClick={() => removeContact(contact.id)}
                danger
              >
                Удалить
              </Button>
            </Space>
          ))}
          <Button type="dashed" onClick={addContact} block>
            Добавить контакт
          </Button>
        </Card>

        {/* Блок 3: Компании */}
        <Card title="Компании" style={{ marginBottom: "14px" }}>
          {companies.map((company, index) => (
            <div key={company.id} style={{ marginBottom: "14px" }}>
              <Card
                title={`Компания ${index + 1}`}
                extra={
                  companies.length > 1 && (

                    <DeleteOutlined
                    onClick={() => removeCompany(company.id)}
                    style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
                  />
                  )
                }
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name={`companies[${index}].name`}
                      label="Название компании"
                      rules={[
                        { required: true, message: "Введите название компании!" },
                      ]}
                    >
                      <Input placeholder="Название компании" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={`companies[${index}].inn`}
                      label="ИНН"
                      rules={[{ required: true, message: "Введите ИНН!" }]}
                    >
                      <Input placeholder="ИНН" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={`companies[${index}].kpp`}
                      label="КПП"
                      rules={[{ required: true, message: "Введите КПП!" }]}
                    >
                      <Input placeholder="КПП" />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Реквизиты для компании */}
                {company.requisites.map((requisite, requisiteIndex) => (
                  <Row key={requisiteIndex} gutter={16} style={{ marginBottom: "8px" }}>
                  <Col span={8}>
                    <Form.Item
                      name={`companies[${index}].requisites[${requisiteIndex}].bank`}
                      label="Банк"
                      rules={[{ required: true, message: "Введите банк!" }]}
                    >
                      <Input placeholder="Банк" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name={`companies[${index}].requisites[${requisiteIndex}].bic`}
                      label="БИК"
                      rules={[{ required: true, message: "Введите БИК!" }]}
                    >
                      <Input placeholder="БИК" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      name={`companies[${index}].requisites[${requisiteIndex}].account`}
                      label="Р/С"
                      rules={[
                        { required: true, message: "Введите расчетный счет!" },
                      ]}
                    >
                      <Input placeholder="Р/С" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      name={`companies[${index}].requisites[${requisiteIndex}].correspondentAccount`}
                      label="Корреспондентский счет"
                      rules={[
                        {
                          required: true,
                          message: "Введите корреспондентский счет!",
                        },
                      ]}
                    >
                      <Input placeholder="Корреспондентский счет" />
                    </Form.Item>
                  </Col>
                  <Col span={2} style={{ display: "flex", alignItems: "center" }}>
                    <DeleteOutlined
                      onClick={() => removeRequisite(company.id, requisiteIndex)}
                      style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
                    />
                  </Col>
                </Row>
                ))}
                <Button
                  type="dashed"
                  onClick={() => addRequisite(company.id)}
                  block
                >
                  Добавить реквизиты
                </Button>
              </Card>
            </div>
          ))}
          <Button type="dashed" onClick={addCompany} block>
            Добавить компанию
          </Button>
        </Card>

        {/* Блок 4: Адреса доставки */}
        <Card title="Адреса доставки" style={{ marginBottom: "14px" }}>
          <Form.Item
            name="deliveryAddress"
            label="Адрес доставки"
            rules={[{ required: true, message: "Введите адрес!" }]}
          >
            <Input placeholder="Адрес доставки" />
          </Form.Item>
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Сохранить клиента
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateClient