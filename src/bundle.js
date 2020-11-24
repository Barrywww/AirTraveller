import React from 'react';
import ReactDOM from 'react-dom';

import { Layout, Menu, Breadcrumb, Divider, Row, Col, Button, Typography } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, SearchOutlined } from '@ant-design/icons';
// import 'antd/dist/antd.less';
import 'antd/dist/antd.compact.less'
import './index.less';
import Logo from '../res/logo_2.png';

const { Title } = Typography;
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

function MainContent(props){
    return(
        <Content style={{ padding: '0 50px', background:"#f0f2f5"}}>
        {/*<Title level={4} style={{ padding: '10px 0' }}>Ready for your next trip? Book with us now.</Title>*/}
        <Layout className="site-layout-background" style={{ padding: '10px 0' }}>
            <Sider className="site-layout-background" width={200}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%' }}
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
            <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
        </Layout>
    </Content>
    )
}

function createCanvas(props){
    return(
        <Layout>
            <Header className={"header"}>
                <Row>
                    <Col flex={1}>
                        {/*<div id="logo"></div>*/}
                        <a href="index.html">
                            <img id="logo" src={Logo}/>
                        </a>
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
                                <a href="#">Login</a>
                                <Divider type="vertical" />
                                <a href="#">Register</a>
                                <Divider type="vertical" />
                                <Button type="primary" shape="circle" icon={<SearchOutlined />} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Header>
            <MainContent/>
            {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
        </Layout>
    )
}

ReactDOM.render(createCanvas(""), document.getElementById("root"));