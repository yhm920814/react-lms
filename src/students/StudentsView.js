import React, { Component } from 'react';
import StudentCard from './StudentCard';
import {getStudents,errorHandler} from '../Util/apiConnect';
import {Link} from 'react-router-dom';
import Loading from '../Util/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';


class StudentsView extends Component{
    constructor(){
        super();
        this.state = {
            isLoading: false,
            students: [],
            errorMessage: '',
        };
    }

    componentWillMount(){
        this.renderStudents();
    }

    hideAlert() {
        if(this.state.errorMessage === 'Authentication failed. Please login again.'){
            window.location.reload();
        }
        this.setState({
            errorMessage: '',
        });
    }

    renderStudents(){
        this.setState({isLoading: true});
        getStudents(sessionStorage.getItem("token"))
            .then(response => {
                this.setState({
                    students: response.data
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
                    <h2 className="jumbotron">Student List</h2>
                    <Link to={`/students/action/add`}
                          className="btn btn-success mb-3">Add Student</Link>
                    <table className="table table-hover">
                                <thead>
                                  <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Fee</th>
                                    <th>Credit Limit</th>
                                    <th>Current Credit</th>
                                    <th>View Details</th>
                                  </tr>
                                </thead>
                                <tbody>
                        {this.state.students ? this.state.students.map((student, index) => {
                            return    <StudentCard key={index} data={student}/>
                        }) : null}
                        </tbody>
                        </table>
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

export default StudentsView;
