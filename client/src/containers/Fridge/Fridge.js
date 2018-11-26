// component
import React, { Component } from 'react'
import './Fridge.css'
import FridgeItems from '../../components/FridgeItems/FridgeItems'

// redux
import { connect } from 'react-redux'
import * as actions from '../../store/actions/'

class Fridge extends Component {
  componentDidMount() {
    this.props.fetchItems(this.props.items)
  }

  render() {
    return (
      <div className="Fridge">
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
    fetchItems: (loadedItems) => dispatch(actions.fetchFridgeItemsAsync(loadedItems))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fridge)
