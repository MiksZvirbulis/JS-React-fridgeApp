// component
import React, { Component } from 'react'
import FridgeItem from './FridgeItem/FridgeItem'
import './FridgeItems.css'
import errorHandler from '../../utils/errorHandler'
import * as actions from '../../store/actions'

// redux
import { connect } from 'react-redux'

class FridgeItems extends Component {
  handleSearch = event => {
    this.props.fetchItems(this.props.items, event.target.value)
  }

  render() {
    let items = ''
    if (this.props.error) {
      items = <div id="error">{errorHandler(this.props.error)}</div>
    } else {
      let loadedItems = this.props.items
      if (this.props.foundItems.length > 0) {
        loadedItems = this.props.foundItems
      }
      items = loadedItems.map(item => {
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
        <div className="Search">
          <input type="text" onChange={this.handleSearch} placeholder="Search for ingredient..." />
        </div>
        {items}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    items: state.fridge.items,
    foundItems: state.fridge.foundItems,
    error: state.fridge.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchItems: (loadedItems, search) => dispatch(actions.fetchFridgeItemsAsync(loadedItems, search))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FridgeItems)
