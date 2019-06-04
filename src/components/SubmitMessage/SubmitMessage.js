import React , {Component} from 'react'
import {withRouter , NavLink} from 'react-router-dom';
import {Table} from 'react-bootstrap';



export default withRouter(class SubmitMessage extends Component {

    state = {

    }
    render() {
        const { report } = this.props;
        const {answered , correct , gained_marks} = report;
        return(
            <div className='submit-message container'>
                <h1 className='text-center'>Your answers has been submitted successfully.</h1>
                <h5 className='badge badge-warning text-center'>Your Score : </h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Answered</th>
                        <th>Correct</th>
                        <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>1</td>
                        <td>{answered}</td>
                        <td>{correct}</td>
                        <td>{gained_marks}</td>
                        </tr>
                        
                    </tbody>
                </Table>
                <NavLink to='/profile' className='btn btn-success'><i className="fas fa-long-arrow-alt-left"></i> Back To Profile</NavLink>
            </div>
        );
    }

});
