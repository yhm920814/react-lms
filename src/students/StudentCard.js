import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Gravatar from '../Util/Gravatar';

export default function StudentCard(props) {
    return (
  /*      <div className="col-md-4">
            <div className="card">
                <img className="card-img-top" src={props.data.imageUrl ? props.data.imageUrl : studentImage} alt="Card image cap" />
                <div className="card-body">
                    <h4 className="card-title">{props.data.name}</h4>
                    <p className="card-text">Fee: {props.data.fee}</p>
                    <p className="card-text">CreditLimit: {props.data.creditLimit}</p>
                    <p className="card-text">CurrentCredit: {props.data.currentCredit}</p>
                    <Link to={`/students/${props.data.id}`} className="btn btn-primary">View Student Detail</Link>
                </div>
            </div>
        </div>
        */
        <tr>
            <td>
              <Gravatar email= {props.data.email}
                        size = {30}
              />
            </td>
            <td>{props.data.name}</td>
            <td>{props.data.fee}</td>
            <td>{props.data.creditLimit}</td>
            <td>{props.data.currentCredit}</td>
            <td><Link to={`/students/${props.data.id}`} className="btn btn-outline-primary btn-sm">View Detail</Link></td>
        </tr>

    );
}
