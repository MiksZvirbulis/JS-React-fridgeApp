import React from 'react'
import './Navigation.css';
import Logo from '../../assets/icons/fridge.png';
import NavigationItem from './NavigationItem/NavigationItem';

const Navigation = props => (
      <div className="Navigation">
    <input type="checkbox" id="toggle" />
    <label htmlFor="toggle" className="button">Navigate to...</label>
    <ul className="Menu">
      <NavigationItem link="/" logo><img src={Logo} alt="Fridge Logo" /></NavigationItem>
      {props.loggedIn ? <NavigationItem path="/">Fridge</NavigationItem> : null}
      {props.loggedIn ? <NavigationItem path="/add">Add Ingredient</NavigationItem> : null}
      {!props.loggedIn ? <NavigationItem path="/signup">Signup</NavigationItem> : null}
      {!props.loggedIn ? <NavigationItem path="/login">Login</NavigationItem> : <NavigationItem path="/logout">Logout</NavigationItem>}
    </ul>
  </div>
  )

export default Navigation
