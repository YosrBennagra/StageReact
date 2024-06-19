import { IconButton } from "@mui/material";
import { IconEdit, IconTrash, IconCheck } from "@tabler/icons";
import React, { useState } from "react";
import CustomFormLabel from "src/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "src/components/forms/theme-elements/CustomTextField";
import ParentCard from "src/components/shared/ParentCard";

export default function CreateTextQuestion({ questionId, onDelete, onSave }) {
    const [questionContent, setQuestionContent] = useState('');
    const [answer, setAnswer] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isEditable, setIsEditable] = useState(true);

    const handleConfirm = async () => {
        const question = {
            assignementId: '666c73f1d182018b1bd0d694', // Replace with the actual assignment ID
            content: questionContent,
            options: [],
            correctAnswer: answer,
            type: 'text',
            score: 0,
        };

        const response = await fetch('http://localhost:3001/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(question),
        });

        if (response.ok) {
            setIsConfirmed(true);
            setIsEditable(false);
            onSave(questionId);
        } else {
            // Handle error
            console.error('Failed to save the question');
        }
    };

    const handleEdit = () => {
        setIsConfirmed(false);
        setIsEditable(true);
    };

    return (
        <ParentCard
            title={`Question ${questionId}`}
            action={
                <>
                    {isConfirmed ? (
                        <IconButton onClick={handleEdit}>
                            <IconEdit color="#1a44ad" />
                        </IconButton>
                    ) : (
                        <IconButton onClick={handleConfirm}>
                            <IconCheck color="green" />
                        </IconButton>
                    )}
                    <IconButton onClick={() => onDelete(questionId)}>
                        <IconTrash color="#b52222" />
                    </IconButton>
                </>
            }
        >
            <form>
                <CustomFormLabel sx={{ mt: 0 }} htmlFor={`question-${questionId}`}>
                    Question {questionId}
                </CustomFormLabel>
                <CustomTextField
                    id={`question-${questionId}`}
                    helperText="Please enter the question above."
                    variant="outlined"
                    fullWidth
                    disabled={!isEditable}
                    value={questionContent}
                    onChange={(e) => setQuestionContent(e.target.value)}
                />
                <CustomFormLabel sx={{ mt: 2 }} htmlFor={`text-answer-${questionId}`}>
                    Answer
                </CustomFormLabel>
                <CustomTextField
                    id={`text-answer-${questionId}`}
                    helperText="Please enter the answer."
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    disabled={!isEditable}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
            </form>
        </ParentCard>
    );
}
