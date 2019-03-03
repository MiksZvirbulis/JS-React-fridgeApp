import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

// Utilities
import Input from '../../../components/Input/Input'
import updateObject from '../../../utils/updateObject'
import errorHandler from '../../../utils/errorHandler'
import checkValidity from '../../../utils/checkValidity'

// date picker
import moment from 'moment'

// redux
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'

class AddItem extends Component {
  state = {
    formData: {
      fridgeId: {
        elementType: 'select',
        elementConfig: {
          placeholder: 'Select fridge...',
          options: [
            ...this.props.fridges
          ]
        },
        validation: {
          isRequired: true
        },
        valid: false
      },
      name: {
        elementType: 'input',
        elementConfig: {
          placeholder: 'Item name',
          type: 'text'
        },
        validation: {
          minLength: 3,
          maxLength: 32,
          isRequired: true
        },
        valid: false,
        value: ''
      },
      weight: {
        elementType: 'input',
        elementConfig: {
          placeholder: 'Item weight (e.g. 5ml, 200g, 1lb, 2kg)',
          type: 'text'
        },
        validation: {
          minLength: 1,
          maxLength: 10,
          isRequired: true
        },
        valid: false,
        value: ''
      },
      type: {
        elementType: 'select',
        elementConfig: {
          placeholder: 'Select item type...',
          options: [
            ...this.props.types
          ]
        },
        validation: {
          isRequired: true
        },
        valid: false
      },
      expiryDate: {
        elementType: 'datePicker',
        elementConfig: {
          placeholderText: 'Select expiry date...',
          type: 'text',
          minDate: moment(),
          dateFormat: 'DD/MM/YYYY'
        },
        validation: {
          isRequired: true,
          dateFormat: true
        },
        valid: false,
        value: null
      },
      comment: {
        elementType: 'textarea',
        elementConfig: {
          placeholder: 'Comment (e.g. Brand is YOYO, might use it for beef stew!)',
          type: 'text'
        },
        validation: {
          minLength: 0,
          maxLength: 360,
          isRequired: false
        },
        valid: true,
        value: ''
      },
      open: {
        elementType: 'select',
        elementConfig: {
          placeholder: 'Is item open...',
          options: [
            { value: true, display: 'Yes' },
            { value: false, display: 'No' }
          ]
        },
        validation: {
          isRequired: true
        },
        valid: false
      }
    },
    formValid: false
  }

  handleChange = (event, elementId) => {
    let value = ''
    const formElement = this.state.formData[elementId]
    if (formElement.elementType === 'datePicker') {
      value = event
    } else {
      value = event.target.value
    }
    const updatedFormElement = updateObject(formElement,
      {
        value: value,
        valid: checkValidity(value, formElement.validation)
      }
    )
    const updatedForm = updateObject(this.state.formData, { [elementId]: updatedFormElement} )
    let formValid = true
    for (let key in updatedForm) {
      formValid = updatedForm[key].valid && formValid
    }
    this.setState({ formData: updatedForm, formValid: formValid })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const item = {}
    for (let key in this.state.formData) {
      let value = ''
      if(this.state.formData[key].elementType === 'datePicker') {
        value = this.state.formData[key].value._d
      } else {
        value = this.state.formData[key].value
      }
      item[key] = {
        validation: this.state.formData[key].validation,
        value
      }
    }
    const itemData = { ...item }
    this.props.addFridgeItem(itemData)
  }

  componentWillMount() {
    this._isMounted = true
    this.props.getFridges(this.props.fridgeId).then(call => {
    if (this.props.fridges.length > 0 && this.props.added === false) {
      const currentForm = { ...this.state.formData }
      currentForm.fridgeId.elementConfig.options = this.props.fridges
      if (this._isMounted) {
        if (this.props.items.length === 0) {
          this.props.fetchItems(this.props.items, this.props.fridgeId)
        }
        this.setState({ formData: currentForm })
      }
    }
    })
  }

  componentWillUnmount() {
    this._isMounted = false
}

  render() {
    const formElements = [];
    for (let key in this.state.formData) {
      formElements.push({
        id: key,
        config: this.state.formData[key]
      });
    }

    const loadedFridges = { ...this.props.fridges }
    let fridges = []
    for (let key in loadedFridges) {
      fridges.push(<option key={loadedFridges[key].id} value={loadedFridges[key].id}>{loadedFridges[key].title}</option>)
    }

    const form = formElements.map(element => (
      <Input
        key={element.id}
        elementType={element.config.elementType}
        elementConfig={element.config.elementConfig}
        value={element.config.value}
        valid={element.config.valid}
        changed={(event) => this.handleChange(event, element.id)}
        />
    ))
    let renderForm = ''
    if (this.props.added) {
      return <Redirect to="/" />
    } else {
      renderForm = (
        <div>
          <h1>Add Item</h1>
          {this.props.error ? <div id="error">{errorHandler(this.props.error)}</div> : null}
          <form onSubmit={this.handleSubmit}>
            {form}
            <button disabled={!this.state.formValid ? 'disabled' : null}>Add Item</button>
          </form>
        </div>
      )
  }
    return renderForm
  }
}

const mapStateToProps = state => {
  return {
    types: state.fridge.types.map(type => { return {value: type, display: type.charAt(0).toUpperCase() + type.slice(1)} }),
    error: state.fridge.error,
    added: state.fridge.added,
    fridgeId: state.auth.fridgeId,
    fridges: state.fridge.fridges,
    userId: state.auth.userId,
    items: state.fridge.items,
    loading: state.fridge.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addFridgeItem: (item) => dispatch(actions.addFridgeItemsAsync(item)),
    getFridges: userId => dispatch(actions.getFridgesAsync(userId)),
    fetchItems: (loadedItems, fridgeId) => dispatch(actions.fetchFridgeItemsAsync(loadedItems, false, false, false, fridgeId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItem)
