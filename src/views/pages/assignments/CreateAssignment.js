import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import CreateQCM from './utils/CreateQCM';
import CreateQCU from './utils/CreateQCU';
import CreateTextQuestion from './utils/CreateTextQuestion';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Box, Button, Tooltip, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

export default function CreateAssignment() {
    const [questions, setQuestions] = useState([]);
    const [questionType, setQuestionType] = useState('QCM');
    const { id } = useParams();

    const BCrumb = [
        {
            to: '/admin/dashboard',
            title: 'Dashboard',
        },
        {
            to: '/dashboard/assignments',
            title: 'Assignments',
        },
        {
            title: 'Create',
        },
    ];

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:3001/questions/assignment/${id}`);
                if (response.ok) {
                    const fetchedQuestions = await response.json();
                    console.log('Fetched Questions:', fetchedQuestions); 
                    setQuestions(fetchedQuestions.map((q) => ({
                        id: q._id,
                        type: q.type,
                        content: q.content,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        score: q.score
                    })));
                } else {
                    console.error('Failed to fetch questions');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, [id]);

    const handleAddQuestion = async () => {
        const newQuestion = {
            assignementId: id,
            content: '',
            options: [],
            correctAnswer: [],
            type: questionType,
            score: 0
        };

        try {
            const response = await fetch('http://localhost:3001/questions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newQuestion),
            });

            if (response.ok) {
                const savedQuestion = await response.json();
                setQuestions((prevQuestions) => [
                    ...prevQuestions,
                    { id: savedQuestion._id, type: questionType },
                ]);
            } else {
                console.error('Failed to add the question');
            }
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        try {
            const response = await fetch(`http://localhost:3001/questions/${questionId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setQuestions((prevQuestions) => prevQuestions.filter(q => q.id !== questionId));
            } else {
                console.error('Failed to delete the question');
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const handleQuestionTypeChange = (event) => {
        setQuestionType(event.target.value);
    };

    const handleSaveQuestion = (questionId) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
                q.id === questionId ? { ...q, saved: true } : q
            )
        );
    };

    return (
        <>
            <Breadcrumb title="Creating An Assignment" items={BCrumb} />
            {questions.map((question) => {
                console.log(`Rendering ${question.type} question with id ${question.id}`);
                return (
                    <Box key={question.id} sx={{ mb: 4 }}>
                        {question.type === 'QCM' && <CreateQCM question={question} questionId={question.id} assignment={id} onDelete={handleDeleteQuestion} onSave={handleSaveQuestion} />}
                        {question.type === 'QCU' && <CreateQCU question={question} questionId={question.id} assignment={id} onDelete={handleDeleteQuestion} onSave={handleSaveQuestion} />}
                        {question.type === 'TEXT' && <CreateTextQuestion question={question} questionId={question.id} assignment={id} onDelete={handleDeleteQuestion} onSave={handleSaveQuestion} />}
                    </Box>
                );
            })}
            <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                <InputLabel id="question-type-label">Question Type</InputLabel>
                <Select
                    labelId="question-type-label"
                    value={questionType}
                    onChange={handleQuestionTypeChange}
                    label="Question Type"
                >
                    <MenuItem value="QCM">QCM</MenuItem>
                    <MenuItem value="QCU">QCU</MenuItem>
                    <MenuItem value="TEXT">Text</MenuItem>
                </Select>
            </FormControl>
            <Tooltip title="Add a Question" onClick={handleAddQuestion} fullWidth>
                <Button variant="outlined" color="primary">
                    +
                </Button>
            </Tooltip>
        </>
    );
}
