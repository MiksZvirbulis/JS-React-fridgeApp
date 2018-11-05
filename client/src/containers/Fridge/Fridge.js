// component
import React, { Component } from 'react'
import './Fridge.css'
import FridgeItems from '../../components/FridgeItems/FridgeItems'

// redux
import { connect } from 'react-redux'
import * as actions from '../../store/actions/'

class Fridge extends Component {
  componentDidMount() {
    this.props.fetchItems()
  }

  render() {
    return (
      <div className="Fridge">
        <h1>Fridge Items</h1>
        <FridgeItems />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    items: state.fridge.items
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchItems: () => dispatch(actions.fetchFridgeItemsAsync())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fridge)
