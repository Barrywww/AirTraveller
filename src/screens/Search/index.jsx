import React from 'react'
import Cookies from 'js-cookie'
import {
  Layout,
  Breadcrumb,
  Row,
  Col,
  Button,
  Input,
  Form,
  DatePicker,
  Table, Space, Modal,
} from 'antd'
import { MainHeader, TravelAlert } from 'screens/Home'

import 'antd/dist/antd.compact.less'
import 'screens/User/Login/index.less'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import ReactDOM from 'react-dom'

const { Content, Footer } = Layout
let modal_key = 0

function PurchaseModal(props) {
  const [visible, setVisible] = React.useState(true)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [modalText, setModalText] = React.useState('Confirm purchase?')
  const handleOk = () => {
    setModalText('Purchase Success!')
    setConfirmLoading(true)
    setTimeout(() => {
      setVisible(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleFailed = () => {
    setModalText('Purchase Failed! Please try again!')
    setConfirmLoading(true)
    setTimeout(() => {
      setVisible(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const onFinish = async () => {
    console.log('on finish')
    // console.log(props.data);
    const post_values = {
      flightNum: props.data.flight_num,
      airlineName: props.data.airline_name,
    }
    console.log(post_values)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post_values),
      credentials: 'include',
    }
    const response = await fetch('http://localhost:3000/api/customer/purchase', requestOptions)
    if (response.status === 200) {
      handleOk()
    } else {
      handleFailed()
    }
  }

  const onFinishFailed = () => {
    alert('Please check the required fields!')
  }

  return (
    <Form
      name="basic1"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Modal
        title="Purchase Ticket"
        visible={visible}
        okButtonProps={{ htmlType: 'submit' }}
        onOk={onFinish}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </Form>
  )
}

class SearchPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { srcCity: '', dstCity: '' }
  }

  componentDidMount() {
    document.title = 'Search | AirTraveller - Excited to fly.'
    const srcCity = Cookies.get('srcCity')
    const dstCity = Cookies.get('dstCity')
    const depDate = Cookies.get('depDate')
    if ((srcCity && dstCity && depDate) !== null && (srcCity && dstCity && depDate) !== undefined) {
      Cookies.remove('srcCity')
      Cookies.remove('dstCity')
      Cookies.remove('depDate')
      this.fetchData({ srcCity, dstCity, date: depDate })
    }
  }

  async fetchData(values) {
    let response
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      credentials: 'include',
    }
    response = await fetch('http://localhost:3000/api/search/flight', requestOptions).then((response) => response.json())
    console.log(response)
    for (let i = 0; i < response.length; i++) {
      response[i].departure_time = response[i].departure_time.slice(0, -5)
      response[i].arrival_time = response[i].arrival_time.slice(0, -5)
    }
    this.setState({ data: response })
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().startOf('day')
  }

  handlePurchaseWithParam(record) {
    if (Cookies.get('userLoggedIn') === 'true') {
      modal_key += 1
      ReactDOM.render(<PurchaseModal
        key={modal_key}
        data={record}
      />, document.getElementById('purchaseModalHolder'))
    } else {
      alert('Please login first!')
    }
  }

  render() {
    const onFinish = (values) => {
      values.date = values.date.format('YYYY-MM-DD')
      this.fetchData(values)
      this.setState({ data: [] })
    }

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo)
    }

    const queryFlightColumns = [
      {
        title: 'Airline',
        dataIndex: 'airline_name',
        key: 'airline_name',
      },
      {
        title: 'Flight',
        dataIndex: 'flight_num',
        key: 'flight_num',
      },
      {
        title: 'Origin',
        dataIndex: 'departure_airport',
        key: 'departure_airport',
      },
      {
        title: 'Destination',
        key: 'arrival_airport',
        dataIndex: 'arrival_airport',
      },
      {
        title: 'Departure Time',
        key: 'departure_time',
        dataIndex: 'departure_time',
      },
      {
        title: 'Arrival Time',
        key: 'arrival_time',
        dataIndex: 'arrival_time',
      },
      {
        title: 'Price',
        key: 'price',
        dataIndex: 'price',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <a onClick={this.handlePurchaseWithParam.bind(this, record)}>Purchase</a>
          </Space>
        ),
      },
    ]

    return (
      <Layout style={{ minHeight: '100%', maxWidth: '100%' }}>
        <div id="purchaseModalHolder" />
        <MainHeader />
        <TravelAlert />
        <div style={{ padding: '0 100px' }}>
          <Content style={{
            background: '#f0f2f5', maxWidth: '1350px', margin: 'auto', width: '100%',
          }}
          >
            <Breadcrumb style={{ margin: '14px 0' }}>
              <Breadcrumb.Item>
                <NavLink to="/">Home</NavLink>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Search</Breadcrumb.Item>
            </Breadcrumb>
            <div id="searchPageWrapper">
              <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Row
                  gutter={{
                    xs: 8, sm: 16, md: 24, lg: 32,
                  }}
                  justify="space-between"
                  style={{ padding: '10px 0', width: '100%', margin: '0' }}
                >
                  <Col span={4}>
                    <Form.Item
                      name="srcCity"
                      rules={[{ required: false, message: 'Departure City' }]}
                      style={{ width: '100%', margin: '0' }}
                    >
                      <Input size="large" placeholder="Departure City" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="dstCity"
                      rules={[{ required: false, message: 'Arrival City' }]}
                      style={{ width: '100%', margin: '0' }}
                    >
                      <Input size="large" placeholder="Arrival City" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="srcaptName"
                      rules={[{ required: false, message: 'Departure Airport' }]}
                      style={{ width: '100%', margin: '0' }}
                    >
                      <Input size="large" placeholder="Departure Airport" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="dstaptName"
                      rules={[{ required: false, message: 'End Date' }]}
                      style={{ width: '100%', margin: '0' }}
                    >
                      <Input size="large" placeholder="Arrival Airport" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="date"
                      rules={[{ required: true, message: 'Date' }]}
                      style={{ width: '100%', margin: '0' }}
                    >
                      <DatePicker disabledDate={this.disabledDate} size="large" placeholder="Departure Date" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="submit"
                      rules={[{ required: false, message: 'Departure Airport' }]}
                      style={{ width: '100%', margin: '0' }}
                    >
                      <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>→Search</Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Row
                gutter={{
                  xs: 8, sm: 16, md: 24, lg: 32,
                }}
                justify="space-between"
                style={{ padding: '10px 0', width: '100%', margin: '0' }}
              >
                <Col span={24}>
                  <Table columns={queryFlightColumns} dataSource={this.state.data} />
                </Col>
              </Row>
            </div>
            <Footer style={{
              padding: '24px 0', position: 'fixed', bottom: '0', width: '100%',
            }}
            >
              Copyright © 2020 AirTraveller Limited
            </Footer>
          </Content>
        </div>
      </Layout>
    )
  }
}

export default SearchPage