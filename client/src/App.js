import React, { PureComponent } from 'react'
import { Switch, Route, NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'

// Redux
import { connect } from 'react-redux'
import * as actions from './store/actions'

// HOC
import withAuth from './hoc/withAuth'

// Containers & Components
import Layout from './containers/Layout/Layout'
import Fridge from './containers/Fridge/Fridge'
import Auth from './containers/Auth/Auth'
import Logout from './containers/Auth/Logout'
import Signup from './containers/Auth/Signup'
import AddItem from './containers/Fridge/AddItem/AddItem'
import EditItem from './containers/Fridge/EditItem/EditItem'
import Access from './containers/Fridge/Access/Access'

class App extends PureComponent {

  componentWillMount() {
    this.props.isLoggedIn()
  }

  render() {
    return (
      <Layout>
      <Switch>
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Auth} />
      <Route path="/logout" component={withAuth(Logout)} />
      <Route exact path="/" component={withAuth(Fridge)} />
      <Route path="/add" component={withAuth(AddItem)} />
      <Route path="/access" component={withAuth(Access)} />
      <Route path="/edit/:id" component={withAuth(EditItem)} />
      <Route render={() => <div id="error">Page was not found. Click <NavLink to="/">here</NavLink> to go back to the fridge!</div> } />
      </Switch>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    isLoggedIn: () => dispatch(actions.authIsLoggedInAsync())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
