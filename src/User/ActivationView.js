import React, { Component } from 'react';
import {validateEmail} from "../Util/validation";
import {verification} from "../Util/apiConnect";
import Loading from '../Util/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';


class ActivationView extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            email: '',
            activationCode: '',
            errorEmail: '',
            errorMessage: '',
            successMessage: '',
        };
    }

    componentDidMount(){
        if(this.props.match.params.email){
            this.setState({
                email: this.props.match.params.email
            });
        }
    }

    hideAlert() {
        this.setState({
            errorMessage: ''
        });
    }

    goToLogin() {
        this.props.history.push('/login');
    }

    email(e){
        this.setState({email: e.target.value});
        if(!validateEmail(e.target.value)){
            this.setState({errorEmail: 'Invalid email address'});
        }else{
            this.setState({errorEmail: null});
        }
    }

    activate(e){
        this.setState({activationCode: e.target.value});
    }

    sendActivationCode(e){
        e.preventDefault();
        this.setState({isLoading: true});
        verification(this.state.email,this.state.activationCode)
            .then(() => {
                this.setState({
                    isLoading: false,
                    successMessage: 'Redirecting to login page...',
                });
            })
            .catch(e => {
                this.setState({
                    isLoading: false,
                    errorMessage: 'Activation failed!',
                });
            });
    }

    render(){
        return <div className="container mt-5 pt-5">
            {this.state.isLoading ? <Loading /> : null}
            <form className="form-horizontal p-5 bg-light">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <h2>Activate your account</h2>
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
                        <label htmlFor="activate">Activation code</label>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                                <div className="input-group-addon"><i className="fa fa-user-plus"></i></div>
                                <input type="text" name="activate" className="form-control" id="activate"
                                       placeholder="Activation code" value={this.state.activationCode}
                                       onChange={e => this.activate(e)} autoFocus/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-control-feedback">
                                <span className="text-danger align-middle">
                                </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-success"
                                onClick={e => this.sendActivationCode(e)}><i className="fa fa-user-plus"></i> Activate
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
            {this.state.successMessage ? <SweetAlert
                success
                confirmBtnText="OK"
                confirmBtnBsStyle="primary"
                title="Successfully activated!"
                onConfirm={() => this.goToLogin()}
            >
                {this.state.successMessage}
            </SweetAlert> : null}
        </div>;
    }
}


export default ActivationView;