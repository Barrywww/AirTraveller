import React from 'react';
import Cookies from "js-cookie";

import {Breadcrumb, Button, Col, DatePicker, Dropdown, Form, Input, Layout, Menu, Row} from 'antd';
import {
    DownOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    IdcardOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import {MainHeader, TravelAlert} from "./index";

import 'antd/dist/antd.compact.less'
import '../css/registration.less'
import {NavLink} from "react-router-dom";
import {createBrowserHistory} from "history";

const {Content, Footer} = Layout;

const userTypes = ["AirTraveller Club Member", "Booking Agent", "Airline Staff"];

let history = createBrowserHistory();

class RegistrationFields extends React.Component{
    async regisClick (values){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        };
        let response;
        if (this.state.regisType === userTypes[0]){
            response = await fetch('http://localhost:3000/api/register/customer', requestOptions)
        }
        else if(this.state.regisType === userTypes[1]){
            response = await fetch('http://localhost:3000/api/register/agent', requestOptions);
        }
        else if (this.state.regisType === userTypes[2]){
            response = await fetch('http://localhost:3000/api/register/staff', requestOptions);
        }
        else{
            alert("Registration Failed!");
            return
        }
        if(response.status === 200 ){
            alert('Registration Success');
            history.push("/login");
            history.go();
        }else{
            alert("Registration Failed");
        }
    }

    constructor(props) {
        super(props);
        this.state = {regisType: undefined}
    }

    handleRegisChange(type){
        this.setState({regisType: type});
    }

    render() {
        let buttonPlaceholder;
        let selectedField = "";
        if (this.state.regisType === undefined){
            buttonPlaceholder = "Register as...";
        }
        else{
            buttonPlaceholder = this.state.regisType;
        }

        const onFinish = values => {
            console.log("on finish");
            if (values["password"] !== values["confirmPassword"]){
                alert("Please double check your password!");
                return;
            }
            // console.log(values);
            if (values["dateOfBirth"]) {
                values["dateOfBirth"] = values["dateOfBirth"].format("YYYY-MM-DD");
            }
            if (values["passportExpiration"]) {
                values["passportExpiration"] = values["passportExpiration"].format("YYYY-MM-DD");
            }
            console.log(values);
            this.regisClick(values);
        };

        const onFinishFailed = errorInfo => {
            alert("Please check the required fields!");
        };


        const rTypes = (
            <Menu>
                <Menu.Item key="1" icon={<UserOutlined />} onClick={this.handleRegisChange.bind(this, userTypes[0])}>
                    {userTypes[0]}
                </Menu.Item>
                <Menu.Item key="2" icon={<TeamOutlined />} onClick={this.handleRegisChange.bind(this, userTypes[1])}>
                    {userTypes[1]}
                </Menu.Item>
                <Menu.Item key="3" icon={<IdcardOutlined />} onClick={this.handleRegisChange.bind(this, userTypes[2])}>
                    {userTypes[2]}
                </Menu.Item>
            </Menu>
        );

        let field_user = (
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="Name" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name="dateOfBirth"
                            rules={[{ required: true, message: 'Please input your date of birth!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <DatePicker size="large" placeholder="Date of birth" style={{width:"100%"}}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={24}>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="Email address" style={{marginBottom: "10px"}} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input.Password size="large" style={{margin: "10px 0"}} placeholder=" Password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            rules={[{ required: true, message: 'Please confirm your password!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input.Password size="large" style={{margin: "10px 0"}} placeholder="Confirm password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                        </Form.Item>
                        <Form.Item
                            name="phoneNumber"
                            rules={[{ required: true, message: 'Please input your phone number!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="Phone number" style={{margin: "10px 0"}} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name="buildingNumber"
                            rules={[{ required: true, message: 'Please input your building number!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="Building No." />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name="street"
                            rules={[{ required: true, message: 'Please input street address!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="Street" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name="city"
                            rules={[{ required: true, message: 'Please input city address!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="City" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name="state"
                            rules={[{ required: true, message: 'Please input state address!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="State" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            name="passportNumber"
                            rules={[{ required: true, message: 'Please input your passport number!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="Passport No." />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            name="passportCountry"
                            rules={[{ required: true, message: 'Please input your passport country!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="Passport country" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            name="passportExpiration"
                            rules={[{ required: true, message: 'Please input your passport expiration date!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <DatePicker size="large" placeholder="Expiration" style={{width:"100%"}} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={24}>
                        <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>Submit</Button>
                    </Col>
                </Row>
            </Form>
    )
        let field_agent = (
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={24}>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="Email address" style={{marginBottom: "10px"}} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input.Password size="large" style={{margin: "10px 0"}} placeholder=" Password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            rules={[{ required: true, message: 'Please confirm your password!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input.Password size="large" style={{margin: "10px 0"}} placeholder="Confirm password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={24}>
                        <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>Submit</Button>
                    </Col>
                </Row>
            </Form>
        )
        let field_staff = (
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!'}]}
                        style={{width: "100%", margin:"0"}}>
                        <Input size="large" placeholder="Username" style={{marginBottom: "10px"}} />
                    </Form.Item>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                <Col className="gutter-row" span={12}>
                        <Form.Item
                            name="firstName"
                            rules={[{ required: true, message: 'Please input your first name!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="First name" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name="lastName"
                            rules={[{ required: true, message: 'Please input your last name!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="Last name" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name="airlineName"
                            rules={[{ required: true, message: 'Please input your airline name!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input size="large" placeholder="Airline name" />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name="dateOfBirth"
                            rules={[{ required: true, message: 'Please input your date of birth!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <DatePicker size="large" placeholder="Date of birth" style={{width:"100%"}} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={24}>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input.Password size="large" style={{margin: "10px 0"}} placeholder=" Password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            rules={[{ required: true, message: 'Please confirm your password!'}]}
                            style={{width: "100%", margin:"0"}}>
                            <Input.Password size="large" style={{margin: "10px 0"}} placeholder="Confirm password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={24}>
                            <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>Submit</Button>
                    </Col>
                </Row>
            </Form>
        )
        if (this.state.regisType === userTypes[0]){
            selectedField = field_user;
        }
        else if (this.state.regisType === userTypes[1]){
            selectedField = field_agent;
        }
        else if(this.state.regisType === userTypes[2]){
            selectedField = field_staff;
        }
        else{}

        return(
            <div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "80%"}}>
                    <Col className="gutter-row" span={12}>
                        <Dropdown overlay={rTypes} trigger={"click"}>
                            <Button style={{width:"100%"}}>
                                {buttonPlaceholder} <DownOutlined />
                            </Button>
                        </Dropdown>
                    </Col>
                    <Col className="gutter-row" span={12}/>
                </Row>
                {selectedField}
            </div>
    )
    }
}

class RegistrationMain extends React.Component{
    componentDidMount() {
        document.title = 'Registration | AirTraveller - Excited to fly.';
    }

    render() {
        return(
            <div style={{padding: "0 100px"}}>
                <Content style={{background:"#f0f2f5", maxWidth:"1350px", margin: "auto", width: "100%"}}>
                    <Breadcrumb style={{margin: "14px 0"}}>
                        <Breadcrumb.Item>
                            <NavLink to="/">Home</NavLink>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Sign up</Breadcrumb.Item>
                    </Breadcrumb>
                    <div id="regisPageWrapper">
                        <div style={{fontSize: "2rem"}}>Sign up</div>
                    </div>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col className="gutter-row" span={12}>
                            <Row>
                                <p style={{fontSize: "1.1rem"}}>
                                    When you have a registered account with us,
                                    you can use your stored passenger information to speed through online booking.
                                </p>
                                <br/>
                                <p>
                                    {/*Please note registration is open to individuals aged 18 or above only.*/}
                                    {/*<br/>*/}
                                    Are you an existing AirTraveller club member?
                                    <NavLink to="/login" style={{fontWeight:"bold"}}> Sign in now ></NavLink>
                                </p>
                                <p>First of all, please select the role that you want to be registered as:</p>
                            </Row>
                            <RegistrationFields/>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <div id="regisPicHolder" style={{overflowY: "hidden", minHeight: "560px",maxWidth: "100%"}}/>
                        </Col>
                    </Row>
                    <Footer style={{padding: "24px 0", position: "relative", bottom:"0", width:"100%"}}>Copyright © 2020 AirTraveller Limited</Footer>
                </Content>
            </div>
        )
    }
}

class RegistrationPage extends React.Component{
    render() {
        return (<Layout style={{minHeight: "100%", maxWidth:"100%"}}>
            <MainHeader/>
            <TravelAlert/>
            <RegistrationMain/>
        </Layout>)
    }
}

export default RegistrationPage