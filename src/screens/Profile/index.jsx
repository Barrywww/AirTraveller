import React from 'react';
import Cookies from "js-cookie";


import {
    Layout,
    Breadcrumb,
    Divider,
    Row,
    Col,
    Button,
    Form,
    DatePicker,
    Table, Statistic
} from 'antd';
const { Content, Footer } = Layout;
import {MainHeader, TravelAlert} from "../Home";

import 'antd/dist/antd.compact.less'
import '../User/Login/index.less'
import {NavLink} from "react-router-dom";
import {staffFlightColumns} from "../../utils/res";
import ReactDOM from "react-dom";
import {createBrowserHistory} from "history";
import {Bar} from "react-chartjs-2";

let history = createBrowserHistory();


class ProfilePage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {flights: [], billLS:[], billLY:[], billCustom: [], totalLS: 0, totalLY: 0, totalCus: 0}
    }

    async componentDidMount() {
        document.title = 'Profile | AirTraveller - Excited to fly.';
        if (Cookies.get("userLoggedIn") !== "true"){
            alert("Please login first！");
            history.push("/login");
            history.go();
        }
        else{
            await this.fetchData({queryType: "flights"});
            await this.fetchData({queryType: "billDefault"});
        }
    }

    async fetchData(values){
        console.log("called!");
        console.log(values["queryType"]);
        let response
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(values),
            credentials: "include"
        };
        if (values["queryType"] === "flights"){
            response = await fetch("http://localhost:3000/api/customer/flights", requestOptions).then(response => response.json())
            console.log(response);
            for (let i=0; i<response.length; i++){
                response[i]["departure_time"] = response[i]["departure_time"].slice(0, -5);
                response[i]["arrival_time"] = response[i]["arrival_time"].slice(0, -5);
            }
            this.setState({flights: response});
        }
        else if (values["queryType"] === "billDefault"){
            response = await fetch("http://localhost:3000/api/customer/bill", requestOptions).then(response => response.json())
            console.log(response);
            let labelLM = [];
            let labelLY = [];
            let dataLM = [];
            let dataLY = [];
            let totalLM = 0;
            let totalLY = 0;
            for (let i=0; i<response["lastSix"].length; i++){
                labelLM.push(response["lastSix"][i]["monthdata"]);
                dataLM.push(response["lastSix"][i]["price"]);
                totalLM += response["lastSix"][i]["price"];
            }
            for (let i=0; i<response["lastYear"].length; i++){
                labelLY.push(response["lastYear"][i]["monthdata"]);
                dataLY.push(response["lastYear"][i]["price"]);
                totalLY += response["lastYear"][i]["price"];
            }
            let billLM = {
                labels: labelLM,
                datasets: [
                    {
                        label: 'Last 6 months',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: dataLM
                    }]
            };
            let billLY = {
                labels: labelLY,
                datasets: [
                    {
                        label: 'Last one year',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: dataLY
                    }]
            };
            this.setState({billLS: billLM, billLY: billLY, totalLS: totalLM, totalLY: totalLY});
        }
        else if (values["queryType"] === "bill"){
            let labelCus = [];
            let dataCus = [];
            let totalCus = 0;
            if (values["startDate"]){
                values["startDate"] = values["startDate"].format("YYYY-MM-DD");
            }
            if (values["endDate"]){
                values["endDate"] = values["endDate"].format("YYYY-MM-DD");
            }
            response = await fetch("http://localhost:3000/api/customer/bill", requestOptions).then(response => response.json())
            console.log(response);

            for (let i=0; i<response.length; i++){
                labelCus.push(response[i]["monthdata"]);
                dataCus.push(response[i]["price"]);
                totalCus += response[i]["price"];
            }
            let billCus = {
                labels: labelCus,
                datasets: [
                    {
                        label: 'Your selected range',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: dataCus
                    }]
            };
            this.setState({billCus: billCus, totalCus: totalCus});
            ReactDOM.render((
                <div>
                    <Statistic title="Money spent in your selected range" value={this.state.totalCus} />
                </div>
            ),document.getElementById("selectedTotBillWrapper"))
            ReactDOM.render((
                <div>
                    <Bar
                        data={this.state.billCus}
                        // width={300}
                        height={300}
                        options={{
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            },
                            maintainAspectRatio: false
                        }
                        }/>
                </div>
            ),document.getElementById("selectedBarBillWrapper"))
        }
    }

    render(){
        const onFinish = values => {
            values["queryType"] = "bill"
            this.fetchData(values);
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
                            <Breadcrumb.Item>Customer Portal</Breadcrumb.Item>
                        </Breadcrumb>
                        <div id="statusPageWrapper">
                            <h1>Welcome to customer portal, {Cookies.get("userID")}!</h1>
                            <h3>My Upcoming Flights</h3>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                                <Col span={24}>
                                    <Table columns={staffFlightColumns} dataSource={this.state.flights} scroll={{ x: true }}/>
                                </Col>
                            </Row>
                            <Divider style={{marginTop:"0"}}/>
                            <h3>Track My Spending</h3>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                                <Col span={4}>
                                    <Statistic title="Money spent in last 6 months" value={this.state.totalLS} />
                                    <Statistic title="Money spent in last year" value={this.state.totalLY} />
                                </Col>
                                <Col span={10}>
                                    <Bar
                                        data={this.state.billLS}
                                        width={300}
                                        height={300}
                                        options={{
                                            scales: {
                                                yAxes: [{
                                                    ticks: {
                                                        beginAtZero: true
                                                    }
                                                }]
                                            },
                                            maintainAspectRatio: false
                                        }
                                        }/>
                                </Col>
                                <Col span={10}>
                                    <Bar
                                        data={this.state.billLY}
                                        width={300}
                                        height={300}
                                        options={{
                                            scales: {
                                                yAxes: [{
                                                    ticks: {
                                                        beginAtZero: true
                                                    }
                                                }]
                                            },
                                            maintainAspectRatio: false
                                        }
                                        }/>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                                <Col span={24}>
                                    <Form
                                        name="spending"
                                        initialValues={{ remember: true }}
                                        onFinish={onFinish}
                                        onFinishFailed={onFinishFailed}>
                                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="startDate"
                                                    rules={[{ required: true, message: 'Please input start date!'}]}
                                                    style={{width: "100%", margin:"0"}}>
                                                    <DatePicker size="large" placeholder="Start Date" style={{width: "100%"}}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="endDate"
                                                    rules={[{ required: true, message: 'Please input end date'}]}
                                                    style={{width: "100%", margin:"0"}}>
                                                    <DatePicker size="large" placeholder="End Date" style={{width: "100%"}}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="submit"
                                                    rules={[{ required: false, message: 'Departure Airport'}]}
                                                    style={{width: "100%", margin:"0"}}>
                                                    <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>→Search</Button>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                                <Col span={8}>
                                    <div id="selectedTotBillWrapper"/>
                                </Col>
                                <Col span={16}>
                                    <div id="selectedBarBillWrapper"/>
                                </Col>
                            </Row>
                        </div>
                        <Footer style={{padding: "24px 0", position: "relative", bottom:"0", width:"100%"}}>Copyright © 2020 AirTraveller Limited</Footer>
                    </Content>
                </div>
            </Layout>
        )
    }
}

export default ProfilePage;