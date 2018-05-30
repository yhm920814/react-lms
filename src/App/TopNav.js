import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import logo from '../static/logo.png';

export default function TopNav() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                {/*<img className="rounded-circle " src={logo} alt="logo" />*/}
                <Link to="/" className="navbar-brand" style={{lineHeight: '50px'}}>
                    <img className="rounded-circle mr-2" src={logo} style={{height: "50px"}} alt="logo" />
                    {sessionStorage.getItem("token") ? 'WSH' : 'Windsor State High School'}
                </Link>
                {sessionStorage.getItem("token") ? (<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>) : null}
                {sessionStorage.getItem("token") ? (<div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <Link to="/courses" className="nav-link">Courses</Link>
                        </li>
                        <li className="nav-item active">
                            <Link to="/students" className="nav-link">Students</Link>
                        </li>
                        <li className="nav-item active">
                            <Link to="/lecturers" className="nav-link">Lecturers</Link>
                        </li>
                        <li className="nav-item ml-auto active">
                            <a className="nav-link" onClick={() => {
                                sessionStorage.removeItem("token");
                                window.location.reload();
                            }}>Logout</a>
                        </li>
                    </ul>
                </div>) : null}
            </nav>
        );
}

