import React, { Component } from 'react';
import {getStudentById, deleteStudent,errorHandler} from "../Util/apiConnect";
import studentImage from '../static/student.png';
import {Link} from 'react-router-dom';
import Loading from '../Util/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';
import Gravatar from '../Util/Gravatar';



class StudentDetailView extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            student: null,
            errorMessage: '',
            warningMessage: '',
        };
    }

    componentWillMount(){
        this.renderStudent();
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

    renderStudent(){
        let id = this.props.match.params.id;
        this.setState({isLoading: true});
        getStudentById(id,sessionStorage.getItem("token"))
            .then(response => {
                this.setState({
                    student: response.data
                });
                this.setState({isLoading: false});
            }).catch(e=>{
                this.setState({isLoading: false});
                errorHandler.bind(this)(e);
        });
    }

    deleteStudent(){
        if(this.state.student) {
            this.setState({isLoading: true});
            deleteStudent(this.state.student.id,sessionStorage.getItem("token"))
                .then(() => {
                    this.setState({isLoading: false});
                    this.props.history.push('/students');
                }).catch(e => {
                    this.setState({isLoading: false});
                    errorHandler.bind(this)(e);
            });
        }
    }

    render(){
            return <div className="container mt-3 pb-3">
                {this.state.isLoading ? <Loading /> : null}
                <h2 className="jumbotron">Student Detail</h2>
                <Gravatar email="default@gmail.com"
                          size = {300}
                          style = {{marginBottom: '2rem'}}
                />
                <dl className="row">
                    <dt className="col-sm-3">Student Name</dt>
                    <dd className="col-sm-9">{this.state.student ? this.state.student.name : "Loading..."}</dd>

                    <dt className="col-sm-3">Student Email</dt>
                    <dd className="col-sm-9">{this.state.student ? this.state.student.email : "Loading..."}</dd>

                    <dt className="col-sm-3">Student Credit Limit</dt>
                    <dd className="col-sm-9">{this.state.student ? this.state.student.creditLimit : "Loading..."}</dd>

                    <dt className="col-sm-3">Current Credit</dt>
                    <dd className="col-sm-9">{this.state.student ? this.state.student.currentCredit : "Loading..."}</dd>

                    <dt className="col-sm-3">Enrolled Courses</dt>
                    <dd className="col-sm-9">
                        {this.state.student ? (this.state.student.courseToStudents.length > 0 ? this.state.student.courseToStudents.map(course => {
                            return <Link className="mr-3" key={course.courseId} to={`/courses/${course.courseId}`}>{course.course.name}</Link>
                        }) : 'No enrolled course') : 'Loading...'}
                        <br/>
                        <Link to={`/enrolment/enrol/student?section=students&id=${this.state.student ? this.state.student.id : null}`}
                              className="btn btn-info">Enrol</Link>
                        <Link to={`/enrolment/withdraw/student?section=students&id=${this.state.student ? this.state.student.id : null}`}
                              className="btn btn-info ml-4">Withdraw</Link>
                    </dd>

                </dl>
                <Link to={`/students/action/edit?id=${this.state.student ? this.state.student.id : null}`}
                      className="btn btn-success">Edit Student</Link>
                <button className="btn btn-danger float-right" disabled={!this.state.student}
                     onClick={() => this.setState({warningMessage: 'Are you sure?'})}>Delete Student</button>
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
                    title="Warning! This student will be deleted!"
                    onConfirm={() => this.deleteStudent()}
                    onCancel={() => this.hideAlert()}
                >
                    {this.state.warningMessage}
                </SweetAlert> : null}
            </div>;
    }
}

export default StudentDetailView;
