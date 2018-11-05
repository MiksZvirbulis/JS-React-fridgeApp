import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

// Containers & Components
import Layout from './containers/Layout/Layout'
import Fridge from './containers/Fridge/Fridge'
import AddItem from './containers/Fridge/AddItem/AddItem'

class App extends Component {
  render() {
    return (
      <Layout>
        <Switch>
          <Route exact path="/" component={Fridge} />
          <Route path="/add" component={AddItem} />
        </Switch>
      </Layout>
    );
  }
}

export default App
