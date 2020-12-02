import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from "js-cookie";
import {BrowserRouter, Route, Switch, NavLink, useHistory} from 'react-router-dom';

import {Layout, Menu, Breadcrumb, Divider, Row, Col, Button, Typography, AutoComplete, DatePicker, Form} from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, SearchOutlined, AlertTwoTone } from '@ant-design/icons';

import 'antd/dist/antd.compact.less'
import '../css/index.less';
import Logo from '../../res/logo_2.png';

import airports from "./airports";
import LoginPage from "./user_login";
import RegistrationPage from "./user_registration";
import AdminRouter from "./admin";
import AgentPage from "./agent";
// import StaffPage from "./staff";
// import UserHome from "./user_home";

// const history = useHistory();
const domesticAirports = airports["domestic"];
const internationalAirports = airports["international"];

const { Title } = Typography;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const IATARegex = /[A-Z]{3}/gm;
const IATARegex_brackets = /[(][A-Z]{3}[)]/gm;

class FieldAutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            marginLeft: props.marginLeft,
            options: props.options,
            placeHolder: props.placeHolder
        }
    }

    render() {
        return(
            <AutoComplete
                style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    marginLeft: this.state.marginLeft,
                    width: "80%",
                    textAlign: "start",
                    height:"48px",
                    lineHeight:"45px",
                    fontSize: "16px",
                }}
                options={this.state.options}
                placeholder={this.state.placeHolder}
                filterOption={(inputValue, option) =>
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
            />
        )
    }
}

class MainScheduler extends React.Component {
    constructor(props) {
        super(props);
    }

    async homeQueryClick (values){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        };
        values["date"] = values["date"].format("YYYY-MM-DD");
        values["srcaptName"]
        let response;
        if (this.state.regisType === userTypes[0]){
            response = await fetch('http://localhost:3000/api/register/customer', requestOptions)
        }
    }

    render(){
        const onFinish = values => {
            console.log("on finish");
        }

        const onFinishFailed = errMsg => {
            console.log("on finish failed");
        }
        return(
            <div id="schedulerWrap">
                <Title level={4} style={{ padding: '10px 35px', margin: "0 auto", fontWeight:"bold" }} id="greeting">
                    Ready for your next trip? Book with us now.
                </Title>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}>
                    <Row justify="space-between">
                            <Col className="schedulerField" style={{textAlign:"start"}} span={6} xs={{ order: 1 }} sm={{ order: 1 }} md={{ order: 1 }} lg={{ order: 1 }}>
                                <Form.Item
                                    name="srcaptName"
                                    rules={[{ required: true, message: 'Please input your departure airport!'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <FieldAutoComplete options={domesticAirports} placeHolder="Leaving from" marginLeft="35px"/>
                                </Form.Item>
                            </Col>
                            <Col className="schedulerField" style={{textAlign:"center"}} span={6} xs={{ order: 2 }} sm={{ order: 2 }} md={{ order: 2 }} lg={{ order: 2 }}>
                                <Form.Item
                                    name="dstaptName"
                                    rules={[{ required: true, message: 'Please input your arrival airport!'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <FieldAutoComplete options={domesticAirports} placeHolder="Going to"/>
                                </Form.Item>
                            </Col>
                            <Col className="schedulerField" style={{textAlign:"center"}} span={6} xs={{ order: 3 }} sm={{ order: 3 }} md={{ order: 3 }} lg={{ order: 3 }}>
                                <Form.Item
                                    name="date"
                                    rules={[{ required: true, message: 'Please input your departure date!'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <DatePicker size="large" style={{margin: "10px 0", width:"80%", height:"48px", fontSize:"18px"}} placeholder="Departing on"/>
                                </Form.Item>
                            </Col>
                            <Col className="schedulerField" style={{textAlign:"center"}} span={6} xs={{ order: 4 }} sm={{ order: 4 }} md={{ order: 4 }} lg={{ order: 4 }}>
                                <Button type="primary" htmlType="submit" size="large" style={{margin: "10px 0", width:"80%", height:"48px", fontSize:"18px", overflow: "hidden"}}>
                                    → Search Flights
                                </Button>
                            </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

class MainContent extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div style={{padding: "0 100px"}}>
                <Content style={{background:"#f0f2f5", maxWidth:"1350px", margin: "auto", width: "100%"}}>
                    <Divider />
                    <Layout className="site-layout-background">
                        <Content style={{minHeight: 280 }}>
                            <div id="mainPicHolder" style={{overflowY: "hidden", minHeight: "650px", maxWidth: "100%"}}>
                            </div>
                        </Content>
                        <MainScheduler />
                    </Layout>
                    <Divider/>
                    <Footer style={{padding: "12px 0px", position: "relative", width:"100%"}}>
                        <p style={{margin: "0", fontSize: "0.5rem", color: "grey"}}>Cover pic: A British Airways Boeing 747 Taking off from Boston Logan Airport. Copyright@Boston Logan Airport</p>
                        <p>Copyright © 2020 AirTraveller Limited</p>
                    </Footer>
                    </Content>
            </div>
        )
    }
}

class MainHeader extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Header className={"header"} style={{padding: "0 100px"}}>
                <Row style={{maxWidth: "1350px", margin: "auto"}}>
                    <Col flex={1}>
                        {/*<div id="logo"></div>*/}
                        <NavLink to="/">
                            <img id="logo" src={Logo}/>
                        </NavLink>
                    </Col>
                    <Col flex={4}>
                        <Row justify="end" id="headerRow">
                            <Col flex="auto" id="headerMenuCol">
                                <Menu id="headerMenu" theme={"light"} mode={"horizontal"}>
                                    <Menu.Item key={'1'}>Book</Menu.Item>
                                    <Menu.Item key={'2'}>My Trip</Menu.Item>
                                    <Menu.Item key={'3'}>Membership</Menu.Item>
                                    <Menu.Item key={'4'}>Newsroom</Menu.Item>
                                </Menu>
                            </Col>
                            <Col flex="none">
                                <NavLink to="/login">Login</NavLink>
                                <Divider type="vertical" />
                                <NavLink to="/registration">Sign up</NavLink>
                                <Divider type="vertical" />
                                <Button type="primary" shape="circle" icon={<SearchOutlined />} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Header>
        )
    }
}

class TravelAlert extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Row justify="start" id="travelAlert" >
                <div style={{maxWidth: "1350px", width:"100%", margin: "auto"}}>
                    <AlertTwoTone twoToneColor="#d32f2f" style={{fontSize: "20px", float:"left"}}/>
                    <div style={{marginLeft: "5px", fontSize: "15px", float: "left"}}>
                        <div id="covidAlertText">COVID-19 Travel Alert:</div>
                        <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/travel-advice">
                            Please check the WHO travel advices here.</a>
                    </div>
                </div>
            </Row>
        )
    }
}

class HomePage extends React.Component{
    componentDidMount() {
        document.title = 'AirTraveller - Excited to fly.';
    }

    constructor(props) {
        super(props);
    }

    render() {
        return(
                <Layout style={{minHeight: "100%", maxWidth:"100%"}}>
                    <MainHeader/>
                    <TravelAlert/>
                    <MainContent/>
                    {/*<Footer style={{ textAlign: 'center' }}>Powered by Ant Design ©2020</Footer>*/}
                </Layout>

        )
    }
}

class MainRouter extends React.Component{
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/registration" component={RegistrationPage}/>
                    <Route path="/admin" component={AdminRouter}/>
                    {/*<Route path="/admin/staff" component={StaffPage}/>*/}
                    {/*<Route path="/user/home" component={UserHome}/>*/}
                </Switch>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<MainRouter />, document.getElementById("root"));
export {MainHeader, TravelAlert}