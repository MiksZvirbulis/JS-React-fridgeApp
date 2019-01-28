// component
import React, { PureComponent } from 'react'
import FridgeItem from './FridgeItem/FridgeItem'
import './FridgeItems.css'
import errorHandler from '../../utils/errorHandler'
import * as actions from '../../store/actions'

// redux
import { connect } from 'react-redux'

class FridgeItems extends PureComponent {

  handleSearch = event => {
    this.props.fetchItems(this.props.items, this.props.foundItems, "search", event.target.value)
  }

  handleSort = event => {
    this.props.fetchItems(this.props.items, this.props.foundItems, "sort", event.target.value)
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
          <select defaultValue="sort_by" onChange={this.handleSort}>
            <option value="sort_by" disabled>Sort by...</option>
            <option value="by_name_asc">By Name (A-Z)</option>
            <option value="by_name_desc">By Name (Z-A)</option>
            <option value="by_exp_desc">By Expiration (closest to farthest)</option>
            <option value="by_exp_asc">By Expiration (farthest to closest)</option>
            <option value="by_date_desc">By Date Added (newest to oldest)</option>
            <option value="by_date_asc">By Date Added (oldest to newest)</option>
          </select>
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
    fetchItems: (loadedItems, foundItems, action, value) => dispatch(actions.fetchFridgeItemsAsync(loadedItems, foundItems, action, value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FridgeItems)
