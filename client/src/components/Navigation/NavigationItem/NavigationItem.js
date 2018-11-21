import React from 'react'
import Aux from 'react-aux'
import { NavLink } from 'react-router-dom'

const NavigationItem = (props) => {
  const linkClass = props.logo ? "logo" : null
  return (
    <Aux>
      <li className={linkClass}>
        {
          props.path ?
          <NavLink exact to={props.path}>{props.children}</NavLink>
          :
          <a href="#/">{props.children}</a>
        }
      </li>
    </Aux>
  )
};

export default NavigationItem
