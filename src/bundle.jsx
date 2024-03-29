import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

const { lazy, Suspense } = React

const LoginPage = lazy(() => import('./screens/User/Login'))
const RegistrationPage = lazy(() => import('./screens/User/Registration'))
const AdminRouter = lazy(() => import('./screens/Admin'))
const SearchPage = lazy(() => import('screens/Search'))
const StatusPage = lazy(() => import('./screens/Status'))
const ProfilePage = lazy(() => import('./screens/Profile'))
const HomePage = lazy(() => import('./screens/Home'))
const StaffPage = lazy(() => import('./screens/Staff'))
const TsTestPage = lazy(() => import('./screens/TypeScriptTest'))

const MainRouter = () => {
  return (
      <BrowserRouter>
        <Suspense fallback={<div />}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/registration" component={RegistrationPage} />
            <Route path="/admin" component={AdminRouter} />
            <Route path="/search" component={SearchPage} />
            <Route path="/status" component={StatusPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/admin/staff" component={StaffPage} />
            <Route path="/ts-test">
              <TsTestPage message="TypeScript!"/>
            </Route>
          </Switch>
        </Suspense>
      </BrowserRouter>
  )
}


ReactDOM.render(<MainRouter />, document.getElementById('root'))
export default MainRouter
