import React, { Component } from 'react';
import {getCourseById, deleteCourse,errorHandler} from "../Util/apiConnect";
import courseImage from '../static/course.jpg';
import {Link} from 'react-router-dom';
import Loading from '../Util/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';


class CourseDetailView extends Component {
    constructor() {
        super();
        this.state = {
            idLoading: false,
            course: null,
            errorMessage: '',
            warningMessage: '',
        };
    }

    componentWillMount(){
        this.renderCourse();
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

    renderCourse(){
        let id = this.props.match.params.id;
        this.setState({isLoading: true});
        getCourseById(id,sessionStorage.getItem("token"))
            .then(response => {
                this.setState({
                    course: response.data
                });
                this.setState({isLoading: false});
            }).catch(e=>{
                this.setState({isLoading: false});
                errorHandler.bind(this)(e);
        });
    }

    deleteCourse(){
        if(this.state.course) {
            this.setState({isLoading: true});
            deleteCourse(this.state.course.id,sessionStorage.getItem("token"))
                .then(() => {
                    this.setState({isLoading: false});
                    this.props.history.push('/courses');
                }).catch(e => {
                    this.setState({isLoading: false});
                    errorHandler.bind(this)(e);
            });
        }
    }

    render(){
            return <div className="container mt-3 pb-3">
                {this.state.isLoading ? <Loading /> : null}
                <h2 className="jumbotron">Course Detail</h2>
                <img src={this.state.course ? (this.state.course.imageUrl ? this.state.course.imageUrl: courseImage) : null}
                     className="img-thumbnail rounded mx-auto d-block img-fluid mb-5" alt="course image" />
                <dl className="row">
                    <dt className="col-sm-3">Course Name</dt>
                    <dd className="col-sm-9">{this.state.course ? this.state.course.name : "Loading..."}</dd>

                    <dt className="col-sm-3">Course Description</dt>
                    <dd className="col-sm-9">
                        <p>{this.state.course ? this.state.course.desc : "Loading..."}</p>
                    </dd>

                    <dt className="col-sm-3">Maximun Students</dt>
                    <dd className="col-sm-9">{this.state.course ? this.state.course.maxStudents : "Loading..."}</dd>

                    <dt className="col-sm-3">Current Students</dt>
                    <dd className="col-sm-9">{this.state.course ? this.state.course.currentStudents : "Loading..."}</dd>

                    <dt className="col-sm-3">Course Credit</dt>
                    <dd className="col-sm-9">{this.state.course ? this.state.course.credit : "Loading..."}</dd>

                    <dt className="col-sm-3">Enrolled Students</dt>
                    <dd className="col-sm-9">
                        {this.state.course ? (this.state.course.courseToStudents.length > 0 ? this.state.course.courseToStudents.map(student => {
                            return <Link className="mr-3" key={student.studentId} to={`/students/${student.studentId}`}>{student.student.name}</Link>
                        }) : 'No enrolled student') : 'Loading...'}
                        <br/>
                        <Link to={`/enrolment/enrol/student?section=courses&id=${this.state.course ? this.state.course.id : null}`}
                              className="btn btn-info mt-2">Enrol</Link>
                        <Link to={`/enrolment/withdraw/student?section=courses&id=${this.state.course ? this.state.course.id : null}`}
                              className="btn btn-info ml-4 mt-2">Withdraw</Link>
                    </dd>

                    <dt className="col-sm-3">Related Lecturers</dt>
                    <dd className="col-sm-9">
                        {this.state.course ? (this.state.course.courseToLecturers.length > 0 ? this.state.course.courseToLecturers.map(lecturer => {
                            return <Link className="mr-3" key={lecturer.lecturerId} to={`/lecturers/${lecturer.lecturerId}`}>{lecturer.lecturer.name}</Link>
                        }) : 'No related lecturer' ) : 'Loading...'}
                        <br/>
                        <Link to={`/enrolment/enrol/lecturer?section=courses&id=${this.state.course ? this.state.course.id : null}`}
                              className="btn btn-info mt-2">Add</Link>
                        <Link to={`/enrolment/withdraw/lecturer?section=courses&id=${this.state.course ? this.state.course.id : null}`}
                              className="btn btn-info ml-4 mt-2">Remove</Link>
                    </dd>
                </dl>
                <Link to={`/courses/action/edit?id=${this.state.course ? this.state.course.id : null}`}
                      className="btn btn-success">Edit Course</Link>
                <button className="btn btn-danger float-right" disabled={!this.state.course}
                     onClick={() => this.setState({warningMessage: 'Are you sure?'})}>Delete Course</button>
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
                    title="Warning! This course will be deleted!"
                    onConfirm={() => this.deleteCourse()}
                    onCancel={() => this.hideAlert()}
                >
                    {this.state.warningMessage}
                </SweetAlert> : null}
            </div>;
    }
}

export default CourseDetailView;