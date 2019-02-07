import React, { Component } from 'react'
import Navigation from '../../components/Navigation/Navigation'
import './Layout.css'
import Aux from 'react-aux';

class Layout extends Component {
  render() {
    return (
      <Aux>
        <Navigation loggedIn={this.props.loggedIn} />
        <div className="Content">
          {this.props.children}
        </div>
      </Aux>

    )
  }
}

export default Layout
