import React , {Component} from 'react';
import {withRouter} from 'react-router-dom';



import './ReportList.css'

export default withRouter(class ReportList extends Component {

    render() {

        return(
            <h1>This Component displayes all the results of tests given by a Student</h1>
        );
    }
})
