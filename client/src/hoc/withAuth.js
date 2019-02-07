import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

const API_URL = '/api/auth/'

export default function withAuth(AuthComponent, loggedIn) {

    return class extends Component {
        state = {
            loading: true,
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

            if (loggedIn) {
            this.checkAuth({method: 'get', url: API_URL + 'check', timeout: 60000})
            .then(response => {
                if (response.status === 200) {
                    if (this._isMounted) {
                        this.setState({ redirect: false, loading: false })
                    }
                } else {
                    throw new Error(response.error)
                }
            })
            .catch(error => {
                if (this._isMounted) {
                    this.setState({ redirect: true, loading: false })
                }
            })
        } else {
            this.setState({ redirect: true, loading: false }) 
        }
        }

        componentWillUnmount() {
            this._isMounted = false
        }

        render() {
            const { loading, redirect } = this.state
            if (loading) {
                return <div className="Loader"></div>
              }
            if (redirect) {
                return <Redirect to="/login" />
            }
            return (
                <React.Fragment>
                    <AuthComponent {...this.props} />
                </React.Fragment>
            )
        }
    }
}