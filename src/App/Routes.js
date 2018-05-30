import React, { Component } from 'react';
import {Route,Redirect} from 'react-router-dom';
import CoursesView from '../Course/CoursesView';
import Login from '../User/Login';
import CourseDetailView from '../Course/CourseDetailView';
import StudentsView from '../students/StudentsView';
import StudentDetailView from '../students/StudentDetailView';
import LecturersView from '../lecturers/LecturersView';
import LecturerDetailView from '../lecturers/LecturerDetailView';
import Register from '../User/Register';
import ActivationView from "../User/ActivationView";
import Enrolment from "../Enrolment/EnrolmentView";
import AddAndEditCourse from "../Course/AddAndEditCourse";
import AddAndEditStudent from "../students/AddAndEditStudent";
import AddAndEditLecturer from "../lecturers/AddAndEditLecturer";

const ProtectedRoute = ({component: ProtectedComponent, ...rest}) => {
        return <Route {...rest} render={props => {
             return !!sessionStorage.getItem("token") ? <ProtectedComponent {...props} /> :
                <Redirect to={{
                        pathname: '/login',
                }} />;
        }}/>;
};

export default () => ((
    <div>
        <ProtectedRoute exact path="/" component={CoursesView} />
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/courses" component={CoursesView} />
        <ProtectedRoute exact path="/courses/:id" component={CourseDetailView} />
        <ProtectedRoute exact path="/courses/action/:action" component={AddAndEditCourse} />

        <ProtectedRoute exact path="/students" component={StudentsView} />
        <ProtectedRoute exact path="/students/:id" component={StudentDetailView} />
        <ProtectedRoute exact path="/students/action/:action" component={AddAndEditStudent} />

        <ProtectedRoute exact path="/lecturers" component={LecturersView} />
        <ProtectedRoute exact path="/lecturers/:id" component={LecturerDetailView} />
        <ProtectedRoute exact path="/lecturers/action/:action" component={AddAndEditLecturer} />

        <ProtectedRoute exact path="/enrolment/:type/:role" component={Enrolment} />
        <Route exact path="/signup" component={Register} />
        <Route exact path="/activate" component={ActivationView} />
        <Route exact path="/activate/:email" component={ActivationView} />
    </div>
    )
);
