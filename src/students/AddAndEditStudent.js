import React, { Component } from 'react';
import {addStudent, getStudentById, errorHandler, editStudent} from "../Util/apiConnect";
import queryString from 'query-string';
import Loading from '../Util/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';


class AddAndEditStudent extends Component{
    constructor(){
        super();
        this.state = {
            isLoading: false,
            name: '',
            imageUrl: '',
            fee: 0,
            creditLimit: 0,
            currentCredit: 0,
            errorMessage: '',
        };
    }

    componentWillMount(){
        if(this.props.match.params.action === 'edit'){
            let parsed = queryString.parse(this.props.location.search);
            this.setState({isLoading: true});
            getStudentById(parsed.id, sessionStorage.getItem("token"))
                .then(res => {
                    this.setState({isLoading: false});
                    this.setState({
                        id: res.data.id,
                        name: res.data.name,
                        email: res.data.email,
                        fee: res.data.fee,
                        imageUrl: res.data.imageUrl,
                        creditLimit: res.data.creditLimit,
                        currentCredit: res.data.currentCredit
                    });
                })
                .catch(e => {
                    this.setState({isLoading: false});
                    errorHandler.bind(this)(e);
                });
        }
    }

    hideAlert() {
        if(this.state.errorMessage === 'Authentication failed. Please login again.'){
            window.location.reload();
        }
        this.setState({
            errorMessage: ''
        });
    }

    change(e){
        this.setState({
           [e.target.name]: e.target.value
        });
    }

    submit(e){
        e.preventDefault();
        if(this.state.name === ''){
            this.setState({
                errorMessage: "Name should not be empty!"
            });
        }else if(isNaN(this.state.creditLimit)){
            this.setState({
                errorMessage: "Credit limit should be a number!"
            });
        }else{
            let data={
                name: this.state.name,
                email: this.state.email,
                imageUrl: this.state.imageUrl,
                fee: this.state.fee,
                creditLimit: this.state.creditLimit,
                currentCredit: this.state.currentCredit
            };
            this.setState({isLoading: true});
            if(this.props.match.params.action === 'add') {
                addStudent(data, sessionStorage.getItem("token"))
                    .then(() => {
                        this.props.history.push(`/students`);
                    }).catch(e => {
                        this.setState({isLoading: false});
                        errorHandler.bind(this)(e);
                });
            }else if(this.props.match.params.action === 'edit'){
                editStudent(data,this.state.id, sessionStorage.getItem("token"))
                    .then(() => {
                        this.props.history.push(`/students/${this.state.id}`);
                    }).catch(e => {
                        this.setState({isLoading: false});
                        errorHandler.bind(this)(e);
                });
            }
        }
    }

    render() {
        return (
            <div className="container mt-3 pb-3">
                {this.state.isLoading ? <Loading /> : null}
                <h2 className="jumbotron">{this.props.match.params.action === 'add' ? 'Add Student' : 'Edit Student'}</h2>
                <img src={this.state.imageUrl}
                     className="img-thumbnail rounded mx-auto d-block img-fluid mb-5" alt="student image" />
                <form onSubmit={e => {this.submit(e)}}>
                    <div className="form-group">
                        <label htmlFor="student-name">Student Name</label>
                        <input type="text" className="form-control" id="student-name" name="name"
                               placeholder="Student Name" value={this.state.name} onChange={ e => this.change(e)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="student-email">Student Email</label>
                        <input type="text" className="form-control" id="student-email" name="email"
                               placeholder="Student Email" value={this.state.email} onChange={ e => this.change(e)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="student-fee">Fee</label>
                        <input className="form-control" id="student-fee" name="fee"
                                  placeholder="Student Fee" value={this.state.fee}
                               readOnly={this.props.match.params.action === 'add' ? "readonly" : false}
                               onChange={ e => this.change(e)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="student-creditLimit">Credit Limit</label>
                        <input className="form-control" id="student-creditLimit" name="creditLimit"
                                  placeholder="Student Credit Limit" value={this.state.creditLimit}
                               onChange={ e => this.change(e)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="student-currentCredit">Current Credit</label>
                        <input className="form-control" id="student-currentCredit" name="currentCredit"
                                  placeholder="Student Current Credit" value={this.state.currentCredit}
                               readOnly="readOnly" onChange={ e => this.change(e)}/>
                    </div>

                    <button className="btn btn-success">
                        {this.props.match.params.action === 'add' ? 'Add' : 'Save'}
                    </button>
                    <button className="btn btn-warning float-right"
                            onClick={() => {
                                if(this.props.match.params.action === 'edit') {
                                    this.props.history.push(`/students/${this.state.id}`);
                                }else{
                                    this.props.history.push(`/students`);
                                }
                            }}>Cancel</button>
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

export default AddAndEditStudent;
