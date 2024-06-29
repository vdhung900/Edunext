import React, { useEffect, useState } from 'react'
import SideNav from '../components/SideNav'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../components/styles.css'

function Question() {
    const { id } = useParams();
    const [question, setQuestion] = useState([]);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const questionResponse = await axios.get(`http://localhost:9999/questions/${id}`);
                setQuestion(questionResponse.data);
                const answersResponse = await axios.get('http://localhost:9999/answers');
                setAnswers(answersResponse.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [])
    return (
        <div>
            <div className="container">
                <SideNav />
                <div className="main-content">
                    <div className="group-component">
                        <h2>(Question) {question.title}</h2>
                        <div className="content-box">
                            <div className="content">
                                <h3>Content</h3><hr />
                                <p>{question.content}</p>
                            </div>
                        </div>
                        <p>
                            Discussion time has been started.<br />
                            Students can comment and vote for comments during this time.<br /> 
                            Current Timezone: You are currently in <b>Asia/Saigon</b> time zone <b>(GMT+7)</b></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Question