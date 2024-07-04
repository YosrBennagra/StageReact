import { Box, Button, Divider, Grid, IconButton, InputAdornment, Radio, Tooltip, Typography } from "@mui/material";
import { IconX, IconCheck, IconEdit, IconTrash } from "@tabler/icons";
import React, { useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
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
            checked: false // add checked property
        })) : [];
    const initialContent = question && question.content ? question.content : '';
    const initialScore = question && question.score ? question.score : 0;
    const [answers, setAnswers] = useState(initialAnswers);
    const [questionContent, setQuestionContent] = useState(initialContent);
    const [questionScore, setQuestionScore] = useState(initialScore);
    const user = useAuthUser();
    const assignmentid = question && question.assignmentId ? question.assignmentId : '';

    const handleCheckboxChange = (index) => {
        const updatedAnswers = answers.map((answer, i) => ({
            ...answer,
            checked: i === index ? !answer.checked : false // only one can be checked at a time
        }));
        setAnswers(updatedAnswers);
        const checkedAnswers = updatedAnswers.filter(answer => answer.checked);
        console.log("🚀 ~ Checked Answers:", checkedAnswers);
        handleAnswer(checkedAnswers);
    };

    const handleAnswer = async (checkedAnswers) => {
        const correctAnswers = answers.filter((answer) => answer.correct === true).map((answer) => answer.text);
        const isCorrect = JSON.stringify(checkedAnswers.map(answer => answer.text).sort()) === JSON.stringify(correctAnswers.sort());
        const newAnswer = {
            content: checkedAnswers.map(answer => answer.text),
            assignmentId: assignmentid,
            correctAnswer: correctAnswers,
            isCorrect: isCorrect,
            score: isCorrect ? questionScore : 0
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
                console.log("🚀 ~ file: QCU.js:56 ~ handleAnswer ~ response:", response);
            } else {
                console.error('Failed to add the answer');
            }
        } catch (error) {
            console.error('Error adding answer:', error);
        }
    };

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
                {answers.map((answer, index) => (
                    <div key={answer.id}>
                        <Radio
                            checked={answer.checked}
                            onChange={() => handleCheckboxChange(index)}
                            inputProps={{ 'aria-label': 'primary radio' }}
                            value={answer.text}
                        />
                        {answer.text}
                        <Divider sx={{ my: 1 }}></Divider>
                    </div>
                ))}
            </form>
        </ParentCard>
    );
}
