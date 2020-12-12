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
    Statistic
} from 'antd';
import {UserOutlined, LaptopOutlined, NotificationOutlined, SearchOutlined, WalletOutlined, GlobalOutlined,
HomeOutlined
} from '@ant-design/icons';
import Logo from "../../res/logo_2.png";
import {agentFlightColumns, topCustomerColumnsPur, topCustomerColumnsCom} from "./res"
import {NavLink} from "react-router-dom";
import Cookies from "js-cookie";
import {Bar} from "react-chartjs-2";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const breadcrumbMatch = {"0": "Home", "1": "Flights", "2": "Flights", "3": "Customer", "4": "Commission"}

let modal_key = 0;

class Commission extends React.Component{
    constructor(props) {
        super(props);
        this.state = {commLT: 0, avgLT: 0, commCus: 0, avgCus: 0}
    }

    async fetchData(values){
        let response;
        if(values["queryType"] === "commDefault") {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values),
                credentials: "include"
            };
            response = await fetch("http://localhost:3000/api/agent/commission", requestOptions).then(response => response.json())
            let comm = 0;
            for (let i=0; i<response.length; i++){
                comm += response[i]["price"];
            }
            this.setState({commLT: comm, avgLT: comm/response.length});
        }
        else if (values["queryType"] === "comm"){
            if (values["start"]){
                values["start"] = values["start"].format("YYYY-MM-DD");
            }
            if (values["end"]){
                values["end"] = values["end"].format("YYYY-MM-DD");
            }
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values),
                credentials: "include"
            };
            response = await fetch("http://localhost:3000/api/agent/commission", requestOptions).then(response => response.json())
            let commCus = 0;
            for (let i=0; i<response.length; i++){
                commCus += response[i]["price"];
            }
            this.setState({commCus: commCus, avgCus: commCus/response.length});
            ReactDOM.render((
                <div>
                    <Statistic title="Commission in selected range" value={this.state.commCus} />
                </div>
            ),document.getElementById("selectedComWrapper"))
            ReactDOM.render((
                <div>
                    <Statistic title="Avg. commission per ticket in selected range" value={this.state.avgCus} />
                </div>
            ),document.getElementById("selectedAvgWrapper"))
        }
    }

    async componentDidMount() {
        this.state.searched = false;
        if (! this.state.searched){
            await this.fetchData({queryType: "commDefault"});
        }
        this.state.searched = true;
    }

    render(){
        const onFinish = async (values) => {
            console.log("on finish");
            values["queryType"] = "comm";
            await this.fetchData(values);
        };

        const onFinishFailed = errorInfo => {
            alert("Please check the required fields!");
        };


        return(
            <div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={8}>
                        <Statistic title="Commission in last 30 days" value={this.state.commLT} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Avg. commission per ticket in last 30 days" value={this.state.avgLT} />
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={24}>
                        <Form
                            name="spending"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                                <Col span={5} style={{paddingLeft: "0"}}>
                                    <Form.Item
                                        name="start"
                                        rules={[{ required: true, message: 'Please input start date!'}]}
                                        style={{width: "100%", margin:"0"}}>
                                        <DatePicker size="large" placeholder="Start Date" style={{width: "100%"}}/>
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
                                    <Form.Item
                                        name="end"
                                        rules={[{ required: true, message: 'Please input end date'}]}
                                        style={{width: "100%", margin:"0"}}>
                                        <DatePicker size="large" placeholder="End Date" style={{width: "100%"}}/>
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
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
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="left" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={8}>
                        <div id="selectedComWrapper"/>
                    </Col>
                    <Col span={8}>
                        <div id="selectedAvgWrapper"/>
                    </Col>
                </Row>
            </div>
        )
    }

}

class TopCustomers extends React.Component{
    constructor(props) {
        super(props);
        this.state = {dataPur: [], dataCom: []}
    }

    render() {
        const onFinish = async (values) => {
            console.log(values);
            if (values["start"]) {
                values["start"] = values["start"].format("YYYY-MM-DD");
            }
            if (values["end"]) {
                values["end"] = values["end"].format("YYYY-MM-DD");
            }
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values),
                credentials: "include"
            };
            let responsePur = await fetch("http://localhost:3000/api/agent/fathers", requestOptions).then(response => response.json()).catch(err => {
                alert("Query Failed!")
            })
            let responseCom = await fetch("http://localhost:3000/api/agent/mothers", requestOptions).then(response => response.json()).catch(err => {
                alert("Query Failed!")
            })
            this.setState({dataPur: responsePur});
            this.setState({dataCom: responseCom});
            let namesPur = [];
            let namesCom = [];
            let tickets = [];
            let commission = [];
            for (let i = 0; i < responsePur.length; i++) {
                namesPur.push(responsePur[i]["name"]);
                tickets.push(responsePur[i]["books"]);
            }
            for (let i = 0; i < responseCom.length; i++) {
                namesCom.push(responseCom[i]["name"]);
                commission.push(responseCom[i]["commission"]);
            }
            let dataPur = {
                labels: namesPur,
                datasets: [
                    {
                        label: 'Purchases',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: tickets
                    }]
            };
            let dataCom = {
                labels: namesCom,
                datasets: [
                    {
                        label: 'Commission',
                        backgroundColor: 'rgba(66,145,245,0.2)',
                        borderColor: 'rgba(66,145,245,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(66,145,245,0.4)',
                        hoverBorderColor: 'rgba(66,145,245,1)',
                        data: commission
                    }]
            };
            ReactDOM.render(
                <Bar
                    data={dataPur}
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
                document.getElementById("chartWrapperPur")
            );
            ReactDOM.render(
                <Bar
                    data={dataCom}
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
                document.getElementById("chartWrapperCom")
            )
        }
        const onFinishFailed = (err) => {
        }
        return(
            <div>
                <div id="modalHolder"/>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                        <Col span={10}>
                            <Form.Item
                                name="start"
                                rules={[{ required: false, message: ''}]}
                                style={{width: "100%", margin:"0"}}>
                                <DatePicker size="large" placeholder="Start time" style={{width: "100%"}} />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                name="end"
                                rules={[{ required: false, message: ''}]}
                                style={{width: "100%", margin:"0"}}>
                                <DatePicker size="large" placeholder="End time" style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="submit"
                                rules={[{ required: false, message: ''}]}
                                style={{width: "100%", margin:"0"}}>
                                <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>Search</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={12}>
                        <h1>Total Purchases</h1>
                        <Table columns={topCustomerColumnsPur} dataSource={this.state.dataPur}/>
                    </Col>
                    <Col span={12}>
                        <h1>Commission</h1>
                        <Table columns={topCustomerColumnsCom} dataSource={this.state.dataCom}/>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={12}>
                        <div id="chartWrapperPur">
                        </div>
                    </Col>
                    <Col span={12}>
                        <div id="chartWrapperCom">
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

const PurchaseModal = (props) => {
    const [visible, setVisible] = React.useState(true);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [modalText, setModalText] = React.useState('Please input the email of the customer:');
    const handleOk = () => {
        setModalText('Purchase Success!');
        setConfirmLoading(true);
        setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
        }, 1000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };

    const onFinish = async (values) => {
        console.log("on finish");
        // console.log(props.data);
        let post_values = {
            agentID: 1,
            email: document.getElementById("basic1_email").getAttribute("value"),
            flightNum: props.data["flight_num"],
            airlineName: props.data["airline_name"]
        };
        console.log(post_values);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post_values),
            credentials: "include"
        };
        let response = await fetch('http://localhost:3000/api/agent/purchase', requestOptions);
        if (response.status === 200){
            handleOk();
        }
    };

    const onFinishFailed = errorInfo => {
        alert("Please check the required fields!");
    };

    return (
        <>
        <Form
            name="basic1"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            preserve={false}
            <Modal
                title="Purchase Ticket"
                visible={visible}
                okButtonProps={{htmlType: "submit"}}
                onOk={onFinish}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}>
                <p>{modalText}</p>
                    <Form.Item
                        name="email"
                        rules={[
                            {required: true,message: 'Please input your customer email!'},
                        ]}
                        style={{width:"100%", margin: "10px 0"}}>
                        <Input placeholder="User Email"/>
                    </Form.Item>
            </Modal>
        </Form>
        </>
    );
};

class AgentMyFlightTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {searched: false, data: [], queryType: this.props.queryType, columns: agentFlightColumns};
    }

    async fetchData(){
        let response
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({email: Cookies.get("adminID")}),
            credentials: "include"
        };
        response = await fetch("http://localhost:3000/api/agent/flight", requestOptions).then(response => response.json())
        for (let i=0; i<response.length; i++){
            response[i]["departure_time"] = response[i]["departure_time"].slice(0, -5);
            response[i]["arrival_time"] = response[i]["arrival_time"].slice(0, -5);
        }
        this.setState({data: response});
        return response
    }

    async componentDidMount() {
        if (! this.state.searched && this.props.onLoadQuery === true){
            await this.fetchData();
        }
    }

    render() {
        return(
            <Table columns={this.state.columns} dataSource={this.state.data}/>
        )
    }
}

class QueryFlightTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {searched: false, data: [], queryType: this.props.queryType, columns: [],
        showPurMod: false};
    }

    async fetchData(values){
        let response
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(values),
                credentials: "include"};
            response = await fetch("http://localhost:3000/api/search/flight", requestOptions).then(response => response.json()).catch(err => { this.setState({data: []})});
            for (let i=0; i<response.length; i++){
                response[i]["departure_time"] = response[i]["departure_time"].slice(0, -5);
                response[i]["arrival_time"] = response[i]["arrival_time"].slice(0, -5);
            }
        this.setState({data: response});
        return response
    }

    handlePurchaseWithParam(record){
        modal_key ++;
        console.log(record);
        ReactDOM.render(<PurchaseModal key={modal_key} data={record}/>, document.getElementById("modalHolder"));
    }

    render() {
        const onFinish = values => {
            console.log("on finish");
            if (values["password"] !== values["confirmPassword"]){
                alert("Please double check your password!");
                return;
            }
            if (values["date"]) {
                values["date"] = values["date"].format("YYYY-MM-DD");
            }
            console.log(values);
            this.fetchData(values);
        };

        const onFinishFailed = errorInfo => {
            alert("Please check the required fields!");
        };

        const queryFlightColumns = [
            {
                title: 'Airline',
                dataIndex: 'airline_name',
                key: 'airline_name',
            },
            {
                title: 'Flight',
                dataIndex: 'flight_num',
                key: 'flight_num',
            },
            {
                title: 'Origin',
                dataIndex: 'departure_airport',
                key: 'departure_airport',
            },
            {
                title: 'Destination',
                key: 'arrival_airport',
                dataIndex: 'arrival_airport',
            },
            {
                title: 'Departure Time',
                key: 'departure_time',
                dataIndex: 'departure_time',
            },
            {
                title: "Arrival Time",
                key: "arrival_time",
                dataIndex: "arrival_time",
            },
            {
                title: "Price",
                key: "price",
                dataIndex: "price",
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Space size="middle">
                        <a onClick={this.handlePurchaseWithParam.bind(this, record)}>Purchase</a>
                    </Space>
                ),
            }
        ]
        return(
            <div>
                <div id="modalHolder"/>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                            <Col span={4}>
                                <Form.Item
                                    name="srcaptName"
                                    rules={[{ required: false, message: 'Departure Airport'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <Input size="large" placeholder="Departure Airport" />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="dstaptName"
                                    rules={[{ required: false, message: 'Arrival Airport'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <Input size="large" placeholder="Arrival Airport" />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="srcCity"
                                    rules={[{ required: false, message: 'Departure Airport'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <Input size="large" placeholder="Departure City" />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="dstCity"
                                    rules={[{ required: false, message: 'Departure Airport'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <Input size="large" placeholder="Arrival City" />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="date"
                                    rules={[{ required: false, message: 'Departure Airport'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <DatePicker size="large" placeholder="Departure Date" style={{width:"100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item
                                    name="departure_airport"
                                    rules={[{ required: false, message: 'Departure Airport'}]}
                                    style={{width: "100%", margin:"0"}}>
                                    <Button type="primary" htmlType="submit" size={"large"} style={{width:"100%"}}>Search</Button>
                                </Form.Item>
                            </Col>
                    </Row>
                </Form>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between" style={{padding:"10px 0", width: "100%", margin: "0"}}>
                    <Col span={24}>
                        <Table columns={queryFlightColumns} dataSource={this.state.data}/>
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
                defaultOpenKeys={['flights', 'customers']}
                style={{ height: '100%', borderRight: 0 }}
                onClick={this.handleMenuClick}
            >
                <Menu.Item key="0" icon={<HomeOutlined />}>Home</Menu.Item>
                <SubMenu key="flights" icon={<GlobalOutlined />} title="Flights">
                    <Menu.Item key="1">My Flights</Menu.Item>
                    <Menu.Item key="2">Search</Menu.Item>
                </SubMenu>
                <SubMenu key="customers" icon={<UserOutlined />} title="Customers">
                    <Menu.Item key="3">View Top Customers</Menu.Item>
                </SubMenu>
                <Menu.Item key="4" icon={<WalletOutlined />}>Commission</Menu.Item>
            </Menu>
        )
    }
}

class AgentPage extends React.Component{
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
        let role = await Cookies.get("adminRole") !== "Booking Agent";
        if (loggedIn || role){
            await alert("User authentication failed, please login again!");
            this.props.history.push('/admin')
        }
        else{
            let checkOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: Cookies.get("adminID")
                }),
                credentials: "include"
            }
            console.log()
            let loginCheckResponse = await fetch('http://localhost:3000/api/agent/flight', checkOptions);

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
                    <AgentMyFlightTable queryType="agent_My_Flight" onLoadQuery={true}/>
                </div>
            )
        }
        else if (this.state.currentPanel === "2"){
            contentWrapper = (
                <div style={{width: "100%"}}>
                    <QueryFlightTable queryType="query_Flight" onLoadQuery={false}/>
                </div>
            )
        }
        else if (this.state.currentPanel === "3"){
            contentWrapper = (
                <div>
                    <TopCustomers/>
                </div>
            )
        }
        else if (this.state.currentPanel === "4"){
            contentWrapper = (
                <div>
                    <Commission />
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

export default AgentPage;