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

class Signup extends Component {

  componentDidMount() {
    this.props.updateSignUp()
  }

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
          },
          password2: {
            elementType: 'input',
            elementConfig: {
              placeholder: 'Repeat Password',
              type: 'password'
            },
            validation: {
              minLength: 8,
              maxLength: 32,
              sameAs: 'password',
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
        const sameAs = (formElement.validation.sameAs)
        ? this.state.formData[formElement.validation.sameAs].value
        : null
        const updatedFormElement = updateObject(formElement,
          {
            value: value,
            valid: checkValidity(value, formElement.validation, sameAs)
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
        const user = {}
        for (let key in this.state.formData) {
          user[key] = {
            validation: this.state.formData[key].validation,
            value: this.state.formData[key].value
          }
        }
        const userData = {
          ...user
        }
        this.props.signupUser(userData)
      }

    render() {
        const formElements = [];
        for (let key in this.state.formData) {
            formElements.push({
              id: key,
              config: this.state.formData[key]
            });
          }

          let form = formElements.map(element => (
            <Input
              key={element.id}
              elementType={element.config.elementType}
              elementConfig={element.config.elementConfig}
              value={element.config.value}
              valid={element.config.valid}
              changed={(event) => this.handleChange(event, element.id)}
              />
          ))
          if(this.props.signedUp === true) {
            form = <Redirect to="login" />
          } else if(this.props.loggedIn === true) {
            form = <Redirect to="/" />
          }
        return (
        <div>
        <h1>Signup</h1>
        {this.props.error ? <div id="error">{errorHandler(this.props.error)}</div> : null}
        <form onSubmit={this.handleSubmit}>
          {form}
          <button disabled={!this.state.formValid ? 'disabled' : null}>Signup</button>
        </form>
      </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
  return {
    signupUser: user => dispatch(actions.authSignupAsync(user)),
    updateSignUp: () => dispatch(actions.updateSignUp()),
  }
}

const mapStateToProps = state => {
  return {
    error: state.auth.error,
    signedUp: state.auth.signedUp,
    loggedIn: state.auth.loggedIn
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)