import React from 'react';
import {Button, Col, DatePicker, Divider, Form, Input, Layout, Menu, Row} from "antd";
import moment from "moment";
import Cookies from "js-cookie";
import {Link, NavLink} from "react-router-dom";
import Logo from "res/logo_2.png";
import {AlertTwoTone} from "@ant-design/icons";

import './index.less';

const { Header, Content, Footer} = Layout;

class MainScheduler extends React.Component {
    constructor(props) {
        super(props);
    }

    disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().startOf('day');
    }

    render(){
        // let history = useHistory();
        const onFinish = values => {
            Cookies.set("srcCity", values["srcCity"]);
            Cookies.set("dstCity", values["dstCity"]);
            Cookies.set("depDate", values["date"].format("YYYY-MM-DD"));
            history.push("/search")
            history.go();
        }

        const onFinishFailed = errMsg => {
            console.log("on finish failed");
        }
        return(
            <div id="schedulerWrap">
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                        <Col span={24}>
                            <div style={{fontSize: "1.3rem", margin: "0 auto", fontWeight:"bold" }} id="greeting">
                                Ready for your next trip? Book with us now.
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"5px 0", width: "100%", margin: "0"}}>
                        <Col className="schedulerField" style={{textAlign:"start"}} span={6} >
                            <Form.Item
                                name="srcCity"
                                rules={[{ required: true, message: 'Please input your departure city!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Input size="large" style={{margin: "10px 0", width:"100%", height:"48px", fontSize:"18px"}} placeholder="Departure city"/>
                            </Form.Item>
                        </Col>
                        <Col className="schedulerField" style={{textAlign:"center"}} span={6}>
                            <Form.Item
                                name="dstCity"
                                rules={[{ required: true, message: 'Please input your arrival city!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Input size="large" style={{margin: "10px 0", width:"100%", height:"48px", fontSize:"18px"}} placeholder="Arrival city"/>
                            </Form.Item>
                        </Col>
                        <Col className="schedulerField" style={{textAlign:"center"}} span={6} xs={{ order: 3 }} sm={{ order: 3 }} md={{ order: 3 }} lg={{ order: 3 }}>
                            <Form.Item
                                name="date"
                                rules={[{ required: true, message: 'Please input your departure date!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <DatePicker disabledDate={this.disabledDate} size="large" style={{margin: "10px 0", width:"100%", height:"48px", fontSize:"18px"}} placeholder="Departing on"/>
                            </Form.Item>
                        </Col>
                        <Col className="schedulerField" style={{textAlign:"center"}} span={6} xs={{ order: 4 }} sm={{ order: 4 }} md={{ order: 4 }} lg={{ order: 4 }}>
                            <Button type="primary" htmlType="submit" size="large" style={{margin: "10px 0", width:"100%", height:"48px", fontSize:"18px", overflow: "hidden"}}>
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
        this.state={userLoggedIn: true, userID: ""}
    }

    componentDidMount() {
        this.setState({userID: Cookies.get("userID")})
    }

    handleLogout(){
        Cookies.remove("userLoggedIn");
        Cookies.remove("userID");
        this.setState({userID: ""});
        history.push("/");
        history.go();
    }

    render() {
        let loginWrapper;
        if(Cookies.get("userLoggedIn") === "true"){
            loginWrapper  = (
                <div>
                    <div>Welcome, {this.state.userID}!
                        <Divider type={"vertical"}/>
                        <a onClick={this.handleLogout.bind(this)}>Logout</a>
                    </div>
                </div>
            )
        }
        else {
            loginWrapper = (
                <Row style={{width: "100%"}}>
                    <NavLink to="/login">Login</NavLink>
                    <Divider type="vertical"/>
                    <NavLink to="/registration">Sign up</NavLink>
                    <Divider type="vertical"/>
                </Row>
            )
        }
        return (
            <Header className={"header"} style={{padding: "0 100px"}}>
                <Row style={{maxWidth: "1350px", margin: "auto"}}>
                    <Col flex={1}>
                        {/*<div id="logo"></div>*/}
                        <NavLink to="/">
                            <img id="logo" src={Logo}/>
                        </NavLink>
                    </Col>
                    <Col flex={3}>
                        <Row justify="end" id="headerRow">
                            <Col flex="auto" id="headerMenuCol">
                                <Menu id="headerMenu" theme={"light"} mode={"horizontal"} onClick={this.handleMenuClick}>
                                    <Menu.Item key={'1'}>
                                        <Link to="/search">Flights</Link>
                                    </Menu.Item>
                                    <Menu.Item key={'2'}>
                                        <Link to="/status">Status</Link>
                                    </Menu.Item>
                                    <Menu.Item key={'3'}>
                                        <Link to="/profile">Portal</Link>
                                    </Menu.Item>
                                </Menu>
                            </Col>
                            <Col flex="none">
                                {loginWrapper}
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

export {MainHeader, TravelAlert, HomePage};
export default HomePage;