import {
  Layout, Menu, Form, Input, Button, Row, Col, Dropdown,
} from 'antd'
import { IdcardOutlined, TeamOutlined, DownOutlined } from '@ant-design/icons'
import React from 'react'
import { Route, Switch, NavLink } from 'react-router-dom'
import Cookies from 'js-cookie'
import AgentPage from 'screens/Agent'
import StaffPage from 'screens/Staff'
import Logo from 'res/logo_2.png'
import Background from 'res/main_bg_1.jpg'

import './index.less'

const adminTypes = ['Booking Agent', 'Airline Staff']

class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { adminType: undefined }
  }

  handleRegisChange(type) {
    this.setState({ adminType: type })
  }

  async adminClick(values) {
    const wrappedVals = { ...values }
    const { adminType } = this.state
    wrappedVals.email = values.username
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wrappedVals),
      credentials: 'include',
    }
    wrappedVals.email = values.username
    let response
    if (adminType === adminTypes[0]) {
      response = await fetch('http://localhost:3000/api/login/agent', requestOptions)
    } else if (adminType === adminTypes[1]) {
      response = await fetch('http://localhost:3000/api/login/staff', requestOptions)
    }

    if (response.status === 200) {
      if (adminType === adminTypes[0]) {
        await Cookies.set('adminRole', adminTypes[0])
        await Cookies.set('adminID', wrappedVals.email)
        await Cookies.set('adminLoggedIn', true)
        // await alert('Login Success');
        this.props.history.push('/admin/agent')
      } else if (this.state.adminType === adminTypes[1]) {
        await Cookies.set('adminRole', adminTypes[1])
        await Cookies.set('adminID', wrappedVals.username)
        await Cookies.set('adminLoggedIn', true)
        // await alert('Login Success');
        this.props.history.push('/admin/staff')
      } else {
        alert('Unauthorized Login!')
      }
    } else {
      alert('Login Failed')
    }
  }

  render() {
    let buttonPlaceholder
    if (this.state.adminType === undefined) {
      buttonPlaceholder = 'Login as...'
    } else {
      buttonPlaceholder = this.state.adminType
    }

    const aTypes = (
      <Menu>
        <Menu.Item key="1" icon={<TeamOutlined />} onClick={this.handleRegisChange.bind(this, adminTypes[0])}>
          {adminTypes[0]}
        </Menu.Item>
        <Menu.Item key="2" icon={<IdcardOutlined />} onClick={this.handleRegisChange.bind(this, adminTypes[1])}>
          {adminTypes[1]}
        </Menu.Item>
      </Menu>
    )

    const onFinish = (values) => {
      console.log('Success:', values)
      this.adminClick(values)
    }
    return (
      <Layout style={{ overflow: 'hidden' }}>
        <img id="adminLogin" src={Background} />
        <div id="loginWrapper">
          <Layout style={{ height: '100%', width: '100%', backgroundColor: 'rgba(255,255,255,0)' }}>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Row justify="space-around">
                <Col>
                  <Row justify="center">
                    <NavLink to="/">
                      <img id="adminLogoHolder" alt="AirTraveller" src={Logo} />
                    </NavLink>
                  </Row>
                  <Row justify="center">
                    <p style={{ fontSize: '1.5rem' }}>Administration Portal</p>
                  </Row>
                  <Row>
                    <Dropdown overlay={aTypes} trigger="click">
                      <Button style={{ width: '100%', margin: '10px 0' }}>
                        {buttonPlaceholder}
                        {' '}
                        <DownOutlined />
                      </Button>
                    </Dropdown>
                  </Row>
                  <Row>
                    <Form.Item
                      name="username"
                      rules={[
                        { required: true, message: 'Please input your username/email!' },
                      ]}
                      style={{ width: '100%', margin: '10px 0' }}
                    >
                      <Input placeholder="Username/Email" style={{ width: '100%' }} />
                    </Form.Item>
                  </Row>
                  <Row>
                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: 'Please input your password!' },
                      ]}
                      style={{ width: '100%', margin: '10px 0' }}
                    >
                      <Input.Password placeholder="Password" style={{ width: '100%' }} />
                    </Form.Item>
                  </Row>
                  <Row>
                    <Form.Item style={{ width: '100%' }}>
                      <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Login
                      </Button>
                    </Form.Item>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Layout>
        </div>
      </Layout>
    )
  }
}

export function AdminRouter({ match }) {
  return (
    <Route>
      <Switch>
        <Route exact path={match.path} component={LoginPage} />
        <Route exact path={`${match.path}/agent`} component={AgentPage} />
        <Route exact path={`${match.path}/staff`} component={StaffPage} />
      </Switch>
    </Route>
  )
}

export default AdminRouter
