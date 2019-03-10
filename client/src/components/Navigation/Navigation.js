import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Navigation.scss';
import Logo from '../../assets/icons/fridge.png';
import NavigationItem from './NavigationItem/NavigationItem';

class Navigation extends Component {
  render() {
return (
      <div className="Navigation">
    <input type="checkbox" id="toggle" />
    <label htmlFor="toggle" className="button">Navigate to...</label>
    <ul className="Menu">
      <NavigationItem link="/" logo><img src={Logo} alt="Fridge Logo" /></NavigationItem>
      {this.props.loggedIn ? <NavigationItem path="/">Fridge</NavigationItem> : null}
      {this.props.loggedIn ? <NavigationItem path="/add">Add Ingredient</NavigationItem> : null}
      {this.props.loggedIn ? <NavigationItem path="/access">Access</NavigationItem> : null}
      {!this.props.loggedIn ? <NavigationItem path="/signup">Signup</NavigationItem> : null}
      {!this.props.loggedIn ? <NavigationItem path="/login">Login</NavigationItem> : <NavigationItem path="/logout">Logout</NavigationItem>}
    </ul>
  </div>
  )
}
}

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn
  }
}

export default connect(mapStateToProps)(Navigation)
