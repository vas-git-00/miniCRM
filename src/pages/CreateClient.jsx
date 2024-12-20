import React, { useState } from "react"
import { Form, Input, Button, Card, Space, Row, Col } from "antd"
import { DeleteOutlined, MinusCircleOutlined } from "@ant-design/icons"

const CreateClient = () => {
  const [contacts, setContacts] = useState([])
  const [companies, setCompanies] = useState([])
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);

  //<MinusCircleOutlined onClick={() => removeDeliveryAddress(address.id)} />

  // Логика для добавления и удаления контактов
  const addContact = () => {
    setContacts([
      ...contacts,
      {
        id: Date.now(),
        surName: "",
        firstName: "",
        middleName: "",
        email: "",
        mobPhone: "",
        cityPhone: "",
        
      },
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

  // Логика для добавления и удаления адресов доставки
  const addDeliveryAddress = () => {
    setDeliveryAddresses([
      ...deliveryAddresses,
      {
        id: Date.now(),
        address: "",
      },
    ]);
  };

  const removeDeliveryAddress = (id) => {
    setDeliveryAddresses(
      deliveryAddresses.filter((address) => address.id !== id)
    );
  };


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
          <Row gutter={16}>
            <Col span={4}>
              <Form.Item name="clientCode" label="Код клиента">
                <Input placeholder="" disabled />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="clientName"
                label="Название клиента"
                rules={[
                  { required: true, message: "Введите название клиента!" },
                ]}
                //style={{ flex: 1 }} // Увеличиваем ширину в 2 раза
              >
                <Input placeholder="Название клиента" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Блок 2: Контакты */}
        <Card title="Контакты" style={{ marginBottom: "14px" }}>
          {contacts.map((contact, index) => (
            <Row
              key={contact.id}
              style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}
              gutter={16}
            >
              <Col span={4}>
                <Form.Item
                  name={`contacts[${index}].surName`}
                  label="Фамилия"
                  rules={[{ required: true, message: "Введите фамилию!" }]}
                >
                  <Input placeholder="Фамилия" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name={`contacts[${index}].firstName`}
                  label="Имя"
                  rules={[{ required: true, message: "Введите имя!" }]}
                >
                  <Input placeholder="Имя" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name={`contacts[${index}].middleName`}
                  label="Отчество"
                  rules={[{ required: true, message: "Введите отчество!" }]}
                >
                  <Input placeholder="Отчество" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name={`contacts[${index}].email`}
                  label="Email"
                  rules={[{ required: true, message: "Введите email!" }]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item
                  name={`contacts[${index}].mobPhone`}
                  label="Мобильный"
                  rules={[{ required: true, message: "Введите мобильный телефон!" }]}
                >
                  <Input placeholder="Мобильный" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item
                  name={`contacts[${index}].cityPhone`}
                  label="Городской"
                  rules={[{ required: true, message: "Введите городской телефон!" }]}
                >
                  <Input placeholder="Городской" />
                </Form.Item>
              </Col>
              
              <Col span={1} style={{ display: "flex", alignItems: "center" }}>
                <DeleteOutlined
                  onClick={() => removeContact(contact.id)}
                  style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
                />
              </Col>
            </Row>
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
                  companies.length > 0 && (
                    <DeleteOutlined
                      onClick={() => removeCompany(company.id)}
                      style={{
                        color: "red",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
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
                        {
                          required: true,
                          message: "Введите название компании!",
                        },
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
                  <Row
                    key={requisiteIndex}
                    gutter={16}
                    style={{ marginBottom: "8px" }}
                  >
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
                          {
                            required: true,
                            message: "Введите расчетный счет!",
                          },
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
                    <Col
                      span={1}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <DeleteOutlined
                        onClick={() =>
                          removeRequisite(company.id, requisiteIndex)
                        }
                        style={{
                          color: "red",
                          fontSize: "20px",
                          cursor: "pointer",
                        }}
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
          {deliveryAddresses.map((address, index) => (
            <Row
              key={address.id}
              style={{
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
              }}
              gutter={16}
            >
              <Col span={22}>
                <Form.Item
                  name={`deliveryAddresses[${index}].address`}
                  label={`Адрес ${index + 1}`}
                  rules={[{ required: true, message: "Введите адрес!" }]}
                >
                  <Input
                    placeholder="Адрес доставки"
                    value={address.address}
                    onChange={(e) => {
                      const updatedAddresses = [...deliveryAddresses];
                      updatedAddresses[index].address = e.target.value;
                      setDeliveryAddresses(updatedAddresses);
                    }}
                  />
                </Form.Item>
                
              </Col>
              <Col span={1}>
                
                <DeleteOutlined
                  onClick={() => removeDeliveryAddress(address.id)}
                  style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
                />
              </Col>
            </Row>
          ))}
          <Button type="dashed" onClick={addDeliveryAddress} block>
            Добавить адрес
          </Button>
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateClient
