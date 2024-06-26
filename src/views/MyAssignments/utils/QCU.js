import { Box, Button, Divider, Grid, IconButton, InputAdornment, Radio, Tooltip, Typography } from "@mui/material";
import { IconX, IconCheck, IconEdit, IconTrash } from "@tabler/icons";
import React, { useState } from "react";
import DefaultRadio from "src/components/forms/form-elements/radio/Default";
import CustomFormLabel from "src/components/forms/theme-elements/CustomFormLabel";
import CustomOutlinedInput from "src/components/forms/theme-elements/CustomOutlinedInput";
import CustomTextField from "src/components/forms/theme-elements/CustomTextField";
import ParentCard from "src/components/shared/ParentCard";

export default function QCU({ question }) {
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








    return (
        <ParentCard
            title={<Typography variant="h4">{questionContent}</Typography>}
            action={
                <>
                    <Typography variant="h6" > Question Score :</Typography>
                    <Typography color="primary" variant="h6">{questionScore}</Typography >
                    <Typography > pt(s)</Typography>
                </>
            }
        >
            <form>
                {answers.map((answer) => (
                    <>
                    <div key={answer.id}>
                        <Radio
                            checked={answer.correct}
                            inputprops={{ 'aria-label': 'primary radio' }}
                            value={answer.text}
                        />
                        {answer.text}
                    </div>
                    <Divider sx={{ my: 1 }}></Divider>
                    </>
                ))}
            </form>
        </ParentCard>
    );
}
