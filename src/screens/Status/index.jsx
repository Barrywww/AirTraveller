import React from 'react';


import {
    Layout,
    Breadcrumb,
    Row,
    Col,
    Button,
    Input,
    Form,
    DatePicker,
    Table,
} from 'antd';
const { Content, Footer } = Layout;
import {MainHeader, TravelAlert} from "../Home";

import 'antd/dist/antd.compact.less'
import '../User/Login/index.less'
import {NavLink} from "react-router-dom";
import {staffFlightColumns} from "../../utils/res";

class StatusPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {srcCity: "", dstCity: ""}
    }

    componentDidMount() {
        document.title = 'Flight Status | AirTraveller - Excited to fly.';
    }

    async fetchData(values){
        let response
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(values),
            credentials: "include"
        };
        response = await fetch("http://localhost:3000/api/search/status", requestOptions).then(response => response.json())
        console.log(response);
        for (let i=0; i<response.length; i++){
            response[i]["departure_time"] = response[i]["departure_time"].slice(0, -5);
            response[i]["arrival_time"] = response[i]["arrival_time"].slice(0, -5);
        }
        this.setState({data: response});
    }

    render(){
        const onFinish = values => {
            // console.log("on finish");
            this.fetchData(values);
            this.setState({data: []})
        };

        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };

        return(
            <Layout style={{minHeight: "100%", maxWidth:"100%"}}>
                <div id="purchaseModalHolder"/>
                <MainHeader/>
                <TravelAlert/>
                <div style={{padding: "0 100px"}}>
                    <Content style={{background:"#f0f2f5", maxWidth:"1350px", margin: "auto", width: "100%"}}>
                        <Breadcrumb style={{margin: "14px 0"}}>
                            <Breadcrumb.Item>
                                <NavLink to="/">Home</NavLink>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Flight Status</Breadcrumb.Item>
                        </Breadcrumb>
                        <div id="statusPageWrapper">
                            <Form
                                name="basic"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}>
                                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                                    <Col span={5}>
                                        <Form.Item
                                            name="airline"
                                            rules={[{ required: true, message: 'Please input airline name'}]}
                                            style={{width: "100%", margin:"0"}}>
                                            <Input size="large" placeholder="Airline name" style={{width: "100%"}}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            name="flightNumber"
                                            rules={[{ required: true, message: 'Please input flight number'}]}
                                            style={{width: "100%", margin:"0"}}>
                                            <Input size="large" placeholder="Flight number" style={{width: "100%"}}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            name="departureDate"
                                            rules={[{ required: false, message: 'Please input departure date'}]}
                                            style={{width: "100%", margin:"0"}}>
                                            <DatePicker size="large" placeholder="Departure Date" style={{width: "100%"}}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            name="arrivalDate"
                                            rules={[{ required: false, message: 'Please input arrival date'}]}
                                            style={{width: "100%", margin:"0"}}>
                                            <DatePicker size="large" placeholder="Arrival Date" style={{width: "100%"}}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            name="submit"
                                            rules={[{ required: false, message: 'Departure Airport'}]}
                                            style={{width: "100%", margin:"0"}}>
                                            <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>→Search</Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                                <Col span={24}>
                                    <Table columns={staffFlightColumns} dataSource={this.state.data}/>
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

export default StatusPage;