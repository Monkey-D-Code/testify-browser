import React , {Component} from 'react';
import {withRouter , NavLink} from 'react-router-dom'
import Modal from 'react-responsive-modal';

import axios from 'axios';


import './QuizDetail.css';

export default withRouter(class QuizDetail extends Component{

    state = {
        modalOpen : false,
        ajaxerror : '',

        Quiz : {},
        
    }

    componentWillMount(){
       

        axios.get(`http://127.0.0.1:8000/quiz/${this.props.match.params.id}/details/`)
            .then((response) => {

                this.setState({
                    Quiz : response.data,
                   
                })
                
            })
            .catch((response , error)=>{

                console.log(error);
                this.setState({
                    ajaxerror: JSON.stringify(response),
                    modalOpen : true,
                })
            })
    }


    // modal functions
    onOpenModal = ()=>{
        this.setState({
          modalOpen : true,
        })
      }
    onCloseModal = ()=>{
        this.setState({
            modalOpen : false,
        })
    }


    render() {
        const {modalOpen , ajaxerror , Quiz} = this.state;
        const {goFullScreen} = this.props;

        return(
            <div className='quiz-details'>


                <img src={Quiz.cover_image_url} alt={Quiz.name} />
                <h1>{Quiz.name} {Quiz.negative_marking && <i className="fas fa-exclamation-triangle"></i>}</h1>
                <p>
                    <i className="fas fa-stopwatch"></i> {Quiz.allotted_time_in_minutes} minutes
                </p>
                <p>
                    <i className="far fa-calendar-plus"></i> {Quiz.pub_date}
                    
                </p>
                <p>
                <i className="fas fa-book-open"></i> {Quiz.syllabus}
                    
                </p>
                <br/>
               <NavLink to={`/exam/${Quiz.id}`} className='btn' quiz={Quiz} onClick={goFullScreen}>Start Quiz</NavLink>


                <Modal open={modalOpen} onClose={this.onCloseModal} center closeOnOverlayClick style={{padding:'1.3em'}}>
                    <h2>Please Correct the following errors</h2>
                    
                    <div>
                        {ajaxerror}
                    </div>
                </Modal>
            </div>
        );
    }

});