import React from 'react'
import './FridgeItem.scss'
import { Link } from 'react-router-dom'
import transformExpiry from '../../../utils/transformExpiry'

const fridgeItem = (props) => {
  let itemImage = ""
  try {
    itemImage = require(`../../../assets/icons/${props.type}.png`)
  } catch (e) {
    itemImage = require(`../../../assets/icons/default.png`)
  }

  const expiry = transformExpiry(props.expiring)

  return (
    <Link to={"edit/" + props.id}>
      <div className="FridgeItem">
        <img src={itemImage} alt={itemImage} />
        <span className="ItemName">{props.name}</span>
        <span className="ItemDescription">
          <center>
            <b>{props.name}</b><br />
            {props.comment} <br /><br />
            <b>Is it open?</b> {props.open === 'true' ? "Yes" : "No"}<br />
            <b>Weight/Quantity Left</b> {props.weight}<br />
            <b className={expiry.className}>{expiry.format} ({expiry.date})</b>
          </center>
        </span>
      </div>
    </Link>
  )
}

export default fridgeItem
