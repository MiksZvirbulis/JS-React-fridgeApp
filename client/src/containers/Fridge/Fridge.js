// component
import React, { Component } from 'react'
import './Fridge.css'
import FridgeItems from '../../components/FridgeItems/FridgeItems'

// redux
import { connect } from 'react-redux'
import * as actions from '../../store/actions/'

class Fridge extends Component {
  componentDidMount() {
    if (this.props.items.length <= 0) {
      this.props.fetchItems()
    }
  }

  render() {
    return (
      <div className="Fridge">
        <h1>Fridge Items</h1>
        {this.props.loading ? <div className="Loader"></div> : <FridgeItems items={this.props.items} />}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    items: state.fridge.items,
    loading: state.fridge.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchItems: () => dispatch(actions.fetchFridgeItemsAsync())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fridge)
