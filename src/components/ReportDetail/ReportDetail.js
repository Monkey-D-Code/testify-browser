import React , {Component} from 'react';
import {withRouter} from 'react-router-dom';



import './ReportDetail.css'

export default withRouter(class ReportDetail extends Component {

    render() {

        return(
            <h1>Display the result of a single test of a student</h1>
        );
    }
})
