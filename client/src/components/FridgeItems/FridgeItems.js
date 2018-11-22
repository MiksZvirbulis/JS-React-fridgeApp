// component
import React, { Component } from 'react'
import FridgeItem from './FridgeItem/FridgeItem'
import './FridgeItems.css'
import errorHandler from '../../utils/errorHandler'

// redux
import { connect } from 'react-redux'

class FridgeItems extends Component {
  render() {
    let items = ''
    if (this.props.error) {
      items = <div id="error">{errorHandler(this.props.error)}</div>
    } else {
      items = this.props.items.map(item => {
        return <FridgeItem
          key={item.id}
          id={item.id}
          type={item.type}
          name={item.name}
          comment={item.comment}
          expiring={item.expiryDate}
          weight={item.weight}
          open={item.open} />
      })
    }
    return (
      <div className="FridgeItems">
        {items}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    error: state.fridge.error
  }
}

export default connect(mapStateToProps)(FridgeItems)
