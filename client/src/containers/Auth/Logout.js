import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as actions from '../../store/actions'

class Logout extends Component {

    state = { redirect: false }

    componentWillMount() {
        if (this.props.loggedIn) {
            this.props.resetLogout()
            this.props.logout()
        }
        this.setState({ redirect: true })
    }

    render() {
        return <Redirect to="/login" />
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.auth.loggedIn
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.authLogoutAsync()),
        resetLogout: () => dispatch(actions.resetLogout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)