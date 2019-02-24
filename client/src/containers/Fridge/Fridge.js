import React, { Component } from 'react'
import FridgeItems from '../../components/FridgeItems/FridgeItems'
import { Redirect } from 'react-router-dom'

// redux
import { connect } from 'react-redux'
import * as actions from '../../store/actions/'


class Fridge extends Component {
  componentWillMount() {
    if (this.props.loggedIn) {
      if (this.props.items.length === 0) {
        const fridgeId = (this.props.openFridgeId !== null && this.props.openFridgeId !== this.props.fridgeId) ? this.props.openFridgeId : this.props.fridgeId
        this.props.fetchItems(this.props.items, fridgeId)
      }
      this.props.getFridges(this.props.userId)
    }
  }

  render() {
    if (!this.props.loggedIn) {
      return <Redirect to="/login" />
    }
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
    loading: state.fridge.loading,
    loggedIn: state.auth.loggedIn,
    fridgeId: state.auth.fridgeId,
    userId: state.auth.userId,
    openFridgeId: state.fridge.openFridgeId,
    newLogin: state.auth.newLogin
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchItems: (loadedItems, fridgeId) => dispatch(actions.fetchFridgeItemsAsync(loadedItems, false, false, false, fridgeId)),
    getFridges: userId => dispatch(actions.getFridgesAsync(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fridge)
