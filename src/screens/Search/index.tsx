import * as React from 'react'
import * as Cookies from 'js-cookie'
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
import * as moment from 'moment'
import * as ReactDOM from 'react-dom'
import {purchaseTicket, searchFlights} from "utils/http"

const { useState, useEffect } = React
const { Content, Footer } = Layout
let modal_key = 0

type PurchaseData = {
  flightNum: string,
  airlineName: string
}

type PurchaseModalType = {
  data: PurchaseData
}

type SearchResult = {
  airlineName: string,
  flightNum: string,
  departureAirport: string,
  arrivalAirport: string,
  departureTime: string,
  arrivalTime: string,
  price: number
}

const PurchaseModal: React.FC<PurchaseModalType> = props => {
  const [visible, setVisible] = useState<boolean>(true)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [modalText, setModalText] = useState<string>('Confirm purchase?')
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
    const postValues = {
      flightNum: props.data.flightNum,
      airlineName: props.data.airlineName,
    }
    const response = await purchaseTicket(postValues)
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


const SearchPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<SearchResult[] | null>(null)

  const fetchData = async (values) => {
    const response = await searchFlights(values)
    setDataSource(response.data)
  }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('day')
  }

  const handlePurchaseWithParam = (record) => {
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

  const onSearchFinish = (values) => {
    values.date = values.date.format('YYYY-MM-DD')
    fetchData(values)
  }

  const queryFlightColumns = [
    {
      title: 'Airline',
      dataIndex: 'airlineName',
      key: 'airlineName',
    },
    {
      title: 'Flight',
      dataIndex: 'flightNum',
      key: 'flightNum',
    },
    {
      title: 'Origin',
      dataIndex: 'departureAirport',
      key: 'departureAirport',
    },
    {
      title: 'Destination',
      key: 'arrivalAirport',
      dataIndex: 'arrivalAirport',
    },
    {
      title: 'Departure Time',
      key: 'departureTime',
      dataIndex: 'departureTime',
    },
    {
      title: 'Arrival Time',
      key: 'arrivalTime',
      dataIndex: 'arrivalTime',
    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'price',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handlePurchaseWithParam(record)}>Purchase</a>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    document.title = 'Search | AirTraveller - Excited to fly.'
    const srcCity = Cookies.get('srcCity')
    const dstCity = Cookies.get('dstCity')
    const depDate = Cookies.get('depDate')
    if ((srcCity && dstCity && depDate) !== null && (srcCity && dstCity && depDate) !== undefined) {
      Cookies.remove('srcCity')
      Cookies.remove('dstCity')
      Cookies.remove('depDate')
      fetchData({ srcCity, dstCity, date: depDate })
    }
  },[])

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
              onFinish={onSearchFinish}
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
                    name="srcAptName"
                    rules={[{ required: false, message: 'Departure Airport' }]}
                    style={{ width: '100%', margin: '0' }}
                  >
                    <Input size="large" placeholder="Departure Airport" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    name="dstAptName"
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
                    <DatePicker disabledDate={disabledDate} size="large" placeholder="Departure Date" style={{ width: '100%' }} />
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
                <Table columns={queryFlightColumns} dataSource={dataSource} />
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

export default SearchPage
