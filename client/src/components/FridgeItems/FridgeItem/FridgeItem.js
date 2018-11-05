import React from 'react'
import './FridgeItem.css'
import moment from 'moment'

const fridgeItem = (props) => {
  let itemImage = ""
  try {
    itemImage = require(`../../../assets/icons/${props.type}.png`)
  } catch (e) {
    itemImage = require(`../../../assets/icons/default.png`)
  }

  return (
    <div className="FridgeItem">
      <img src={itemImage} alt={itemImage} />
      <span className="ItemName">{props.name}</span>
      <span className="ItemDescription">
        <b>Item:</b> {props.name}<br />
        <b>Comment:</b> {props.comment}<br />
        <b>Expiring:</b> {moment(props.expiring).format('DD/MM/YYYY')}<br />
        <b>Open:</b> {props.open === 'true' ? "Yes" : "No"}<br />
        <b>Weight Left:</b> {props.weight}
        </span>
      </div>
    )
  }

  export default fridgeItem
