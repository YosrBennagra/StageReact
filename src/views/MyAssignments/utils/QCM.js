import { Box, Button, Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useSelector } from "react-redux";
import CustomCheckbox from "src/components/forms/theme-elements/CustomCheckbox";

export default function QCM({ question }) {
    const customizer = useSelector((state) => state.customizer);
    const initialAnswers = question && question.options ?
        question.options.map((option, index) => ({
            id: index + 1,
            text: option,
            correct: question.correctAnswer.includes(option),
            checked: false
        })) : [];
    const initialContent = question && question.content ? question.content : '';
    const initialScore = question && question.score ? question.score : 0;
    const assignmentid = question && question.assignmentId ? question.assignmentId : '';
    const [answers, setAnswers] = useState(initialAnswers);
    const [questionContent, setQuestionContent] = useState(initialContent);
    const [questionScore, setQuestionScore] = useState(initialScore);
    const user = useAuthUser();


    const handleCheckboxChange = (index) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index].checked = !updatedAnswers[index].checked;
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
        console.log("🚀 ~ file: QCM.js:43 ~ handleAnswer ~ newAnswer.question:", question);

        try {
            const response = await fetch(`http://localhost:3001/answers/${question.id}/${user.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAnswer),
            });
            if (response.ok) {
                console.log("🚀 ~ file: QCM.js:42 ~ handleAnswer ~ response ok:", response);
            } else {
                console.error('Failed to add the answer');
            }
        } catch (error) {
            console.error('Error adding answer:', error);
        }
    };


    return (
        <Card
            sx={{ padding: 0 }}
            elevation={customizer.isCardShadow ? 9 : 0}
            variant={!customizer.isCardShadow ? 'outlined' : undefined}>
            <CardHeader title={<Typography variant="h4">{questionContent}</Typography>}
                action={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6">Question Score :</Typography>
                        <Typography color="primary" variant="h6">{questionScore}</Typography>
                        <Typography>pt(s)</Typography>
                    </Box >
                }
            />
            <Divider />
            <CardContent>
                <form>
                    {answers.map((answer, index) => (
                        <div key={answer.id}>
                            <CustomCheckbox
                                checked={answer.checked}
                                onChange={() => handleCheckboxChange(index)}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                value={answer.text}
                            />
                            {answer.text}
                            <Divider sx={{ my: 1 }} />
                        </div>
                    ))}
                </form>
            </CardContent>
        </Card>
    );
}
