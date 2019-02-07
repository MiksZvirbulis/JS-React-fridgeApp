import React from 'react'
import Aux from 'react-aux'
import { Link, NavLink } from 'react-router-dom'

const NavigationItem = (props) => {
  const linkClass = props.logo ? "logo" : null
  return (
    <Aux>
      <li className={linkClass}>
        {
          props.path ?
          <NavLink exact to={props.path}>{props.children}</NavLink>
          :
          <Link to="/">{props.children}</Link>
        }
      </li>
    </Aux>
  )
};

export default NavigationItem
