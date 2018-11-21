import React from 'react'
import './Navigation.css';
import Logo from '../../assets/icons/fridge.png';
import NavigationItem from './NavigationItem/NavigationItem';

const Navigation = () => (
  <div className="Navigation">
    <input type="checkbox" id="toggle" />
    <label htmlFor="toggle" className="button">Navigate to...</label>
    <ul className="Menu">
      <NavigationItem path="/" logo><img src={Logo} alt="Fridge Logo" /></NavigationItem>
      <NavigationItem path="/">Fridge</NavigationItem>
      <NavigationItem path="/add">Add Ingredient</NavigationItem>
    </ul>
  </div>
)

export default Navigation
