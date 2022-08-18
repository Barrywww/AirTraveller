import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

const LoginPage = lazy(() => import("./user_login"));
const RegistrationPage = lazy(() => import("./user_registration"));
const AdminRouter = lazy(() => import("./admin"));
const SearchPage = lazy(() => import("./search"));
const StatusPage =lazy(() => import("./status"));
const ProfilePage = lazy(() => import("./profile"));
const HomePage = lazy(() => import("./index"))
const StaffPage = lazy(() => import("./staff"))

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
                </Switch>
                </Suspense>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<MainRouter />, document.getElementById("root"));
export {MainRouter}