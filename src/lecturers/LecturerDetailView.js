import React, { Component } from 'react';
import {getLecturerById, deleteLecturer,errorHandler} from "../Util/apiConnect";
import {Link} from 'react-router-dom';
import Loading from '../Util/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';
import Gravatar from '../Util/Gravatar';


class LecturerDetailView extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            lecturer: null,
            errorMessage: '',
            warningMessage: '',
        };
    }

    componentWillMount(){
        this.renderLecturer();
    }

    hideAlert() {
        if(this.state.errorMessage === 'Authentication failed. Please login again.'){
            window.location.reload();
        }
        this.setState({
            errorMessage: '',
            warningMessage: '',
        });
    }

    renderLecturer(){
        this.setState({isLoading: true});
        let id = this.props.match.params.id;
        getLecturerById(id,sessionStorage.getItem("token"))
            .then(response => {
                this.setState({
                    lecturer: response.data
                });
                this.setState({isLoading: false});
            }).catch(e=>{
                this.setState({isLoading: false});
                errorHandler.bind(this)(e);
        });
    }

    deleteLecturer(){
        if(this.state.lecturer) {
            this.setState({isLoading: true});
            deleteLecturer(this.state.lecturer.id,sessionStorage.getItem("token"))
                .then(() => {
                    this.setState({isLoading: false});
                    this.props.history.push('/lecturers');
                }).catch(e => {
                    this.setState({isLoading: false});
                    errorHandler.bind(this)(e);
            });
        }
    }

    render(){
            return <div className="container mt-3 pb-3">
                {this.state.isLoading ? <Loading /> : null}
                <h2 className="jumbotron">Lecturer Detail</h2>
                <Gravatar email="default@gmail.com"
                          size = {300}
                          style = {{marginBottom: '2rem'}}
                />
                <dl className="row">
                    <dt className="col-sm-3">Lecturer Name</dt>
                    <dd className="col-sm-9">{this.state.lecturer ? this.state.lecturer.name : "Loading..."}</dd>

                    <dt className="col-sm-3">Lecturer Description</dt>
                    <dd className="col-sm-9">
                        <p>{this.state.lecturer ? this.state.lecturer.desc : "Loading..."}</p>
                    </dd>

                    <dt className="col-sm-3">Lecturer Email</dt>
                    <dd className="col-sm-9">
                        <p>{this.state.lecturer ? this.state.lecturer.email : "Loading..."}</p>
                    </dd>

                    <dt className="col-sm-3">Related Courses</dt>
                    <dd className="col-sm-9">
                        {this.state.lecturer ? (this.state.lecturer.courseToLecturers.length > 0 ? this.state.lecturer.courseToLecturers.map(course => {
                            return <Link className="mr-3" key={course.courseId} to={`/courses/${course.courseId}`}>{course.course.name}</Link>
                        }) : 'No related course') : 'Loading...'}
                        <br/>
                        <Link to={`/enrolment/enrol/lecturer?section=lecturers&id=${this.state.lecturer ? this.state.lecturer.id : null}`}
                              className="btn btn-info">Add</Link>
                        <Link to={`/enrolment/withdraw/lecturer?section=lecturers&id=${this.state.lecturer ? this.state.lecturer.id : null}`}
                              className="btn btn-info ml-4">Remove</Link>
                    </dd>
                </dl>

                <Link to={`/lecturers/action/edit?id=${this.state.lecturer ? this.state.lecturer.id : null}`}
                      className="btn btn-success">Edit Lecturer</Link>
                <button className="btn btn-danger float-right" disabled={!this.state.lecturer}
                     onClick={() => this.setState({warningMessage: 'Are you sure?'})}>Delete Lecturer</button>
                {this.state.errorMessage ? <SweetAlert
                    danger
                    confirmBtnText="OK"
                    confirmBtnBsStyle="primary"
                    title="Oops, something went wrong!"
                    onConfirm={() => this.hideAlert()}
                >
                    {this.state.errorMessage}
                </SweetAlert> : null}
                {this.state.warningMessage ? <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="DELETE"
                    cancelBtnText="CANCEL"
                    confirmBtnBsStyle="warning"
                    cancelBtnBsStyle="light"
                    title="Warning! This lecturer will be deleted!"
                    onConfirm={() => this.deleteLecturer()}
                    onCancel={() => this.hideAlert()}
                >
                    {this.state.warningMessage}
                </SweetAlert> : null}
            </div>;
    }
}

export default LecturerDetailView;
