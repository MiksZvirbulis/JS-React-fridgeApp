import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'https://fridge-app-miks.herokuapp.com/api/auth/'

export default function withAuth(AuthComponent) {

    return class extends Component {
        state = {
            redirect: false
        }

        checkAuth = (config = {}) => {
            let call
            if (call) {
                call.cancel("One request at a time!")
            }
            call = axios.CancelToken.source()
            config.cancelToken = call.token
            return axios(config)
        }

        componentDidMount() {
            this._isMounted = true

            this.checkAuth({method: 'get', url: API_URL + 'check', timeout: 60000, withCredentials: true})
            .then(response => {
                if (response.status === 200) {
                    if (this._isMounted) {
                    this.setState({ redirect: false })
                    }
                } else {
                    if (this._isMounted) {
                    this.setState({ redirect: true })
                    }
                }
            })
            .catch(error => {
                if (this._isMounted) {
                    console.error(error)
                    this.setState({ redirect: true })
                }
            })
        }

        componentWillUnmount() {
            this._isMounted = false
        }

        render() {
            const { redirect } = this.state
            if (redirect) {
                return <Redirect to='/login' />
            }
            return (
                <React.Fragment>
                    <AuthComponent {...this.props} />
                </React.Fragment>
            )
        }
    }
}