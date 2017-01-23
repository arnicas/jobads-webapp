/**
 * React Components & Router
 */

import React from 'react';
import {Router, Route, hashHistory} from 'react-router';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './container/main';

var $ = function(f){
    document.addEventListener('DOMContentLoaded', f, false);
};

$(()=> {

    injectTapEventPlugin();

    ReactDom.render(
        <Main/>,
        document.getElementById('jobads-webapp')
    );

});