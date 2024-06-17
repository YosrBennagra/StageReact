import { Box, Button, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { IconX, IconCheck, IconEdit, IconTrash } from "@tabler/icons";
import React, { useState } from "react";
import CustomFormLabel from "src/components/forms/theme-elements/CustomFormLabel";
import CustomOutlinedInput from "src/components/forms/theme-elements/CustomOutlinedInput";
import CustomTextField from "src/components/forms/theme-elements/CustomTextField";
import ParentCard from "src/components/shared/ParentCard";


export default function CreateQCM({ questionId, onDelete }) {
    const [answers, setAnswers] = useState([{ id: 1, correct: false }]);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isEditable, setIsEditable] = useState(true);

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
            { id: prevAnswers.length + 1, correct: false },
        ]);
    };

    const handleConfirm = () => {
        setIsConfirmed(true);
        setIsEditable(false);
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
                />

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
                            endAdornment={
                                <InputAdornment position="end">
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
                        <Button variant="outlined" color="secondary" >
                            +
                        </Button>
                    </Tooltip>
                )}
            </form>
        </ParentCard>
    );
}