import React, { Component } from 'react';
import gravatarUrl from 'gravatar-url';

export default function Gravatar ({email, size = 100, style, ...rest}) {
    return (
        <img
            className="rounded-circle mx-auto d-block img-fluid"
            src={gravatarUrl(email, {size})}
            alt="gravatar"
            style={{...style}}
            {...rest}
        />
    );
}