import React, { Component } from 'react';
import $ from 'jquery';
import select2 from 'select2';
import queryString from 'query-string';
import {getCourses, getStudents, getLecturers, enrolStudent, withdrawStudent, addLecturerToCourse, removeLecturerFromCourse, errorHandler} from '../Util/apiConnect';
import Loading from '../Util/Loading';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';


class Enrolment extends Component{
    constructor(){
        super();
        this.state = {
            isLoading: false,
            isDataReady: false,
            isCourseDisabled: false,
            isStudentDisabled: false,
            isLecturerDisabled: false,
            section: '',
            courseValue: 0,
            studentValue: 0,
            lecturerValue: 0,
            coursesData: null,
            studentsData: null,
            lecturersData: null,
            errorMessage: '',
        };
    }
    componentWillMount(){
        let parsed = queryString.parse(this.props.location.search);
        if(parsed.section === 'courses'){
            this.setState({
                courseValue: parsed.id,
                isCourseDisabled: true
            });
        }else if(parsed.section === 'students'){
            this.setState({
                studentValue: parsed.id,
                isStudentDisabled: true
            });
        }else if(parsed.section === 'lecturers'){
            this.setState({
                lecturerValue: parsed.id,
                isLecturerDisabled: true
            });
        }

        this.setState({
            section: parsed.section,
            isLoading: true
        });

        if(this.props.match.params.role === 'student') {
            axios.all([getCourses(sessionStorage.getItem("token")), getStudents(sessionStorage.getItem("token"))])
                .then(axios.spread((courses, students) => {
                    this.setState({
                        coursesData: courses.data,
                        studentsData: students.data,
                        isLoading: false,
                        isDataReady: true
                    });
                }))
                .catch(e=>{
                    this.setState({isLoading: false});
                    errorHandler.bind(this)(e);
                });
        }else{
            axios.all([getCourses(sessionStorage.getItem("token")), getLecturers(sessionStorage.getItem("token"))])
                .then(axios.spread((courses, lecturers) => {
                    this.setState({
                        coursesData: courses.data,
                        lecturersData: lecturers.data,
                        isLoading: false,
                        isDataReady: true
                    });
                }))
                .catch(e=>{
                    this.setState({isLoading: false});
                    errorHandler.bind(this)(e);
                });
        }
    }

    componentDidMount(){
        $(this.refs['course-list']).select2()
            .on('change', e => this.changeSelect(e));
        $(this.refs['student-list']).select2()
            .on('change', e => this.changeSelect(e));
        $(this.refs['lecturer-list']).select2()
            .on('change', e => this.changeSelect(e));
    }

    hideAlert() {
        if(this.state.errorMessage === 'Authentication failed. Please login again.'){
            window.location.reload();
        }
        this.setState({
            errorMessage: '',
        });
    }

    changeSelect(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    findCourse= (course, property) => {
        if(course.id == this.state.courseValue){
            return course[property];
        }
    };

    findStudent= (student, property) => {
        if(student.id == this.state.studentValue){
            return student[property];
        }
    };

    findLecturer= (lecturer, property) => {
        if(lecturer.id == this.state.lecturerValue){
            return lecturer[property];
        }
    };

    filterCourses() {
        let courses = [];
        let returnFilteredOptions = course => {
            courses.push(<option key={course.course.id} value={course.course.id}>{course.course.name}</option>);
        };
        let returnAllOptions = course => {
            courses.push(<option key={course.id} value={course.id}>{course.name}</option>);
        };

        if(this.props.match.params.type === 'withdraw') {
            if (this.state.section === 'students') {
                let targetStudent;
                this.state.studentsData.forEach(student => {
                    if (student.id == this.state.studentValue) {
                        targetStudent = student;
                    }
                });
                targetStudent.courseToStudents.map(returnFilteredOptions);
            } else if (this.state.section === 'lecturers') {
                let targetLecturer;
                this.state.lecturersData.forEach(lecturer => {
                    if (lecturer.id == this.state.lecturerValue) {
                        targetLecturer = lecturer;
                    }
                });
                targetLecturer.courseToLecturers.map(returnFilteredOptions);
            } else {
                this.state.coursesData.map(returnAllOptions);
            }
        }else{
            this.state.coursesData.map(returnAllOptions);
        }
        return courses;
    }

    filterStudentsOrLecturers(role) {
        let students = [];
        let lecturers = [];
        let returnAllStudentsOptions = student => {
            students.push(<option key={student.id} value={student.id}>{student.name}</option>);
        };
        let returnAllLecturersOptions = lecturer => {
            lecturers.push(<option key={lecturer.id} value={lecturer.id}>{lecturer.name}</option>);
        };
        let returnStudentsOptions = student => {
            students.push(<option key={student.student.id} value={student.student.id}>{student.student.name}</option>);
        };
        let returnLecturersOptions = lecturer => {
            lecturers.push(<option key={lecturer.lecturer.id} value={lecturer.lecturer.id}>{lecturer.lecturer.name}</option>);
        };

        if(this.props.match.params.type === 'withdraw'){
            if (this.state.section === 'courses'){
                let targetCourse;
                this.state.coursesData.forEach(course => {
                    if (course.id == this.state.courseValue) {
                        targetCourse = course;
                    }
                });
                if(role === 'students') {
                    targetCourse.courseToStudents.map(returnStudentsOptions);
                }else if(role === 'lecturers'){
                    targetCourse.courseToLecturers.map(returnLecturersOptions);
                }
            }else{
                role === 'students' ? this.state.studentsData.map(returnAllStudentsOptions) :
                    this.state.lecturersData.map(returnAllLecturersOptions);
            }
        }else{
            role === 'students' ? this.state.studentsData.map(returnAllStudentsOptions) :
                this.state.lecturersData.map(returnAllLecturersOptions);
        }

        return role === 'students' ? students : lecturers;
    }

    previousPath(){
        let id;
        if(this.state.section === 'courses'){
            id = this.state.courseValue;
        }else if(this.state.section === 'students'){
            id = this.state.studentValue;
        }else if(this.state.section === 'lecturers'){
            id = this.state.lecturerValue;
        }
        return `/${this.state.section}/${id}`;
    }

    isCourseFull (id) {
        let targetCourse;
        this.state.coursesData.forEach(course => { if(course.id == id) targetCourse = course});
        if(targetCourse.currentStudents >= targetCourse.maxStudents){
            return true;
        }
        return false;
    }

    isStudentOverCredit(courseId, studentId){
        let targetCourse, targetStudent;
        this.state.coursesData.map(course => { if(course.id == courseId) targetCourse = course});
        this.state.studentsData.map(student => { if(student.id == studentId) targetStudent = student});
        if(targetStudent.currentCredit + targetCourse.credit > targetStudent.creditLimit){
            return true;
        }
        return false;
    }

    ajaxStudent(action){
        let data = {
            courseId: this.state.courseValue,
            studentId: this.state.studentValue
        };

        if(action === 'enrol'){
            if(this.isCourseFull(this.state.courseValue)){
                this.setState({
                    errorMessage: 'This course has reached its maximum students number!'
                });
            } else if(this.isStudentOverCredit(this.state.courseValue, this.state.studentValue)){
                this.setState({
                    errorMessage: 'Exceed student credit limit!'
                });
            }else {
                this.setState({isLoading: true});
                enrolStudent(data, sessionStorage.getItem("token"))
                    .then(() => {
                        this.setState({isLoading: false});
                        setTimeout(this.props.history.push(this.previousPath()), 500);
                    })
                    .catch(e => {
                        this.setState({isLoading: false});
                        errorHandler.bind(this)(e);
                    });
            }
        }else{
            this.setState({isLoading: true});
            withdrawStudent(data, sessionStorage.getItem("token"))
                .then(() => {
                    this.setState({isLoading: false});
                    setTimeout(this.props.history.push(this.previousPath()), 500);
                })
                .catch(e => {
                    this.setState({isLoading: false});
                    errorHandler.bind(this)(e);
                });
        }
    }

    ajaxLecturer(action){
        this.setState({isLoading: true});
        let data = {
            courseId: this.state.courseValue,
            lecturerId: this.state.lecturerValue
        };
        (action === 'add' ? addLecturerToCourse(data,sessionStorage.getItem("token")) :
            removeLecturerFromCourse(data,sessionStorage.getItem("token")))
            .then(() => {
                this.setState({isLoading: false});
                setTimeout(this.props.history.push(this.previousPath()),500);
            })
            .catch(e => {
                this.setState({isLoading: false});
                errorHandler.bind(this)(e);
            });
    }

    render () {
        return <div className="container mt-3 pb-3">
            {this.state.isLoading ? <Loading /> : null}
            <h2 className="jumbotron">{this.props.match.params.type === 'enrol' ?
                (this.props.match.params.role === 'student' ? 'Enrol Student' : 'Add Lecturer') :
                (this.props.match.params.role === 'student' ? 'Withdraw Student' : 'Remove Lecturer')}</h2>

            <dl className="row">
                <dt className="col-sm-3">Choose Course</dt>
                <dd className="col-sm-9">
                    <select ref="course-list" value={this.state.courseValue} name='courseValue'
                            disabled={this.state.isCourseDisabled} onChange={()=>{}}>
                        <option value={0}>Please Choose Course</option>
                        {this.state.isDataReady ? this.filterCourses() : null}
                    </select>
                </dd>

                <dt className="col-sm-3">Course Name</dt>
                <dd className="col-sm-9">{this.state.isDataReady ?
                    this.state.coursesData.map(course => {return this.findCourse(course,"name")}) : "Loading..."}</dd>

                <dt className="col-sm-3">Maximun Students</dt>
                <dd className="col-sm-9">{this.state.isDataReady ?
                    this.state.coursesData.map(course => {return this.findCourse(course,"maxStudents")}) : "Loading..."}</dd>

                <dt className="col-sm-3">Current Students</dt>
                <dd className="col-sm-9">{this.state.isDataReady ?
                    this.state.coursesData.map(course => {return this.findCourse(course,"currentStudents")}) : "Loading..."}</dd>

                <dt className="col-sm-3">Course Credit</dt>
                <dd className="col-sm-9">{this.state.isDataReady ?
                    this.state.coursesData.map(course => {return this.findCourse(course,"credit")}) : "Loading..."}</dd>
            </dl>

            {this.props.match.params.role === 'student' ?
                (<dl className="row">
                    <dt className="col-sm-3">Choose Student</dt>
                    <dd className="col-sm-9">
                        <select ref="student-list" value={this.state.studentValue} name="studentValue"
                                disabled={this.state.isStudentDisabled} onChange={()=>{}}>
                            <option value={0}>Please Choose Student</option>
                            {this.state.isDataReady ? this.filterStudentsOrLecturers('students') : null}
                        </select>
                    </dd>

                    <dt className="col-sm-3">Student Name</dt>
                    <dd className="col-sm-9">{this.state.isDataReady ?
                        this.state.studentsData.map(student => {
                            return this.findStudent(student, "name")
                        }) : "Loading..."}</dd>

                    <dt className="col-sm-3">Student Credit Limit</dt>
                    <dd className="col-sm-9">{this.state.isDataReady ?
                        this.state.studentsData.map(student => {
                            return this.findStudent(student, "creditLimit")
                        }) : "Loading..."}</dd>

                    <dt className="col-sm-3">Current Credit</dt>
                    <dd className="col-sm-9">{this.state.isDataReady ?
                        this.state.studentsData.map(student => {
                            return this.findStudent(student, "currentCredit")
                        }) : "Loading..."}</dd>
                </dl>) :

                (<dl className="row">
                    <dt className="col-sm-3">Choose Lecturer</dt>
                    <dd className="col-sm-9">
                        <select ref="lecturer-list" value={this.state.lecturerValue} name="lecturerValue"
                                disabled={this.state.isLecturerDisabled} onChange={()=>{}}>
                            <option value={0}>Please Choose Lecturer</option>
                            {this.state.isDataReady ? this.filterStudentsOrLecturers('lecturers') : null}
                        </select>
                    </dd>

                    <dt className="col-sm-3">Lecturer Name</dt>
                    <dd className="col-sm-9">{this.state.isDataReady ?
                        this.state.lecturersData.map(lecturer => {
                            return this.findLecturer(lecturer, "name")
                        }) : "Loading..."}</dd>
                </dl>)
            }

            {this.props.match.params.type === 'enrol' ?
                <button className="btn btn-info" onClick={this.props.match.params.role === 'student' ?
                    ( () => this.ajaxStudent("enrol") ) : ( () => this.ajaxLecturer("add") )}>
                    {this.props.match.params.role === 'student' ? 'Enrol' : 'Add'}
                </button> :
                <button className="btn btn-info" onClick={this.props.match.params.role === 'student' ?
                    ( () => this.ajaxStudent("withdraw") ) : ( () => this.ajaxLecturer("remove") )}>
                    {this.props.match.params.role === 'student' ? 'Withdraw' : 'Remove' }
                </button>}
            {this.state.errorMessage ? <SweetAlert
                danger
                confirmBtnText="OK"
                confirmBtnBsStyle="primary"
                title="Oops, something went wrong!"
                onConfirm={() => this.hideAlert()}
            >
                {this.state.errorMessage}
            </SweetAlert> : null}
        </div>;
    }
}



export default Enrolment;