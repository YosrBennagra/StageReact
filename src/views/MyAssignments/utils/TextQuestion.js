import { Grid, IconButton, Typography } from "@mui/material";
import { IconEdit, IconTrash, IconCheck } from "@tabler/icons";
import React, { useState, useEffect } from "react";
import CustomFormLabel from "src/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "src/components/forms/theme-elements/CustomTextField";
import ParentCard from "src/components/shared/ParentCard";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function TextQuestion({ question }) {
    const initialContent = question && question.content ? question.content : '';
    const initialScore = question && question.score ? question.score : 0;
    const initialAnswer = question && question.options && question.options.length > 0 ? question.options[0] : '';
    const [questionContent, setQuestionContent] = useState(initialContent);
    const [questionScore, setQuestionScore] = useState(initialScore);
    const [answer, setAnswer] = useState(initialAnswer);
    const user = useAuthUser();
    const assignmentid = question && question.assignmentId ? question.assignmentId : '';

    useEffect(() => {
        const handleAnswer = async () => {
            const newAnswer = {
                content: answer,
                assignmentId: assignmentid,
                isCorrect: false
            };
            try {
                const response = await fetch(`http://localhost:3001/answers/${question.id}/${user.userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newAnswer),
                });
                if (response.ok) {
                    console.log("🚀 ~ file: TextQuestion.js:39 ~ handleAnswer ~ response:", response);
                } else {
                    console.error('Failed to add the answer');
                }
            } catch (error) {
                console.error('Error adding answer:', error);
            }
        };

        if (answer) {
            handleAnswer();
        }
    }, [answer, assignmentid, question.id, user.userId]);

    return (
        <ParentCard
            title={<Typography variant="h4">{questionContent}</Typography>}
            action={
                <>
                    <Typography variant="h6"> Question Score :</Typography>
                    <Typography color="primary" variant="h6">{questionScore}</Typography >
                    <Typography> pt(s)</Typography>
                </>
            }
        >
            <form>
                <CustomTextField
                    helperText="Please write your answer in the TextArea above."
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
            </form>
        </ParentCard>
    );
}
