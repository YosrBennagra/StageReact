import { Grid, IconButton, Typography } from "@mui/material";
import { IconEdit, IconTrash, IconCheck } from "@tabler/icons";
import React, { useState } from "react";
import CustomFormLabel from "src/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "src/components/forms/theme-elements/CustomTextField";
import ParentCard from "src/components/shared/ParentCard";

export default function TextQuestion({ question}) {
    const initialContent = question && question.content ? question.content : '';
    const initialScore = question && question.score ? question.score : 0;
    const initialAnswer = question && question.options && question.options.length > 0 ? question.options[0] : '';
    const [questionContent, setQuestionContent] = useState(initialContent);
    const [questionScore, setQuestionScore] = useState(initialScore);
    const [answer, setAnswer] = useState(initialAnswer);




    return (
        <ParentCard
            title={<Typography variant="h4">{questionContent}</Typography>}
            action={
                <>
                    <Typography variant="h6" > Question Score :</Typography>
                    <Typography color="primary" variant="h6">{questionScore}</Typography >
                    <Typography> pt(s)</Typography>
                </>
            }
        >
            <form>
                <CustomTextField

                    helperText=" Please write your answer in the TextArea above."
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
            </form>
        </ParentCard >
    );
}
