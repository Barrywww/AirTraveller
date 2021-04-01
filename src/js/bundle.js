import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, NavLink, Link} from 'react-router-dom';

import {
    Layout,
    Menu,
    Divider,
    Row,
    Col,
    Button,
    Typography,
    AutoComplete,
    DatePicker,
    Form,
    Input
} from 'antd';

const LoginPage = lazy(() => import("./user_login"));
const RegistrationPage = lazy(() => import("./user_registration"));
const AdminRouter = lazy(() => import("./admin"));
const SearchPage = lazy(() => import("./search"));
const StatusPage =lazy(() => import("./status"));
const ProfilePage = lazy(() => import("./profile"));
const HomePage = lazy(() => import("./index"))
import StaffPage from "./staff";
import UserHome from "./user_home";

class MainRouter extends React.Component{
    render() {
        return (
            <BrowserRouter>
                <Suspense fallback={<div/>}>
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route path="/login" component={LoginPage} />
                    <Route path="/registration" component={RegistrationPage}/>
                    <Route path="/admin" component={AdminRouter}/>
                    <Route path="/search" component={SearchPage}/>
                    <Route path="/status" component={StatusPage}/>
                    <Route path="/profile" component={ProfilePage}/>
                    <Route path="/admin/staff" component={StaffPage}/>
                    <Route path="/user/home" component={UserHome}/>
                </Switch>
                </Suspense>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<MainRouter />, document.getElementById("root"));
export {MainRouter}