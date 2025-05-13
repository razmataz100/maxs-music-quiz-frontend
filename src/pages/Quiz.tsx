import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { endGame, startGame } from "../httpUtils/game.ts";
import ConfirmationPopup from "../components/ConfirmationPopup.tsx";
import {QuizQuestion} from "../types/game.ts";
import {Button} from "../components/Button.tsx";
import CloseIcon from "../assets/close.svg";

function Quiz() {
    const { gameId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(30);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [loading, setLoading] = useState(true);
    const [playerKey, setPlayerKey] = useState(0);
    const [showConfirmLeave, setShowConfirmLeave] = useState(false);


    useEffect(() => {
        const loadGame = async () => {
            try {
                const authToken = localStorage.getItem("authToken");
                if (!authToken || !gameId) return;

                setLoading(true);
                const questions = await startGame(Number(gameId), authToken);
                setQuestions(questions);
                setLoading(false);
            } catch (error) {
                console.error("Error loading the game:", error);
                setLoading(false);
            }
        };

        loadGame();
    }, [gameId]);

    useEffect(() => {
        if (gameOver) {
            const finalizeGame = async () => {
                try {
                    const authToken = localStorage.getItem("authToken");
                    const userId = Number(localStorage.getItem("userId"));
                    if (!authToken || !gameId) return;

                    await endGame(Number(gameId), userId, correctAnswers, questions.length, authToken);
                } catch (error) {
                    console.error("Error ending the game:", error);
                }
            };

            finalizeGame();
        }
    }, [gameOver, gameId, correctAnswers]);

    useEffect(() => {
        if (gameOver || showResult || !questions.length || loading) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowResult(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestionIndex, showResult, gameOver, questions.length, loading]);

    useEffect(() => {
        setPlayerKey((prevKey) => prevKey + 1);
    }, [currentQuestionIndex]);

    const handleAnswerSelect = (answer: string) => {
        if (showResult) return;

        setSelectedAnswer(answer);

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = answer === currentQuestion.correctAnswer;

        if (isCorrect) {
            setCorrectAnswers((prev) => prev + 1);
        }

        setShowResult(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setTimeRemaining(30);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setGameOver(true);
        }
    };

    const handleLeaveClick = () => {
        setShowConfirmLeave(true);
    };

    const handleConfirmLeave = () => {
        navigate("/home");
    };

    const handleCancelLeave = () => {
        setShowConfirmLeave(false);
    };

    if (loading) {
        return (
            <div className="p-8 bg-white border border-gray-200 shadow-md w-full max-w-4xl mx-auto text-center rounded-lg">
                <h2 className="text-xl mb-6 text-gray-800">Loading Quiz Questions...</h2>
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
        );
    }

    if (gameOver) {
        return (
            <div className="p-8 bg-white border border-gray-200 shadow-md w-full max-w-4xl mx-auto text-center rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Game Over!</h2>
                <p className="text-xl mb-4 text-gray-700">Your final score: {correctAnswers}/{questions.length}</p>
                <Button
                    variant="secondary"
                    onClick={() => navigate("/home")}
                    className="mr-3"
                >
                    Back to Home
                </Button>
                <Button
                    variant="primary"
                    onClick={() => navigate("/profile")}
                >
                    View Profile
                </Button>
            </div>
        );
    }

    if (!questions.length) {
        return (
            <div className="p-8 bg-white border border-gray-200 shadow-md w-full max-w-4xl mx-auto text-center rounded-lg">
                <h2 className="text-xl mb-6 text-gray-800">No questions found for this game</h2>
                <Button
                    variant="secondary"
                    onClick={() => navigate("/home")}
                    className="mr-3"
                >
                    Back to Home
                </Button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div
            className="p-5 sm:p-10 bg-white border border-gray-200 shadow-md w-full max-w-4xl mx-auto rounded-lg flex flex-col h-full max-h-screen overflow-hidden">
            <div className="relative flex justify-center items-center mb-4">
                <Button
                    variant="secondary"
                    onClick={handleLeaveClick}
                    className="absolute right-0 bg-gray-500 hover:bg-gray-600 flex items-center text-white"
                >
                    <div className="flex items-center">
                        <img src={CloseIcon} alt="Close" className="h-5 w-5" />
                        <span className="ml-1 hidden sm:inline">Leave</span>
                    </div>
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-3 mt-8">
                <div className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-0">Score: {correctAnswers}</div>
                <div className="text-base sm:text-lg font-bold text-indigo-600 mb-1 sm:mb-0">
                    Time: {timeRemaining}s
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-800">
                    Question {currentQuestionIndex + 1}/{questions.length}
                </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold mb-3 text-center text-gray-800">
                {currentQuestion.questionText}
            </h2>

            <div className="flex justify-center mb-4">
                <div className="relative w-full sm:w-3/4">
                    <iframe
                        key={playerKey}
                        src={`https://open.spotify.com/embed/track/${currentQuestion.spotifyTrackId}?utm_source=generator&theme=0&autoplay=1`}
                        loading="lazy"
                        className="w-full h-20"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 overflow-auto max-h-48 sm:max-h-64">
                {currentQuestion.answerChoices.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerSelect(answer)}
                        disabled={showResult}
                        className={`p-3 rounded-lg text-base sm:text-lg font-medium transition-colors h-auto cursor-pointer ${
                            showResult
                                ? answer === currentQuestion.correctAnswer
                                    ? "bg-green-500 text-white"
                                    : selectedAnswer === answer
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-100 text-gray-700"
                                : selectedAnswer === answer
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        {answer}
                    </button>
                ))}
            </div>

            {showResult && (
                <div className="flex justify-center mb-4">
                    <Button
                        variant="primary"
                        onClick={handleNextQuestion}
                        className="bg-emerald-500 hover:bg-emerald-600"
                    >
                        {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Game"}
                    </Button>
                </div>
            )}

            <div className="mt-auto w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000"
                    style={{width: `${(timeRemaining / 30) * 100}%`}}
                ></div>
            </div>

            <ConfirmationPopup
                isOpen={showConfirmLeave}
                title="Leave Quiz?"
                message="If you leave now, you'll lose your progress and any remaining questions will be marked incorrect. Are you sure?"
                confirmText="Leave Quiz"
                cancelText="Cancel"
                onConfirm={handleConfirmLeave}
                onCancel={handleCancelLeave}
                confirmButtonColor="bg-red-500 hover:bg-red-600"
            />
        </div>
    );
}

export default Quiz;
