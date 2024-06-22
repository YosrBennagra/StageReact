import { Box, Button, Grid, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { IconX, IconCheck, IconEdit, IconTrash } from "@tabler/icons";
import React, { useState } from "react";
import CustomFormLabel from "src/components/forms/theme-elements/CustomFormLabel";
import CustomOutlinedInput from "src/components/forms/theme-elements/CustomOutlinedInput";
import CustomTextField from "src/components/forms/theme-elements/CustomTextField";
import ParentCard from "src/components/shared/ParentCard";

export default function CreateQCM({ question, questionId, onDelete, onSave , assignment }) {
    const initialAnswers = question && question.options ? 
        question.options.map((option, index) => ({
            id: index + 1,
            text: option,
            correct: question.correctAnswer.includes(option),
        })) : [];
    const initialContent = question && question.content ? question.content : '';
    const initialScore = question && question.score ? question.score : 0;
    const [answers, setAnswers] = useState(initialAnswers);
    
    const [questionContent, setQuestionContent] = useState(initialContent);
    const [questionScore, setQuestionScore] = useState(initialScore);
    const [isConfirmed, setIsConfirmed] = useState(true);
    const [isEditable, setIsEditable] = useState(!question || !question.id);

    const handleClickCorrect = (id) => {
        setAnswers((prevAnswers) =>
            prevAnswers.map((answer) =>
                answer.id === id ? { ...answer, correct: !answer.correct } : answer
            )
        );
    };

    const handleAddAnswer = () => {
        setAnswers((prevAnswers) => [
            ...prevAnswers,
            { id: prevAnswers.length + 1, text: '', correct: false },
        ]);
    };

    const handleDeleteAnswer = (id) => {
        setAnswers((prevAnswers) => prevAnswers.filter((answer) => answer.id !== id));
    };

    const handleConfirm = async () => {
        const correctAnswers = answers.filter((answer) => answer.correct).map((answer) => answer.text);
        const options = answers.map((answer) => answer.text);
        const newQuestion = {
            assignementId: assignment,  
            content: questionContent,
            options,
            type: 'QCM',
            correctAnswer: correctAnswers,
            score: questionScore,
        };
        const response = await fetch(`http://localhost:3001/questions/${questionId}`, {
            method: 'PUT',
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

                {answers.map((answer) => (
                    <div key={answer.id}>
                        <CustomFormLabel htmlFor={`ordinary-outlined-answer-input-${questionId}-${answer.id}`}>
                            Answer {answer.id}
                        </CustomFormLabel>
                        <CustomOutlinedInput
                            id={`ordinary-outlined-answer-input-${questionId}-${answer.id}`}
                            variant="outlined"
                            fullWidth
                            sx={{
                                mb: "10px",
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: answer.correct ? "green" : "red",
                                    },
                                },
                            }}
                            disabled={!isEditable}
                            value={answer.text}
                            onChange={(e) =>
                                setAnswers((prevAnswers) =>
                                    prevAnswers.map((ans) =>
                                        ans.id === answer.id ? { ...ans, text: e.target.value } : ans
                                    )
                                )
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => handleDeleteAnswer(answer.id)} disabled={!isEditable}>
                                        <IconTrash color="#b52222" />
                                    </IconButton>
                                    <IconButton
                                        aria-label="toggle answer visibility"
                                        onClick={() => handleClickCorrect(answer.id)}
                                        edge="end"
                                        disabled={!isEditable}
                                    >
                                        {answer.correct ? (
                                            <IconCheck color="green" size="20" />
                                        ) : (
                                            <IconX color="red" size="20" />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </div>
                ))}
                {isEditable && (
                    <Tooltip title="Add an Answer" onClick={handleAddAnswer} fullWidth>
                        <Button variant="outlined" color="secondary">
                            +
                        </Button>
                    </Tooltip>
                )}
            </form>
        </ParentCard>
    );
}
