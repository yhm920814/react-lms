import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Gravatar from '../Util/Gravatar';


export default function StudentCard(props) {
    return (
      <tr>
        <td>
            <Gravatar email= {props.data.email}
                      size = {30}
            />
        </td>
        <td>{props.data.name}</td>
        <td>{props.data.desc}</td>
        <td><Link to={`/lecturers/${props.data.id}`} className="btn btn-outline-primary btn-sm">View Detail</Link></td>
      </tr>
    );
}
