import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

// Utilities
import Input from '../../components/Input/Input'
import updateObject from '../../utils/updateObject'
import errorHandler from '../../utils/errorHandler'
import checkValidity from '../../utils/checkValidity'

// redux
import { connect } from 'react-redux'
import * as actions from '../../store/actions'

class Auth extends Component {

    state = {
        formData: {
          username: {
            elementType: 'input',
            elementConfig: {
              placeholder: 'Username',
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
          password: {
            elementType: 'input',
            elementConfig: {
              placeholder: 'Password',
              type: 'password'
            },
            validation: {
              minLength: 8,
              maxLength: 32,
              isRequired: true
            },
            valid: false,
            value: ''
          }
        },
        formValid: false
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
        const userData = {
          username: this.state.formData['username'].value,
          password: this.state.formData['password'].value

        }
        this.props.loginUser(userData)
      }

    render() {
      if (this.props.loggedIn) {
        return <Redirect push to="/" />
      }
        const formElements = [];
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
        return (
        <div>
        <h1>Login</h1>
        {this.props.error ? <div id="error">{errorHandler(this.props.error)}</div> : null}
        <form onSubmit={this.handleSubmit}>
          {form}
          <button disabled={!this.state.formValid ? 'disabled' : null}>Login</button>
        </form>
      </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
  return {
    loginUser: userData => dispatch(actions.authLoginAsync(userData))
  }
}

const mapStateToProps = state => {
  return {
    error: state.auth.error,
    loggedIn: state.auth.loggedIn
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)