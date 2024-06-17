import React, { useState } from 'react'
import CreateQCM from './utils/CreateQCM'
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Box, Button, Tooltip } from '@mui/material';

export default function CreateAssignment() {
    const [questions, setQuestions] = useState([{ id: 1 }]);
    const BCrumb = [
        {
            to: '/',
            title: 'Assignments',
        },
        {
            title: 'Create',
        },
    ];

    const handleAddQuestion = () => {
        setQuestions((prevQuestions) => [
            ...prevQuestions,
            { id: prevQuestions.length + 1 },
        ]);
    };

    const handleDeleteQuestion = (questionId) => {
        setQuestions((prevQuestions) => prevQuestions.filter(q => q.id !== questionId));
    };

    return (
        <>
            <Breadcrumb title="Creating An Assignment" items={BCrumb} />
            {questions.map((question) => (
                <Box key={question.id} sx={{ mb: 4 }}>
                    <CreateQCM questionId={question.id} onDelete={handleDeleteQuestion} />
                </Box>
            ))}
            <Tooltip title="Add a Question" onClick={handleAddQuestion} fullWidth>
                <Button variant="outlined" color="primary" >
                    +
                </Button>
            </Tooltip>
        </>
    );
}