import React from 'react';
import Cookies from "js-cookie";

import { Layout, Menu, Breadcrumb, Divider, Row, Col, Button, Typography, Input, Checkbox, Form} from 'antd';
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, LockOutlined} from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;
import {MainHeader, TravelAlert} from "./index";

import 'antd/dist/antd.compact.less'
import '../css/login.less'
import {NavLink, Route, Switch} from "react-router-dom";
import AgentPage from "./agent";
import StaffPage from "./staff";

class LoginPage extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log(this.props.location.query);
        document.title = 'Sign in | AirTraveller - Excited to fly.';
    }

    async LoginClick (values){
        values["email"] = values["username"];
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
            credentials: "include"
        };
        console.log(requestOptions);
        const response = await fetch('http://localhost:3000/api/login/customer', requestOptions);
        console.log(response.status)        // this.setState({ postId: data.id });
        if( response.status === 200 ){
            // alert('Login Success');
            Cookies.set("userLoggedIn", "true");
            Cookies.set("userID", values["username"]);
            this.props.history.push('/profile');
        }else{
            alert("Login Failed");
        }
    }

    render(){
        const onFinish = values => {
            console.log('Success:', values);
            this.LoginClick(values);
        };

        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };

        return(
            <Layout style={{minHeight: "100%", maxWidth:"100%"}}>
                <MainHeader/>
                <TravelAlert/>
                <div style={{padding: "0 100px"}}>
                    <Content style={{background:"#f0f2f5", maxWidth:"1350px", margin: "auto", width: "100%"}}>
                        <Breadcrumb style={{margin: "14px 0"}}>
                            <Breadcrumb.Item>
                                <NavLink to="/">Home</NavLink>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Login</Breadcrumb.Item>
                        </Breadcrumb>
                        <div id="loginPageWrapper">
                            <Row>
                                <Col style={{width: "70%"}}>
                                    <div id="loginPicHolder" style={{overflowY: "hidden", minHeight: "530px",maxWidth: "100%"}}/>
                                    <div style={{display: "inline"}}>
                                        <div style={{color: "grey", float: "left"}}>A Cathay Pacific Boeing 747-400 landing @Hong Kong Kai-Tak Airport.</div>
                                        <div style={{color: "grey", float: "right"}}>Copyright@Daryl Chapman</div>
                                    </div>
                                </Col>
                                {/*<Divider type="vertical" style={{backgroundColor:"black"}} />*/}
                                <Col style={{width: "25%", position: "relative"}}>
                                    <div id="loginInfoWrapper">
                                        <Row justify={"start"}>
                                            <p style={{fontSize: "2rem"}}>Sign in</p>
                                        </Row>
                                        <Row>
                                            <p style={{fontSize: "1.1rem"}}>Please sign in with your AirTraveller account. <br/>
                                                Don’t have an account yet?
                                                <NavLink to="/registration" style={{fontWeight: "bold"}}> Sign up now></NavLink>
                                            </p>
                                        </Row>
                                        <Form
                                            name="basic"
                                            initialValues={{ remember: true }}
                                            onFinish={onFinish}
                                            onFinishFailed={onFinishFailed}>
                                            <Row>
                                                <Form.Item
                                                    name="username"
                                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                                    style={{width: "100%", margin:"0"}}>
                                                    <Input size="large" placeholder=" Email" prefix={<UserOutlined />} style={{margin:"5px 0"}}/>
                                                </Form.Item>
                                                <Form.Item
                                                    name="password"
                                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                                    style={{width: "100%", margin:"0"}}>
                                                    <Input.Password size="large" style={{margin:"10px 0"}} prefix={<LockOutlined />}
                                                                    placeholder=" Password"
                                                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                    />
                                                </Form.Item>
                                            </Row>
                                            <Row style={{marginTop:"10px"}}>
                                                <Form.Item style={{width: "100%", margin:"0"}}>
                                                    <Button type="primary" htmlType="submit" style={{margin:"auto", width:"100%", height:"45px", fontSize:"1.1rem"}}>Login</Button>
                                                </Form.Item>
                                            </Row>
                                            <Row style={{marginTop:"10px"}}>
                                                <NavLink to="/admin">>For staff/booking agents, please login through here.</NavLink>
                                            </Row>
                                        </Form>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <Footer style={{padding: "24px 0", position: "fixed", bottom:"0", width:"100%"}}>Copyright © 2020 AirTraveller Limited</Footer>
                    </Content>
                </div>
            </Layout>
        )
    }
}

export const LoginRouter = ({match}) => {
    return(
        <Route>
            <Switch>
                <Route exact path={match.path} component={LoginPage}/>
            </Switch>
        </Route>
    )
}

export default LoginRouter