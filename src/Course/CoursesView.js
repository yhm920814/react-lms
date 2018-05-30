import React, { Component } from 'react';
import CourseCard from './CourseCard';
import {getCourses,errorHandler} from '../Util/apiConnect';
import {Link} from 'react-router-dom';
import Loading from '../Util/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';


class CoursesView extends Component{
    constructor(){
        super();
        this.state = {
            isLoading: false,
            courses: [],
            errorMessage: '',
        };
    }

    componentWillMount(){
        this.renderCourses();
    }

    hideAlert() {
        if(this.state.errorMessage === 'Authentication failed. Please login again.'){
            window.location.reload();
        }
        this.setState({
            errorMessage: '',
        });
    }

    renderCourses(){
        this.setState({isLoading: true});
        getCourses(sessionStorage.getItem("token"))
            .then(response => {
                this.setState({
                    courses: response.data
                });
                this.setState({isLoading: false});
            }).catch(e=>{
                this.setState({isLoading: false});
                errorHandler.bind(this)(e);
        });
    }

    render () {
        return (
            <div className="container mt-3">
                {this.state.isLoading ? <Loading /> : null}
                <h2 className="jumbotron">Course List</h2>
                <Link to={`/courses/action/add`}
                      className="btn btn-success mb-3">Add Course</Link>
                <div className="row">
                    {this.state.courses ? this.state.courses.map((course, index) => {
                        return <CourseCard key={index} data={course}/>
                    }) : null}
                </div>
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

export default CoursesView;