import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {errorHandler, login, sendLoginSMS, loginWithSMS} from '../Util/apiConnect';
import {validateEmail} from "../Util/validation";
import Loading from '../Util/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';
import logo from '../static/logo.png';
import background from '../static/background.png';


class Login extends Component{
    constructor(){
        super();
        this.state = {
            isLoading: false,
            email: '',
            password: '',
            validationEmail: '',
            validationPassword: '',
            minimumPassword: 4,
            errorMessage: '',
            errorMessageSMS: '',
            displaySMSLogin: false,
        };
    }

    hideAlert() {
        if(this.state.errorMessage === 'Authentication failed. Please login again.'){
            window.location.reload();
        }
        this.setState({
            errorMessage: '',
        });
    }

    email(e){
        this.setState({email: e.target.value});
        if(!validateEmail(e.target.value)){
            this.setState({
                validationEmail: "Invalid email address."
            });
        }else if(validateEmail(e.target.value)){
            this.setState({
                validationEmail: `    `
            });
        }
    }

    password(e){
        this.setState({password: e.target.value});
        if(e.target.value.length < this.state.minimumPassword){
            this.setState({
                validationPassword: `Minimum length ${this.state.minimumPassword}.`
            });
        }else{
            this.setState({
                validationPassword: " "
            });
        }
    }

    submit(e){
        e.preventDefault();
        if(validateEmail(this.state.email)
            && this.state.password.length >= this.state.minimumPassword) {
            this.setState({isLoading: true});
            login(this.state.email, this.state.password)
                .then(storeToken.bind(this))
                .catch(e => {
                    this.setState({isLoading: false});
                    errorHandler.bind(this)(e);
            });
        }
    }

    sendLoginSMS(e){
        e.preventDefault();
        if(validateEmail(this.state.email)){
            this.setState({isLoading: true});
            sendLoginSMS(this.state.email)
                .then( () => {
                    this.setState({
                        isLoading: false,
                        displaySMSLogin: true,
                    });
                })
                .catch(e => {
                    this.setState({isLoading: false});
                    if(e.toString().match(/401/)){
                        this.setState({errorMessageSMS: "Wrong email or user not activated."})
                    }});
        }else{
            this.setState({
                validationPassword: `Invalid email!`
            });
        }
    }

    loginWithSMS(e) {
        this.setState({
            isLoading: true,
            displaySMSLogin: false,
        });
        loginWithSMS(this.state.email, e)
            .then(storeToken.bind(this))
            .catch(e => {
            this.setState({isLoading: false});
            errorHandler.bind(this)(e);
        })
    }


    render () {
        return (
            <div className="container mt-5"  style={{
                backgroundImage: `url(${background})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                minHeight: '900px',
            }}>
                {this.state.isLoading ? <Loading /> : null}
                <div className="wrapper">
                        <form name="Login_Form" className="form-signin"
                              style={{backgroundColor: 'rgba(255,255,255,0.7)'}} onSubmit={e => this.submit(e)}>
                            <h3 className="form-signin-heading">
                                Windsor State High School Learning Management System
                            </h3>
                            <hr className="colorgraph" /><br />
                            <img className="rounded mx-auto d-block img-fluid mb-5" src={logo} alt="logo" />

                            <input type="text" className="form-control" placeholder="Email" required="" autoFocus=""
                                       value={this.state.email} onChange={(e) => {this.email(e)}} />

                            <p className="validation">{this.state.validationEmail}</p>

                            <input type="password" className="form-control" placeholder="Password" required=""
                                       value={this.state.password} onChange={(e) => {this.password(e)}}/>

                            <p className="validation">{this.state.validationPassword}</p>

                            <button type="submit" className="btn btn-lg btn-primary btn-block mt-1"
                                        value="Login">Login</button>
                            <button className="btn btn-lg btn-primary btn-block mt-3"
                                    onClick={e => this.sendLoginSMS(e)}>SMS Login</button>
                            <Link to="/signup" className="btn btn-lg btn-primary btn-block mt-3">Sign up</Link>
                        </form>
                    </div>
                {this.state.errorMessage ? <SweetAlert
                    danger
                    confirmBtnText="OK"
                    confirmBtnBsStyle="primary"
                    title="Oops, something went wrong!"
                    onConfirm={() => this.hideAlert()}
                >
                    {this.state.errorMessage}
                </SweetAlert> : null}
                {this.state.errorMessageSMS ? <SweetAlert
                    danger
                    showCancel
                    cancelBtnBsStyle="primary"
                    cancelBtnText="Correct Email"
                    confirmBtnText="Activate"
                    confirmBtnBsStyle="primary"
                    title="Oops, something went wrong!"
                    onCancel={() => {this.setState({errorMessageSMS: ''})}}
                    onConfirm={() => this.props.history.push(`/activate/${this.state.email}`)}
                >
                    {this.state.errorMessageSMS}
                </SweetAlert> : null}
                {this.state.displaySMSLogin ? <SweetAlert
                    input
                    required
                    inputType="login code"
                    title="Enter Login Code"
                    validationMsg="You must enter your login code!"
                    onConfirm={e => this.loginWithSMS(e)}
                /> : null}
            </div>
        )
    };
}

function storeToken(response) {
        sessionStorage.setItem("token",response.data);
        this.props.history.push('/');
}

export default Login;
