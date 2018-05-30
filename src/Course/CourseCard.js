import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import courseImage from '../static/student.png';


export default function CourseCard(props) {
    return (
        <div className="col-md-4">
            <div className="card">
                <img className="card-img-top" src={props.data.imageUrl ? props.data.imageUrl : courseImage} alt="Card image cap" />
                <div className="card-body">
                    <h4 className="card-title">{props.data.name}</h4>
                    <p className="card-text">{`${props.data.desc.slice(0,30)}...`}</p>
                    <Link to={`/courses/${props.data.id}`} className="btn btn-primary">View Course Detail</Link>
                </div>
            </div>
        </div>
    );
}