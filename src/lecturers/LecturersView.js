import React, { Component } from 'react';
import LecturerCard from './LecturerCard';
import {getLecturers,errorHandler} from '../Util/apiConnect';
import {Link} from 'react-router-dom';
import Loading from '../Util/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';


class LecturersView extends Component{
    constructor(){
        super();
        this.state = {
            isLoading: false,
            lecturers: [],
            errorMessage: '',
        };
    }

    componentWillMount(){
        this.renderLecturers();
    }

    hideAlert() {
        if(this.state.errorMessage === 'Authentication failed. Please login again.'){
            window.location.reload();
        }
        this.setState({
            errorMessage: '',
        });
    }

    renderLecturers(){
        this.setState({isLoading: true});
        getLecturers(sessionStorage.getItem("token"))
            .then(response => {
                this.setState({
                    lecturers: response.data
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
                  <h2 className="jumbotron">Lecturer List</h2>
                  <Link to={`/lecturers/action/add`}
                        className="btn btn-success mb-3">Add Lecturer</Link>
                  <table class="table table-hover">
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>Name</th>
                                  <th>Description</th>
                                  <th>View Details</th>
                                </tr>
                              </thead>
                              <tbody>
                        {this.state.lecturers ? this.state.lecturers.map((lecturer, index) => {
                            return <LecturerCard key={index} data={lecturer}/>
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
    };
}

export default LecturersView;
