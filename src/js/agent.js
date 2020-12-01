import React from 'react';
import {Layout, Menu, Breadcrumb, Row, Col, Divider, Button} from 'antd';
import {UserOutlined, LaptopOutlined, NotificationOutlined, SearchOutlined} from '@ant-design/icons';
import Logo from "../../res/logo_2.png";
import {NavLink} from "react-router-dom";
import Cookies from "js-cookie";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class AgentPage extends React.Component{
    componentDidMount() {
        console.log("NEW");
        this.checkLoginStatus();
    }

    async handleSignOut(){
        await Cookies.set("adminRole", undefined);
        await Cookies.set("adminLoggedIn", undefined);
        await Cookies.set("adminID", undefined);
        // console.log(Cookies.get("adminRole"));
        // console.log(Cookies.get("adminID"));
        // console.log(Cookies.get("adminLoggedIn"));
    }

    async checkLoginStatus(){
        // console.log(Cookies.get("adminRole"));
        // console.log(Cookies.get("adminID"));
        // console.log(Cookies.get("adminLoggedIn"));
        let loggedIn = await Cookies.get("adminLoggedIn") !== "true";
        let role = await Cookies.get("adminRole") !== "Booking Agent";
        if (loggedIn || role){
            await alert("User authentication failed, please login again!");
            this.props.history.push('/admin')
        }
        else{
        }
    }

    render() {
        return(
            <Layout>
                <Header className={"header"} style={{padding: "0 12px"}}>
                    <Row style={{margin: "auto"}}>
                        <Col flex={1}>
                            {/*<div id="logo"></div>*/}
                            <NavLink to="/">
                                <img id="logo" src={Logo}/>
                            </NavLink>
                        </Col>
                        <Col flex={4}>
                            <Row justify="end" id="headerRow">
                                <Col flex="none">
                                    <Divider type="vertical" />
                                    <NavLink to="/admin" onClick={this.handleSignOut}>Sign out</NavLink>
                                    <Divider type="vertical" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Header>
                <Layout>
                    <Sider width={200} className="site-layout-background">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
                                <Menu.Item key="1">option1</Menu.Item>
                                <Menu.Item key="2">option2</Menu.Item>
                                <Menu.Item key="3">option3</Menu.Item>
                                <Menu.Item key="4">option4</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
                                <Menu.Item key="5">option5</Menu.Item>
                                <Menu.Item key="6">option6</Menu.Item>
                                <Menu.Item key="7">option7</Menu.Item>
                                <Menu.Item key="8">option8</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
                                <Menu.Item key="9">option9</Menu.Item>
                                <Menu.Item key="10">option10</Menu.Item>
                                <Menu.Item key="11">option11</Menu.Item>
                                <Menu.Item key="12">option12</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            Content
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default AgentPage;