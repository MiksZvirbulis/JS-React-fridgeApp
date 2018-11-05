// component
import React, { Component } from 'react'
import FridgeItem from './FridgeItem/FridgeItem'
import './FridgeItems.css'

// redux
import { connect } from 'react-redux'

class FridgeItems extends Component {
  render() {
    let items = ''
    if (this.props.error) {
      items = `${this.props.error.name}: ${this.props.error.message}`
    } else {
      items = this.props.items.map(item => {
        return <FridgeItem
          key={item.id}
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
    items: state.fridge.items,
    error: state.fridge.error
  }
}

export default connect(mapStateToProps)(FridgeItems)
