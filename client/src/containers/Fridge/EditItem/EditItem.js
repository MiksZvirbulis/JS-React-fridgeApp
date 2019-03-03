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

class EditItem extends Component {

  state = {
    formData: {
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
        valid: true,
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
        valid: true,
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
        valid: true,
        value: ''
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
        valid: true,
        value: null
      },
      comment: {
        elementType: 'textarea',
        elementConfig: {
          placeholder: 'Comment (e.g. Brand is YOYO, might use it for beef stew!)',
          type: 'text'
        },
        validation: {
          minLength: 5,
          maxLength: 360,
          isRequired: true
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
        valid: true,
        value: ''
      }
    },
    formValid: false,
    deleted: false
  }

  componentWillMount() {
    this._isMounted = true
    if (this.props.item.length === 0) {
    Promise.resolve(this.props.fetchItem(this.props.match.params.id))
    .then(response => {
      if (this.props.error) {
        console.log(this.props.error)
      } else {
        let formData = this.state.formData
        for (let key in formData) {
          const element = formData[key]
          let newValue = key === 'expiryDate' ? moment(this.props.item[key]) : this.props.item[key]
          const updatedElement = updateObject(element, { value: newValue } )
          const updatedForm = updateObject(this.state.formData, { [key]: updatedElement })
          if (this._isMounted) {
          this.setState({ formData: updatedForm, deleted: false })
          }
        }
      }
    })
  }
  }

  componentWillUnmount() {
    this._isMounted = false
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
      if (this.state.formData[key].elementType === 'datePicker') {
        value = this.state.formData[key].value._d
      } else {
        value = this.state.formData[key].value
      }
      item[key] = {
        validation: this.state.formData[key].validation,
        value
      }
    }
    this.props.editFridgeItem(this.props.match.params.id, { ...item })
    this.setState({ formValid: false })
  }

  handleDelete = (event) => {
    event.preventDefault()
    if (window.confirm("Are you sure you wish to delete this item?")) {
      this.props.deleteFridgeItem(this.props.match.params.id)
      this.setState({ deleted: true })
    }
  }

  render() {
    const formElements = [];
    for (let key in this.state.formData) {
      formElements.push({
        id: key,
        config: this.state.formData[key]
      })
    }

    const renderElements = formElements.map(element => (
      <Input
        key={element.id}
        elementType={element.config.elementType}
        elementConfig={element.config.elementConfig}
        value={element.config.value}
        valid={element.config.valid}
        changed={(event) => this.handleChange(event, element.id)}
        />
    ))
    const form = (
      <div>
        {renderElements}
      <div className="aligned">
            <button onClick={this.handleSubmit} disabled={!this.state.formValid ? 'disabled' : null}>Edit Item</button>
            <button onClick={this.handleDelete} className="Error">Remove Item</button>
          </div>
      </div>
    )
    let message = ''
    if (this.props.error) {
      message = <div id="error">{errorHandler(this.props.error)}</div>
    }
    if (this.props.added) {
      message = <div id="success">Item was successfully updated!</div>
    }
    let content = this.props.loading ? <div className="Loader"></div> : (
      <div>
        <h1>Edit Item</h1>
        <form>
          {message}
          {form}
        </form>
      </div>
    )
    if (this.props.deleted) {
      content = <Redirect to="/" />
    }
    return content
  }
}

const mapStateToProps = state => {
  return {
    types: state.fridge.types.map(type => { return {value: type, display: type.charAt(0).toUpperCase() + type.slice(1)} }),
    item: state.fridge.item,
    error: state.fridge.error,
    loading: state.fridge.loading,
    added: state.fridge.added,
    deleted: state.fridge.deleted
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchItem: itemId => dispatch(actions.fetchFridgeItemAsync(itemId)),
    editFridgeItem: (itemId, itemData) => dispatch(actions.updateFridgeItemAsync(itemId, itemData)),
    deleteFridgeItem: itemId => dispatch(actions.deleteFridgeItemAsync(itemId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItem)
