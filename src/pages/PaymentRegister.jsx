import React, { useState } from "react";
import {
  Table,
  Button,
  Drawer,
  Input,
  Form,
  Row,
  Col,
  Switch,
} from "antd";
import { useNavigate } from "react-router-dom";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const PaymentRegister = () => {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const dataSource = [
    {
      key: "1",
      payment: "10004",
      order: "24-1002",
      client: "Ромашка",
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
      payment: "10005",
      order: "24-1004",
      client: "ИП Васильев И.С.",
      order_status: "В работе",
      pay_status: "Оплачено",
      amount: "12 000,00",
      amount_dolg: "0,00",
      owner: "Глазунова Екатерина",
      order_date: "20.12.2024 13:32",
      description: "Hello",
    },
  ];

  const columns = [
    {
      title: "Платеж #",
      dataIndex: "payment",
      key: "payment",
      width: 120,
      render: (text) => <a onClick={() => handlePaymentClick(text)}>{text}</a>,
    },
    {
      title: "Заказ #",
      dataIndex: "order",
      key: "order",
      width: 120,
    },
    {
      title: "Контрагент",
      dataIndex: "counterparty",
      key: "counterparty",
    },
    {
      title: "Тип платежа",
      dataIndex: "payment_type",
      key: "payment_type",
      width: 150,
    },
    {
      title: "Способ оплаты",
      dataIndex: "payment_method",
      key: "payment_method",
      width: 150,
    },
    {
      title: "Статус платежа",
      dataIndex: "payment_status",
      key: "payment_status",
      width: 150,
    },
    {
      title: "Сумма платежа",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Менеджер",
      dataIndex: "owner",
      key: "owner",
    },
    {
      title: "Дата создания",
      dataIndex: "payment_date",
      key: "payment_date",
    },
  ];

  const handlePaymentClick = (payment) => {
    const paymentData = dataSource.find((item) => item.payment === payment);
    setSelectedPayment(paymentData);
    setDrawerVisible(true);
  };

  const handleApprove = () => {
    console.log("Платеж утвержден");
  };

  const handleCancel = () => {
    console.log("Платеж отменен");
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  // Логика изменения состояния переключателей
  const handleSwitch1Change = (checked) => {
    if (checked) {
      setChecked1(true);
      setChecked2(false); // Если включен первый, выключаем второй
    } else {
      setChecked1(false);
    }
  };

  const handleSwitch2Change = (checked) => {
    if (checked) {
      setChecked2(true);
      setChecked1(false); // Если включен второй, выключаем первый
    } else {
      setChecked2(false);
    }
  };

  // Логика активации кнопок
  const isApproveButtonDisabled = !(checked1 && !checked2); // Кнопка активна только при включенном первом переключателе и выключенном втором
  const isCancelButtonDisabled = !(checked2 && !checked1); // Кнопка активна только при включенном втором переключателе и выключенном первом

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
        <h1 style={{ margin: 0 }}>Реестр платежей</h1>
        <Button
          type="primary"
          onClick={() => navigate("/payments/create")}
          disabled
        >
          Создать платеж
        </Button>
      </div>
      <div style={{ flex: 1 }}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered={true}
        />
      </div>

      {/* Drawer для отображения деталей платежа */}
      <Drawer
        title={`Платеж #${selectedPayment?.payment}`}
        width={600}
        open={drawerVisible}
        onClose={handleDrawerClose}
        style={{ paddingBottom: 50 }}
      >
        <Form layout="vertical">
          {/* Размещаем ID Платежа и Номер заказа в одной строке */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ID Платежа">
                <Input value={selectedPayment?.payment} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Номер заказа">
                <Input value={selectedPayment?.order} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Тип платежа">
                <Input value={selectedPayment?.payment_type} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Статус платежа">
                <Input value={selectedPayment?.payment_status} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Способ оплаты">
            <Input value={selectedPayment?.payment_method} disabled />
          </Form.Item>

          <Form.Item label="Контрагент">
            <Input value={selectedPayment?.client} disabled />
          </Form.Item>

          <Form.Item label="Сумма платежа">
            <Input value={selectedPayment?.amount} disabled />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Галочка 1">
                <Switch
                  checked={checked1}
                  onChange={handleSwitch1Change}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Галочка 2">
                <Switch
                  checked={checked2}
                  onChange={handleSwitch2Change}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item>
                <Button
                  type="primary"
                  disabled={isApproveButtonDisabled} // кнопка активна только при включенном первом переключателе и выключенном втором
                  onClick={handleApprove}
                >
                  Утвердить платеж
                </Button>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <Button
                  danger
                  disabled={isCancelButtonDisabled} // кнопка активна только при включенном втором переключателе и выключенном первом
                  onClick={handleCancel}
                >
                  Отменить платеж
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default PaymentRegister;