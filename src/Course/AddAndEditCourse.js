import React, { Component } from 'react';
import {getCourseById, addCourse, editCourse,errorHandler} from "../Util/apiConnect";
import queryString from 'query-string';
import Loading from '../Util/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';


class AddAndEditCourse extends Component{
    constructor(){
        super();
        this.state = {
            isLoading: false,
            name: '',
            desc: '',
            imageUrl: '',
            max: 1,
            credit: 1,
            errorMessage: '',
        };
    }

    componentWillMount(){
        if(this.props.match.params.action === 'edit'){
            let parsed = queryString.parse(this.props.location.search);
            this.setState({isLoading: true});
            getCourseById(parsed.id, sessionStorage.getItem("token"))
                .then(res => {
                    this.setState({isLoading: false});
                    this.setState({
                        id: res.data.id,
                        name: res.data.name,
                        desc: res.data.desc,
                        imageUrl: res.data.imageUrl,
                        max: res.data.maxStudents,
                        credit: res.data.credit
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
        if(this.state.name === '' || this.state.desc === ''){
            this.setState({
                errorMessage: "Name or Description should not be empty!"
            });
        }else{
            let data={
                name: this.state.name,
                desc: this.state.desc,
                maxStudents: this.state.max,
                credit: this.state.credit,
                imageUrl: this.state.imageUrl
            };

            this.setState({isLoading: true});
            if(this.props.match.params.action === 'edit'){
                editCourse(data,this.state.id,sessionStorage.getItem("token"))
                    .then(() => {
                        this.setState({isLoading: false});
                        this.props.history.push(`/courses/${this.state.id}`);
                    }).catch(e => {
                        this.setState({isLoading: false});
                        errorHandler.bind(this)(e);
                });
            }else if(this.props.match.params.action === 'add'){
                addCourse(data,sessionStorage.getItem("token"))
                    .then(() => {
                        this.setState({isLoading: false});
                        this.props.history.push(`/courses`);
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
                <h2 className="jumbotron">{this.props.match.params.action === 'add' ? 'Add Course' : 'Edit Course'}</h2>
                <img src={this.state.imageUrl}
                     className="img-thumbnail rounded mx-auto d-block img-fluid mb-5" alt="course image" />
                <form onSubmit={e => this.submit(e)}>
                    <div className="form-group">
                        <label htmlFor="course-name">Course Name</label>
                        <input type="text" className="form-control" id="course-name" name="name"
                               placeholder="Course Name" value={this.state.name} onChange={ e => this.change(e)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="course-desc">Description</label>
                        <textarea className="form-control" id="course-desc" name="desc"
                                  placeholder="Course Description" value={this.state.desc} onChange={ e => this.change(e)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="course-image">Image</label>
                        <input type="text" className="form-control" id="course-image" name="imageUrl"
                               placeholder="Image URL" value={this.state.imageUrl} onChange={ e => this.change(e)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="course-max-students">Maximun Students</label>
                        <select className="form-control" id="course-max-students" name="max"
                                value={this.state.max} onChange={ e => this.change(e)}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                            <option>11</option>
                            <option>12</option>
                            <option>13</option>
                            <option>14</option>
                            <option>15</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="course-credit">Credit</label>
                        <select className="form-control" id="course-credit" name="credit"
                                value={this.state.credit} onChange={ e => this.change(e)}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success">
                        {this.props.match.params.action === 'add' ? 'Add' : 'Save'}
                    </button>
                    <button className="btn btn-warning float-right"
                            onClick={() => {
                                if(this.props.match.params.action === 'edit') {
                                    this.props.history.push(`/courses/${this.state.id}`);
                                }else{
                                    this.props.history.push(`/courses`);
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

export default AddAndEditCourse;
