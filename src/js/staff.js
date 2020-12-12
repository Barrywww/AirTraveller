import React from 'react';
import ReactDOM from "react-dom";
import {
    Layout,
    Menu,
    Breadcrumb,
    Row,
    Col,
    Divider,
    Button,
    Table,
    Form,
    Input,
    DatePicker,
    Space,
    Modal,
    TimePicker,
    Statistic
} from 'antd';
import {
    UserOutlined, LaptopOutlined, NotificationOutlined, SearchOutlined, WalletOutlined, GlobalOutlined,
    HomeOutlined, AppstoreOutlined, TeamOutlined, CompassOutlined, ReconciliationOutlined
} from '@ant-design/icons';
import Logo from "../../res/logo_2.png";
import {
    staffFlightColumns,
    topCustomerColumnsPur,
    topCustomerColumnsCom,
    airportColumns,
    airplaneColumns,
    agentColumnsPur, agentColumnsCom, destColumns
} from "./res"
import {NavLink} from "react-router-dom";
import Cookies from "js-cookie";
import {Bar, Pie} from "react-chartjs-2";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const breadcrumbMatch = {"0": "Home", "1": "Flights", "2": "Flights", "3": "Flights", "4": "Resources",
    "5":"Resources", "6":"Booking Agent", "7": "Customers", "8": "Destination", "9": "Operation Report"}

let modal_key = 0;

class OperationReport extends React.Component{
    constructor(props) {
        super(props);
        this.state = {totTickets: null, totSaleData: [], revTM: [], revLY: []}
    }

    async componentDidMount() {
        await this.fetchData({queryType: "revenue"})
    }

    async fetchData(values){
        let response;
        let responseMonth;
        let responseDirect;
        let responseIndirect;
        let dataSales = {
            labels: [],
            datasets: [
                {
                    label: 'Total Sales',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: []
                }]
        };

        const dataPieTM = {
            labels: ["Direct", "Indirect"],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                ]
            }]
        };

        const dataPieLY = {
            labels: ["Direct", "Indirect"],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                ]
            }]
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(values),
            credentials: "include"
        };
        if (values["queryType"] === "totTickets"){
            response = await fetch("http://localhost:3000/api/staff/report", requestOptions).then(response => response.json())
            responseMonth = await fetch("http://localhost:3000/api/staff/reportByMonth", requestOptions).then(responseMonth => responseMonth.json())
            console.log(responseMonth);
            for (let i=responseMonth.length - 1; i>=0; i--){
                dataSales.labels.push(responseMonth[i]["pdate"]);
                dataSales.datasets[0].data.push(responseMonth[i]["sales"]);
            }
            this.setState({
                totTickets: response[0]["total"],
                totSaleData: dataSales,
            });
            ReactDOM.render(
                <Bar
                    data={this.state.totSaleData}
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
                    }
                />,
                document.getElementById("totalSalesWrapper"))
        }
        else if (values["queryType"] === "revenue"){
            responseDirect = await fetch("http://localhost:3000/api/staff/revenueDirect", requestOptions).then(responseDirect => responseDirect.json())
            responseIndirect = await fetch("http://localhost:3000/api/staff/revenueIndirect", requestOptions).then(responseDirect => responseDirect.json())
            dataPieTM.datasets[0].data.push(responseDirect["lastmonth"][0]["tot_direct"])
            dataPieLY.datasets[0].data.push(responseDirect["lastyear"][0]["tot_direct"])
            dataPieTM.datasets[0].data.push(responseIndirect["lastmonth"][0]["tot_indirect"])
            dataPieLY.datasets[0].data.push(responseIndirect["lastyear"][0]["tot_indirect"])
            this.setState({revTM: dataPieTM, revLY: dataPieLY})
            ReactDOM.render(
                <div>
                    <div style={{fontSize:"1.1rem"}}>Last three months:</div>
                    <Pie data={this.state.revTM}/>
                    <div style={{fontSize:"1.1rem"}}>Last year:</div>
                    <Pie data={this.state.revLY}/>
                </div>
                , document.getElementById("revenueWrapper"))
            console.log(responseDirect);
            console.log(responseIndirect);
        }
    }

    render() {
        const onFinish = async (values) => {
            // console.log("on finish");
            values["queryType"] = "totTickets"
            this.fetchData(values);
        }

        const onFinishFailed = (err) => {

        }

        return(
            <div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={12}>
                        <h3>Revenue Comparison</h3>
                        <div id="revenueWrapper"/>
                    </Col>
                    <Col span={12}>
                        <h3>Total amount of tickets sold:{this.state.totTickets}</h3>
                        <Form
                            name="searchFlightByUser"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}>
                            <Row gutter={{ xs: 4, sm: 8, md: 12, lg: 16 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                                <Col span={8} style={{paddingLeft:"0"}}>
                                    <Form.Item
                                        name="startdate"
                                        rules={[{ required: true, message: 'Please input start date!'}]}
                                        style={{width: "100%", margin:"0"}}>
                                        <DatePicker size="large" placeholder="Start Date" style={{width: "100%"}}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="enddate"
                                        rules={[{ required: true, message: 'Please input end date!'}]}
                                        style={{width: "100%", margin:"0"}}>
                                        <DatePicker size="large" placeholder="End Date" style={{width: "100%"}}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="submit"
                                        rules={[{ required: false, message: 'Departure Airport'}]}
                                        style={{width: "100%", margin:"0"}}>
                                        <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>Search</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <div id="totalSalesWrapper"/>
                    </Col>
                </Row>
            </div>
        )
    }
}

class TopDestinations extends React.Component{
    constructor(props) {
        super(props);
        this.state ={destTM: [], destLY: [], columnDest: destColumns}
    }

    async fetchData(values){
        let response;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(values),
            credentials: "include"
        };
        response = await fetch("http://localhost:3000/api/staff/topDest", requestOptions).then(response => response.json())
        this.setState({destTM: response["lastmonth"], destLY: response["lastyear"]});
    }

    async componentDidMount() {
        this.state.searched = false;
        if (! this.state.searched){
            await this.fetchData({});
        }
        this.state.searched = true;
    }

    render() {
        return (
            <div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={24}>
                        <h3>Top 3 destinations within the last three months:</h3>
                        <Table columns={this.state.columnDest} dataSource={this.state.destTM}/>
                        <br/>
                        <h3>Top 3 destinations within the last year:</h3>
                        <Table columns={this.state.columnDest} dataSource={this.state.destLY}/>
                    </Col>
                </Row>
            </div>
        );
    }

}

class FrequentCustomers extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            columnsCus: topCustomerColumnsPur,
            columnsFlight: staffFlightColumns,
            cusData: [],
            flightData: [],
        }
    }

    async fetchData(values){
        let responseCus;
        let responseFlt;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(values),
            credentials: "include"
        };
        if (values["queryType"] === "customer"){
            responseCus = await fetch("http://localhost:3000/api/staff/freqCustomers", requestOptions).then(responseCus => responseCus.json())
            this.setState({cusData: responseCus});
        }
        else if (values["queryType"] === "flights"){
            responseFlt = await fetch("http://localhost:3000/api/staff/customers-flight", requestOptions).then(responseFlt => responseFlt.json())
            this.setState({flightData: responseFlt});
        }
    }

    async componentDidMount() {
        this.state.searched = false;
        if (! this.state.searched){
            await this.fetchData({
                username: Cookies.get("adminID"),
                queryType: "customer"
            });
        }
        this.state.searched = true;
    }

    render() {
        const onFinish = values => {
            console.log("on finish");
            values["queryType"] = "flights";
            values["adminID"] = Cookies.get("adminID")
            this.fetchData(values);
        };

        const onFinishFailed = errorInfo => {
            alert("Please check the required fields!");
        };

        return (
            <div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={24}>
                        <h3>Top customer within the last year:</h3>
                        <Table columns={this.state.columnsCus} dataSource={this.state.cusData}/>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={24}>
                        <h3>User purchase history:</h3>
                        <Form
                                name="searchFlightByUser"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}>
                                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                                    <Col span={6} style={{paddingLeft:"0"}}>
                                        <Form.Item
                                            name="username"
                                            rules={[{ required: false, message: 'Please input user email!'}]}
                                            style={{width: "100%", margin:"0"}}>
                                            <Input size="large" placeholder="User email" style={{width: "100%"}}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            name="submit"
                                            rules={[{ required: false, message: 'Departure Airport'}]}
                                            style={{width: "100%", margin:"0"}}>
                                            <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>Search</Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        <div id="addAirplaneWrapper"/>
                        <Table columns={this.state.columnsFlight} dataSource={this.state.flightData}/>
                    </Col>
                </Row>
            </div>
        );
    }

}

class StaffAgentTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {searched: false, bookDataLM: [], bookDataLY: [], commissionDataLM:[],
            queryType: this.props.queryType, columnsPur: agentColumnsPur, commissionDataLY:[],
            columnsCom: agentColumnsCom
        };
    }

    async fetchData(values){
        let responsePur;
        let responseCom;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(values),
            credentials: "include"
        };
        responsePur = await fetch("http://localhost:3000/api/staff/agentsOnSales", requestOptions).then(responsePur => responsePur.json())
        responseCom = await fetch("http://localhost:3000/api/staff/agentsOnCommissions", requestOptions).then(responseCom => responseCom.json())
        this.setState({
            bookDataLM: responsePur["lastMonth"],
            bookDataLY: responsePur["lastYear"],
            commissionDataLM: responseCom["lastMonth"],
            commissionDataLY: responseCom["lastYear"],
        });
    }

    async componentDidMount() {
        this.state.searched = false;
        if (! this.state.searched){
            await this.fetchData({username: Cookies.get("adminID")});
        }
        this.state.searched = true;
    }

    render() {
        const onFinish = values => {
            console.log("on finish");
            if (values["start"]) {
                values["start"] = values["start"].format("YYYY-MM-DD");
            }
            if (values["end"]) {
                values["end"] = values["end"].format("YYYY-MM-DD");
            }
            console.log(values);
            this.fetchData(values);
        };

        const onFinishFailed = errorInfo => {
            alert("Please check the required fields!");
        };

        return(
            <div>
                {/*<Form*/}
                {/*    name="basic"*/}
                {/*    initialValues={{ remember: true }}*/}
                {/*    onFinish={onFinish}*/}
                {/*    onFinishFailed={onFinishFailed}>*/}
                {/*    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>*/}
                {/*        <Col span={8}>*/}
                {/*            <Form.Item*/}
                {/*                name="start"*/}
                {/*                rules={[{ required: false, message: 'Start Date'}]}*/}
                {/*                style={{width: "100%", margin:"0"}}>*/}
                {/*                <DatePicker size="large" placeholder="Start Date" style={{width: "100%"}}/>*/}
                {/*            </Form.Item>*/}
                {/*        </Col>*/}
                {/*        <Col span={8}>*/}
                {/*            <Form.Item*/}
                {/*                name="end"*/}
                {/*                rules={[{ required: false, message: 'End Date'}]}*/}
                {/*                style={{width: "100%", margin:"0"}}>*/}
                {/*                <DatePicker size="large" placeholder="End Date" style={{width: "100%"}}/>*/}
                {/*            </Form.Item>*/}
                {/*        </Col>*/}
                {/*        <Col span={8}>*/}
                {/*            <Form.Item*/}
                {/*                name="submit"*/}
                {/*                rules={[{ required: false, message: 'Departure Airport'}]}*/}
                {/*                style={{width: "100%", margin:"0"}}>*/}
                {/*                <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>Search</Button>*/}
                {/*            </Form.Item>*/}
                {/*        </Col>*/}
                {/*    </Row>*/}
                {/*</Form>*/}
                <h3 style={{fontSize: "1.3rem"}}>Top booking agents:</h3>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={12}>
                        <h3> Last Month</h3>
                        <h1> Purchases</h1>
                        <Table columns={this.state.columnsPur} dataSource={this.state.bookDataLM}/>
                        <br/>
                        <h1> Commission</h1>
                        <Table columns={this.state.columnsCom} dataSource={this.state.commissionDataLM}/>
                    </Col>
                    <Col span={12}>
                        <h3> Last Year</h3>
                        <h1> Purchases</h1>
                        <Table columns={this.state.columnsPur} dataSource={this.state.bookDataLY}/>
                        <br/>
                        <h1> Commission</h1>
                        <Table columns={this.state.columnsCom} dataSource={this.state.commissionDataLY}/>
                    </Col>
                </Row>
            </div>
        )
    }
}


class AddAirplane extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        let formRef = React.createRef();
        const onFinish = async (values) => {
            let response;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(values),
                credentials: "include"};
            response = await fetch("http://localhost:3000/api/staff/addPlane", requestOptions);
            if (response.status === 200){
                alert("Add airplane success!");
                ReactDOM.render(
                    (<Table columns={airplaneColumns} dataSource={[{
                        airlineName: values["airlineName"],
                        airplaneID: values["airplaneID"],
                        seats: values["seats"]
                    }]}/>),
                    document.getElementById("addAirplaneWrapper")
                )
            }
            else{
                alert("Add airplane failed!")
            }
            formRef.current.resetFields();
        }

        const onFinishFailed = (values) => {

        }

        return (
            <div>
                <div>
                    <Form
                        ref = {formRef}
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                            <Col span={24}>
                                <h1 style={{fontSize: "1.5rem"}}>Please input the required information below:</h1>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                            <Col span={4}>
                                <Form.Item
                                    name="airlineName"
                                    rules={[{ required: true, message: 'Please input airline name!'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <Input size="large" placeholder="Airline name"/>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="airplaneID"
                                    rules={[{ required: true, message: 'Please input airplane ID'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <Input size="large" placeholder="Airplane ID"/>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="seats"
                                    rules={[{ required: true, message: 'Please input seats'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <Input size="large" placeholder="Seats"/>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="date"
                                    rules={[{ required: false, message: 'Please input arrival time!'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>→Add</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                        <Col span={16} id="addAirplaneWrapper" />
                    </Row>
                </div>
            </div>
        );
    }
}

class AddAirport extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        let formRef = React.createRef();
        const onFinish = async (values) => {
            let response;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(values),
                credentials: "include"};
            response = await fetch("http://localhost:3000/api/staff/addAirport", requestOptions);
            if (response.status === 200){
                alert("Add airport success!");
                ReactDOM.render(
                    (<Table columns={airportColumns} dataSource={[{
                        airportName: values["airportName"],
                        airportCity: values["airportCity"],
                    }]}/>),
                    document.getElementById("addAirportWrapper")
                )
            }
            else{
                alert("Add airport failed!")
            }
            formRef.current.resetFields();
        }

        const onFinishFailed = (values) => {

        }

        return (
            <div>
                <div>
                    <Form
                        ref = {formRef}
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                            <Col span={24}>
                                <h1 style={{fontSize: "1.5rem"}}>Please input the required information below:</h1>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                            <Col span={4}>
                                <Form.Item
                                    name="airportName"
                                    rules={[{ required: true, message: 'Please input airport name!'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <Input size="large" placeholder="Airport name"/>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="airportCity"
                                    rules={[{ required: true, message: 'Please input airport city'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <Input size="large" placeholder="Airport city"/>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="date"
                                    rules={[{ required: false, message: 'Please input arrival time!'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>→Add</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                        <Col span={12} id="addAirportWrapper" />
                    </Row>
                </div>
            </div>
        );
    }
}


class ChangeFlightStatus extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        let formRef = React.createRef();

        const onFinish = async (values) => {
            let response;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(values),
                credentials: "include"};
            response = await fetch("http://localhost:3000/api/staff/changeStatus", requestOptions);
            if (response.status === 200){
                alert("Status change success!");
                const doubleOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        airlineName: values["airlineName"],
                        flightNum: values["flightNum"],
                    }),
                    credentials: "include"};
                const doubleCheck = await fetch("http://localhost:3000/api/search/flight", doubleOptions).then(doubleCheck => doubleCheck.json());
                ReactDOM.render(
                    (<Table columns={staffFlightColumns} dataSource={doubleCheck}/>),
                    document.getElementById("changeTableWrapper")
                )
            }
            else{
                alert("Status change failed!")
            }
            formRef.current.resetFields();
        }

        const onFinishFailed = (values) => {

        }
        return (
            <div>
                <Form
                    ref = {formRef}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                        <Col span={24}>
                            <h1 style={{fontSize: "1.5rem"}}>Please input the required information below:</h1>
                        </Col>
                    </Row>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                        <Col span={4}>
                            <Form.Item
                                name="airlineName"
                                rules={[{ required: true, message: 'Please input airline name!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Input size="large" placeholder="Airline name"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="flightNum"
                                rules={[{ required: true, message: 'Please input flight number!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Input size="large" placeholder="Flight Number"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="status"
                                rules={[{ required: true, message: 'Please input status!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Input size="large" placeholder="Status"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="date"
                                rules={[{ required: false, message: 'Please input arrival time!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>→Change</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={24} id="changeTableWrapper" />
                </Row>
            </div>
        );
    }

}

class AddNewFlightPage extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        let formRef = React.createRef();
        const onFinish = async (values) => {
            values["departureDate"] = values["departureDate"].format("YYYY-MM-DD");
            values["arrivalDate"] = values["arrivalDate"].format("YYYY-MM-DD");
            values["departureTime"] =values["departureDate"] + " " + values["departureTime"].format("hh:mm:ss");
            values["arrivalTime"] = values["arrivalDate"] + " " + values["arrivalTime"].format("hh:mm:ss");
            console.log(values);
            let response;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(values),
                credentials: "include"};
            response = await fetch("http://localhost:3000/api/staff/addFlight", requestOptions);
            if (response.status === 200){
                alert("Add flight success!");
                const doubleOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        airlineName: values["airlineName"],
                        flightNum: values["flightNum"],
                    }),
                    credentials: "include"};
                const doubleCheck = await fetch("http://localhost:3000/api/search/flight", doubleOptions).then(doubleCheck => doubleCheck.json());
                ReactDOM.render(
                    (<Table columns={staffFlightColumns} dataSource={doubleCheck}/>),
                    document.getElementById("addFlightWrapper")
                )
            }
            else{
                alert("Add flight failed!")
            }
            formRef.current.resetFields();
        }

        const onFinishFailed = (values) => {

        }
        return(
            <div>
                <Form
                    ref = {formRef}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                        <Col span={24}>
                            <h1 style={{fontSize: "1.5rem"}}>Please input the required information below:</h1>
                        </Col>
                    </Row>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                        <Col span={4}>
                            <Form.Item
                                name="airlineName"
                                rules={[{ required: true, message: 'Please input airline name!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Input size="large" placeholder="Airline name"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="flightNum"
                                rules={[{ required: true, message: 'Please input flight number!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Input size="large" placeholder="Flight Number"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="departureAirport"
                                rules={[{ required: true, message: 'Please input departure airport!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Input size="large" placeholder="Departure Airport"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="arrivalAirport"
                                rules={[{ required: true, message: 'Please input arrival airport!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Input size="large" placeholder="Arrival Airport"/>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                        <Col span={4}>
                            <Form.Item
                                name="departureDate"
                                rules={[{ required: true, message: 'Please input departure date!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <DatePicker size="large" placeholder="Departure date" style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="departureTime"
                                rules={[{ required: true, message: 'Please input departure time!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <TimePicker size="large" placeholder="Departure time" style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="arrivalDate"
                                rules={[{ required: true, message: 'Please input arrival date!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <DatePicker size="large" placeholder="Arrival date" style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="arrivalTime"
                                rules={[{ required: true, message: 'Please input arrival time!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <TimePicker size="large" placeholder="Arrival time" style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                        <Col span={4}>
                            <Form.Item
                                name="price"
                                rules={[{ required: true, message: 'Please input price!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Input size="large" placeholder="Price"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="status"
                                rules={[{ required: true, message: 'Please input flight status!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Input size="large" placeholder="Flight status"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="airplaneID"
                                rules={[{ required: true, message: 'Please input airplane ID!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Input size="large" placeholder="Airplane ID" style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="submit"
                                rules={[{ required: false, message: 'Please input arrival time!'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>→Add</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={24} id="addFlightWrapper"/>
                </Row>
            </div>
        )
    }
}


class StaffMyFlightTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {searched: false, data: [], queryType: this.props.queryType, columns: staffFlightColumns};
    }

    async fetchData(values){
        let response
        values["username"] = Cookies.get("adminID");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(values),
            credentials: "include"
        };
        response = await fetch("http://localhost:3000/api/staff/flights", requestOptions).then(response => response.json())
        for (let i=0; i<response.length; i++){
            response[i]["departure_time"] = response[i]["departure_time"].slice(0, -5);
            response[i]["arrival_time"] = response[i]["arrival_time"].slice(0, -5);
        }
        this.setState({data: response});
        return response
    }

    async componentDidMount() {
        this.state.searched = false;
        if (! this.state.searched && this.props.onLoadQuery === true){
            await this.fetchData({username: Cookies.get("adminID")});
        }
        this.state.searched = true;
    }

    render() {
        const onFinish = values => {
            console.log("on finish");
            if (values["start"]) {
                values["start"] = values["start"].format("YYYY-MM-DD");
            }
            if (values["end"]) {
                values["end"] = values["end"].format("YYYY-MM-DD");
            }
            console.log(values);
            this.fetchData(values);
        };

        const onFinishFailed = errorInfo => {
            alert("Please check the required fields!");
        };

        return(
            <div>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                        <Col span={8}>
                            <Form.Item
                                name="start"
                                rules={[{ required: false, message: 'Start Date'}]}
                                style={{width: "100%", margin:"0"}}>
                                <DatePicker size="large" placeholder="Start Date" style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="end"
                                rules={[{ required: false, message: 'End Date'}]}
                                style={{width: "100%", margin:"0"}}>
                                <DatePicker size="large" placeholder="End Date" style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="submit"
                                rules={[{ required: false, message: 'Departure Airport'}]}
                                style={{width: "100%", margin:"0"}}>
                                <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>Search</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={24}>
                        <Table columns={this.state.columns} dataSource={this.state.data}/>
                    </Col>
                </Row>
        </div>
        )
    }
}


class AdminSiderMenu extends React.Component{
    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick(item){
        this.props.onMenuChange(item);
    }

    render(){
        return(
            <Menu
                mode="inline"
                defaultSelectedKeys='0'
                defaultOpenKeys={['flights']}
                style={{ height: '100%', borderRight: 0 }}
                onClick={this.handleMenuClick}
            >
                <Menu.Item key="0" icon={<HomeOutlined />}>Home</Menu.Item>
                <SubMenu key="flights" icon={<GlobalOutlined />} title="Flights">
                    <Menu.Item key="1">My Flights</Menu.Item>
                    <Menu.Item key="2">Add New Flight</Menu.Item>
                    <Menu.Item key="3">Change Flight Status</Menu.Item>
                </SubMenu>
                <SubMenu key="resources" icon={<AppstoreOutlined />} title="Resources">
                    <Menu.Item key="4">Add Airport</Menu.Item>
                    <Menu.Item key="5">Add Airplane</Menu.Item>
                </SubMenu>
                <Menu.Item key="6" icon={<TeamOutlined />}>Booking Agents</Menu.Item>
                <Menu.Item key="7" icon={<UserOutlined />} >Customers</Menu.Item>
                <Menu.Item key="8" icon={<CompassOutlined />}>Destination</Menu.Item>
                <Menu.Item key="9" icon={<ReconciliationOutlined />}>Operation Report</Menu.Item>
            </Menu>
        )
    }
}

class StaffPage extends React.Component{
    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.state = {currentPanel: "0"}
    }

    componentDidMount() {
        console.log("NEW");
        this.checkLoginStatus();
    }

    handleMenuClick(menu_id){
        this.setState({currentPanel: menu_id["key"]});
    }

    async handleSignOut(){
        await Cookies.set("adminRole", undefined);
        await Cookies.set("adminLoggedIn", undefined);
        await Cookies.set("adminID", undefined);
    }

    async checkLoginStatus(){
        let loggedIn = await Cookies.get("adminLoggedIn") !== "true";
        let role = await Cookies.get("adminRole") !== "Airline Staff";
        if (loggedIn || role){
            await alert("User authentication failed, please login again!");
            this.props.history.push('/admin')
        }
        else{
            let checkOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: Cookies.get("adminID")
                }),
                credentials: "include"
            }
            console.log()
            let loginCheckResponse = await fetch('http://localhost:3000/api/staff/auth', checkOptions);

            if (loginCheckResponse.status !== 200){
                await alert("User authentication failed, please login again!");
                this.props.history.push('/admin')
            }
            else{
                let loginChkResponse_json = loginCheckResponse.json();
                console.log(loginChkResponse_json);
            }
        }
    }

    render() {
        let adminBreadcrumb = (
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Portal</Breadcrumb.Item>
                <Breadcrumb.Item>{breadcrumbMatch[this.state.currentPanel]}</Breadcrumb.Item>
            </Breadcrumb>
        );

        let contentWrapper;

        if (this.state.currentPanel === "0"){
            contentWrapper = (
                <div style={{verticalAlign: "middle"}}>
                    <h1 style={{fontSize: "1.8rem"}}>Welcome to AirTraveller® Administration Portal!</h1>
                    <br/>
                    <h1 style={{fontSize: "1.3rem"}}>You are currently signed in as role: {Cookies.get("adminRole")}</h1>
                    <h1 style={{fontSize: "1.3rem"}}>Account: {Cookies.get("adminID")}</h1>
                </div>
            )
        }
        else if (this.state.currentPanel === "1"){
            contentWrapper = (
                <div style={{width: "100%"}}>
                    <StaffMyFlightTable queryType="staff_My_Flight" onLoadQuery={true}/>
                </div>
            )
        }
        else if (this.state.currentPanel === "2"){
            contentWrapper = (
                <div style={{width: "100%"}}>
                    <AddNewFlightPage/>
                </div>
            )
        }
        else if (this.state.currentPanel === "3"){
            contentWrapper = (
                <div>
                    <ChangeFlightStatus/>
                </div>
            )
        }
        else if (this.state.currentPanel === "4"){
            contentWrapper = (
                <div>
                    <AddAirport />
                </div>
            )
        }
        else if (this.state.currentPanel === "5"){
            contentWrapper = (
                <div>
                    <AddAirplane />
                </div>
            )
        }
        else if (this.state.currentPanel === "6") {
            contentWrapper = (
                <div>
                    <StaffAgentTable/>
                </div>
            )
        }
        else if (this.state.currentPanel === "7"){
            contentWrapper = (
                <div>
                    <FrequentCustomers/>
                </div>
            )
        }
        else if (this.state.currentPanel === "8"){
            contentWrapper = (
                <div>
                    <TopDestinations/>
                </div>
            )
        }
        else if (this.state.currentPanel === "9"){
            contentWrapper = (
                <div>
                    <OperationReport />
                </div>
            )
        }

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
                                    <NavLink to="/admin" onClick={this.handleSignOut}>Sign out</NavLink>
                                    <Divider type="vertical" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Header>
                <Layout>
                    <Sider width={200} className="site-layout-background">
                        <AdminSiderMenu onMenuChange={this.handleMenuClick}/>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        {adminBreadcrumb}
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}>
                            {contentWrapper}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default StaffPage;