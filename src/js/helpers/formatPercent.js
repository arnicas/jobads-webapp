import React from 'react';

export default function formatPercent(double) {
    let i = parseFloat(double);
    let className='indicator ';
    switch(true){
        case(i == 100):
            className += 'best';
            break;
        case(i >= 90):
            className += 'good';
            break;
        case(i >= 60):
            className += 'medium';
            break;
        case(i >= 30):
            className += 'bad';
            break;
        default:
            className += 'bad';
    }
    return (<span className={className}>{i} %</span>);
};