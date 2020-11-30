import React from 'react';

import {Layout, Menu, Breadcrumb, Row, Col, Button, Input, Dropdown, DatePicker} from 'antd';
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, DownOutlined, TeamOutlined, IdcardOutlined} from '@ant-design/icons';
const {Content, Footer} = Layout;
import {MainHeader, TravelAlert} from "./bundle";

import 'antd/dist/antd.compact.less'
import '../css/registration.less'
import {NavLink} from "react-router-dom";

const userTypes = ["AirTraveller Club Member", "Booking Agent", "Airline Staff"];

class RegistrationFields extends React.Component{
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
            <div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={12}>
                        <Input size="large" placeholder="Name" />
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <DatePicker size="large" placeholder="Date of birth" style={{width:"100%"}}/>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={24}>
                        <Input size="large" placeholder="Email address" style={{marginBottom: "10px"}} />
                        <Input.Password size="large" style={{margin: "10px 0"}} placeholder=" Password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                        <Input.Password size="large" style={{margin: "10px 0"}} placeholder="Confirm password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                        <Input size="large" placeholder="Phone number" style={{margin: "10px 0"}} />
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={12}>
                        <Input size="large" placeholder="Building No." />
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Input size="large" placeholder="Street" />
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={12}>
                        <Input size="large" placeholder="City" />
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Input size="large" placeholder="State" />
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={8}>
                        <Input size="large" placeholder="Passport No." />
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Input size="large" placeholder="Passport country" />
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <DatePicker size="large" placeholder="Expiration" style={{width:"100%"}} />
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={24}>
                        <Button type="primary" size={"large"} style={{width:"100%"}}>Submit</Button>
                    </Col>
                </Row>
            </div>
    )
        let field_agent = (
            <div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={24}>
                        <Input size="large" placeholder="Email address" style={{marginBottom: "10px"}} />
                        <Input.Password size="large" style={{margin: "10px 0"}} placeholder=" Password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                        <Input.Password size="large" style={{margin: "10px 0"}} placeholder="Confirm password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={24}>
                        <Button type="primary" size={"large"} style={{width:"100%"}}>Submit</Button>
                    </Col>
                </Row>
            </div>
        )
        let field_staff = (
            <div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={12}>
                        <Input size="large" placeholder="First name" />
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Input size="large" placeholder="Last name" />
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={12}>
                        <Input size="large" placeholder="Airline name" />
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <DatePicker size="large" placeholder="Date of birth" style={{width:"100%"}} />
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={24}>
                        <Input size="large" placeholder="Email address" style={{marginBottom: "10px"}} />
                        <Input.Password size="large" style={{margin: "10px 0"}} placeholder=" Password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                        <Input.Password size="large" style={{margin: "10px 0"}} placeholder="Confirm password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", maxWidth: "100%"}}>
                    <Col className="gutter-row" span={24}>
                        <Button type="primary" size={"large"} style={{width:"100%"}}>Submit</Button>
                    </Col>
                </Row>
            </div>
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
                <Content style={{background:"#f0f2f5", maxWidth:"1400px", margin: "auto", width: "100%"}}>
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