import React, { Component } from 'react';
import {addLecturer, editLecturer, errorHandler, getLecturerById} from "../Util/apiConnect";
import queryString from 'query-string';
import Loading from '../Util/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';



class AddAndEditLecturer extends Component{
    constructor(){
        super();
        this.state = {
            isLoading: false,
            name: '',
            imageUrl: '',
            desc: '',
            errorMessage: '',
        };
    }

    componentWillMount(){
        if(this.props.match.params.action === 'edit'){
            this.setState({isLoading: true});
            let parsed = queryString.parse(this.props.location.search);
            getLecturerById(parsed.id, sessionStorage.getItem("token"))
                .then(res => {
                    this.setState({isLoading: false});
                    this.setState({
                        id: res.data.id,
                        name: res.data.name,
                        desc: res.data.desc,
                        imageUrl: res.data.imageUrl,
                        email: res.data.email,
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
        }else{
            let data={
                name: this.state.name,
                imageUrl: this.state.imageUrl,
                desc: this.state.desc,
                email: this.state.email,
            };
            this.setState({isLoading: true});
            if(this.props.match.params.action === 'add') {
                addLecturer(data,sessionStorage.getItem("token"))
                    .then(() => {
                        this.props.history.push(`/lecturers`);
                    }).catch(e => {
                        this.setState({isLoading: false});
                        errorHandler.bind(this)(e);
                });
            }else if(this.props.match.params.action === 'edit'){
                editLecturer(data,this.state.id, sessionStorage.getItem("token"))
                    .then(() => {
                        this.props.history.push(`/lecturers/${this.state.id}`);
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
                <h2 className="jumbotron">{this.props.match.params.action === 'add' ? 'Add Lecturer' : 'Edit Lecturer'}</h2>
                <img src={this.state.imageUrl}
                     className="img-thumbnail rounded mx-auto d-block img-fluid mb-5" alt="lecturer image" />
                <form onSubmit={e => {this.submit(e)}}>
                    <div className="form-group">
                        <label htmlFor="lecturer-name">Lecturer Name</label>
                        <input type="text" className="form-control" id="lecturer-name" name="name"
                               placeholder="Lecturer Name" value={this.state.name} onChange={ e => this.change(e)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lecturer-desc">Description</label>
                        <textarea className="form-control" id="lecturer-desc" name="desc"
                                  placeholder="Lecturer Description" value={this.state.desc} onChange={ e => this.change(e)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="lecturer-email">Email</label>
                        <input type="text" className="form-control" id="lecturer-email" name="email"
                               placeholder="Lecturer Email" value={this.state.email} onChange={ e => this.change(e)}/>
                    </div>

                    <button type="submit" className="btn btn-success">
                        {this.props.match.params.action === 'add' ? 'Add' : 'Save'}
                    </button>
                    <button className="btn btn-warning float-right"
                            onClick={() => {
                                if(this.props.match.params.action === 'edit') {
                                    this.props.history.push(`/lecturers/${this.state.id}`);
                                }else{
                                    this.props.history.push(`/lecturers`);
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

export default AddAndEditLecturer;
