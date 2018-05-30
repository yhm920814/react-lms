import React, { Component } from 'react';
import {errorHandler,register} from '../Util/apiConnect';
import {validateEmail,validatePhoneNo} from "../Util/validation";
import Loading from '../Util/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';

class Register extends Component{
    constructor(){
        super();
        this.state = {
            isLoading: false,
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            minimumPassword: 6,
            errorEmail: '',
            errorPhone: '',
            errorPassword: '',
            errorConfirm: '',
            errorMessage: '',
        };
    }

    hideAlert() {
        if(this.state.errorMessage === 'Authentication failed. Please login again.'){
            window.location.reload();
        }
        this.setState({
            errorMessage: ''
        });
    }

    email(e){
        this.setState({email: e.target.value});
        if(!validateEmail(e.target.value)){
            this.setState({errorEmail: 'Invalid email address'});
        }else{
            this.setState({errorEmail: null});
        }
    }

    phone(e){
        this.setState({phone: e.target.value});
        if(!validatePhoneNo(e.target.value)){
            this.setState({errorPhone: 'Invalid mobile phone number'});
        }else{
            this.setState({errorPhone: null});
        }
    }

    password(e){
        this.setState({password: e.target.value});
        if(e.target.value.length < this.state.minimumPassword){
            this.setState({errorPassword: `Minimum length ${this.state.minimumPassword}`});
        }else{
            this.setState({errorPassword: null});
        }
    }

    confirmPassword(e){
        this.setState({confirmPassword: e.target.value});
        if(e.target.value !== this.state.password){
            this.setState({errorConfirm: `Password not match`});
        }else{
            this.setState({errorConfirm: null});
        }
    }

    checkValidation() {
        return !(this.state.errorEmail || this.state.errorPhone ||
            this.state.errorPassword || this.state.errorConfirm);
    }


    submit(e){
        e.preventDefault();
        if(this.checkValidation() && this.state.email && this.state.phone &&
            this.state.password && this.state.confirmPassword){
            this.setState({isLoading: true});
            register(this.state.email,this.state.password,this.state.phone)
                .then(() => this.props.history.push(`/activate/${this.state.email}`))
                .catch(e => {
                    this.setState({isLoading: false});
                    errorHandler.bind(this)(e);
                });
        }
    }

    render () {
            return (
                <div className="container mt-5 pt-5">
                    {this.state.isLoading ? <Loading /> : null}
                    <form className="form-horizontal p-5">
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-6">
                                <h2>Register New User</h2>
                                <hr/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3 field-label-responsive">
                                <label htmlFor="name">Email</label>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                                        <div className="input-group-addon"><i className="fa fa-at"></i></div>
                                        <input type="text" name="name" className="form-control" id="name"
                                               placeholder="Email" value={this.state.email}
                                               onChange={e => this.email(e)} autoFocus/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-control-feedback">
                                <span className="text-danger align-middle">
                                    {this.state.errorEmail
                                        ? <i className="fa fa-close">{this.state.errorEmail}</i> : null}
                                </span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3 field-label-responsive">
                                <label htmlFor="email">Mobile Phone No.</label>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                                        <div className="input-group-addon"><i className="fa fa-phone"></i></div>
                                        <input type="text" name="email" className="form-control" id="email"
                                               placeholder="Mobile Phone No." value={this.state.phone}
                                               onChange={e => this.phone(e)}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-control-feedback">
                                <span className="text-danger align-middle">
                                    {this.state.errorPhone
                                        ? <i className="fa fa-close">{this.state.errorPhone}</i> : null}
                                </span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3 field-label-responsive">
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group has-danger">
                                    <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                                        <div className="input-group-addon"><i className="fa fa-key"></i></div>
                                        <input type="password" name="password" className="form-control" id="password"
                                               placeholder="Password" value={this.state.password}
                                               onChange={e => this.password(e)}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-control-feedback">
                                <span className="text-danger align-middle">
                                    {this.state.errorPassword
                                        ? <i className="fa fa-close">{this.state.errorPassword}</i> : null}
                                </span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3 field-label-responsive">
                                <label htmlFor="password">Confirm Password</label>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                                        <div className="input-group-addon">
                                            <i className="fa fa-repeat"></i>
                                        </div>
                                        <input type="password" name="password-confirmation" className="form-control"
                                               id="password-confirm" placeholder="Password"
                                               onChange={e => this.confirmPassword(e)}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-control-feedback">
                                <span className="text-danger align-middle">
                                    {this.state.errorConfirm
                                        ? <i className="fa fa-close">{this.state.errorConfirm}</i> : null}
                                </span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                            </div>
                            <div className="col-md-6">
                                <button className="btn btn-success"
                                        onClick={e => this.submit(e)}><i className="fa fa-user-plus"></i> Register
                                </button>
                            </div>
                        </div>
                    </form>
                    {this.state.errorMessage ? <SweetAlert
                        danger
                        confirmBtnText="OK"
                        confirmBtnBsStyle="primary"
                        title="Oops, something went wrong!"
                        onConfirm={() => this.hideAlert()}
                    >
                        {this.state.errorMessage}
                    </SweetAlert> : null}
                </div>
            );
    }
}


export default Register;