import { Grid, IconButton } from "@mui/material";
import { IconEdit, IconTrash, IconCheck } from "@tabler/icons";
import React, { useState } from "react";
import CustomFormLabel from "src/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "src/components/forms/theme-elements/CustomTextField";
import ParentCard from "src/components/shared/ParentCard";

export default function CreateTextQuestion({ question, questionId, onDelete, onSave, assignment }) {
    const initialContent = question && question.content ? question.content : '';
    const initialScore = question && question.score ? question.score : 0;
    const initialAnswer = question && question.options && question.options.length > 0 ? question.options[0] : '';
    const [questionContent, setQuestionContent] = useState(initialContent);
    const [questionScore, setQuestionScore] = useState(initialScore);
    const [answer, setAnswer] = useState(initialAnswer);
    const [isConfirmed, setIsConfirmed] = useState(true);
    const [isEditable, setIsEditable] = useState(!question || !question.id);

    const handleConfirm = async () => {
        const newQuestion = {
            assignementId: assignment,  
            content: questionContent,
            type: 'TEXT',
            score: questionScore,
        };

        const response = await fetch('http://localhost:3001/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newQuestion),
        });

        if (response.ok) {
            setIsConfirmed(true);
            setIsEditable(false);
            onSave(questionId);
        } else {
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
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
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
                            placeholder="Enter your question here"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CustomFormLabel sx={{ mt: 0 }} htmlFor={`score-${questionId}`}>
                            Score
                        </CustomFormLabel>
                        <CustomTextField
                            id={`score-${questionId}`}
                            helperText="Enter the score"
                            variant="outlined"
                            fullWidth
                            disabled={!isEditable}
                            placeholder="Score"
                            value={questionScore}
                            onChange={(e) => setQuestionScore(e.target.value)}
                            type="number"
                        />
                    </Grid>
                </Grid>
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
