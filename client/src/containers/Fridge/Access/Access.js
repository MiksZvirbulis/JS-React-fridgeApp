import React, { Component } from 'react'

// Utilities
import Input from '../../../components/Input/Input'
import updateObject from '../../../utils/updateObject'
import errorHandler from '../../../utils/errorHandler'
import checkValidity from '../../../utils/checkValidity'

// redux
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'

class Access extends Component {
  state = {
    formData: {
      username: {
        elementType: 'input',
        elementConfig: {
          placeholder: 'Username to give access',
          type: 'text'
        },
        validation: {
          minLength: 4,
          maxLength: 32,
          isRequired: true
        },
        valid: false,
        value: ''
      },
    },
    formValid: false,
    error: null
  }

  componentWillMount() {
    if (this.props.userId !== null) {
      this.props.getUserAccess(this.props.userId)
    }
  }

  handleChange = (event, elementId) => {
    let value = ''
    const formElement = this.state.formData[elementId]
    value = event.target.value
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

  handleSubmit = event => {
    event.preventDefault()
    const username = this.state.formData.username.value
    if (this.props.users.findIndex(user => { return user === username } ) === -1) {
      this.props.giveUserAccess({ userId: this.props.userId, username, fridgeId: this.props.fridgeId })
      this.setState({ error: null })
    } else {
      this.setState({ error: username + ' already has access to your fridge!' })
    }
  }

  handleDelete = username => {
    this.props.deleteUserAccess({ userId: this.props.userId, username, fridgeId: this.props.fridgeId })
  }

  render() {
    const formElements = []
    for (let key in this.state.formData) {
      formElements.push({
        id: key,
        config: this.state.formData[key]
      });
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
    let usersWithAccess = this.props.users.map(username => {
      return <span key={username} style={{ cursor: 'pointer' }} onClick={() => this.handleDelete(username)}>{username} </span>
    })
    return (
      <div>
        <h1>Add Access to Your Fridge</h1>
        {this.props.error ? <div id="error">{errorHandler(this.props.error)}</div> : null}
        {this.state.error ? <div id="error">{this.state.error}</div> : null}
        <center><b style={{ color: 'green' }}>Users with Access: {usersWithAccess}</b></center>
        <form onSubmit={this.handleSubmit}>
          {form}
          <button disabled={!this.state.formValid ? 'disabled' : null}>Add Access</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    error: state.fridge.error,
    userId: state.auth.userId,
    users: state.fridge.usersWithAccess,
    fridgeId: state.auth.fridgeId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUserAccess: userId => dispatch(actions.getUserAccessAsync(userId)),
    giveUserAccess: user => dispatch(actions.giveUserAccessAsync(user)),
    deleteUserAccess: user => dispatch(actions.deleteUserAccessAsync(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Access)
