import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { endGame, startGame } from "../httpUtils/game.ts";
import { API_BASE_URL } from "../config/apiConfig.ts";

interface QuizQuestion {
    id: number;
    questionText: string;
    songName: string;
    artistName: string;
    spotifyTrackId: string;
    answerChoices: string[];
    correctAnswer: string;
    quizGameId: number;
}

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

    useEffect(() => {
        const initializeGame = async () => {
            try {
                const authToken = localStorage.getItem("authToken");
                if (!authToken || !gameId) return;

                await startGame(Number(gameId), authToken);

                const response = await fetch(`${API_BASE_URL}/game/${gameId}/start-game`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch questions");
                }

                const data: QuizQuestion[] = await response.json();
                setQuestions(data);
                setLoading(false);
            } catch (error) {
                console.error("Error initializing the game:", error);
                setLoading(false);
            }
        };

        initializeGame();
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

    if (loading) {
        return (
            <div className="p-8 bg-white border border-gray-300 shadow-md w-full max-w-4xl mx-auto text-center">
                <h2 className="text-xl mb-6">Loading Quiz Questions...</h2>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
        );
    }

    if (gameOver) {
        return (
            <div className="p-8 bg-white border border-gray-300 shadow-md w-full max-w-4xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
                <p className="text-xl mb-4">Your final score: {correctAnswers}/{questions.length}</p>
                <button
                    onClick={() => navigate("/profile")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                >
                    Back to Profile
                </button>
            </div>
        );
    }

    if (!questions.length) {
        return (
            <div className="p-8 bg-white border border-gray-300 shadow-md w-full max-w-4xl mx-auto text-center">
                <h2 className="text-xl mb-6">No questions found for this game</h2>
                <button
                    onClick={() => navigate("/profile")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Back to Profile
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="p-8 bg-white border border-gray-300 shadow-md w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="text-xl font-bold">Score: {correctAnswers}</div>
                <div className="text-xl font-bold text-blue-600">
                    Time: {timeRemaining}s
                </div>
                <div className="text-xl font-bold">
                    Question {currentQuestionIndex + 1}/{questions.length}
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 flex justify-center">{currentQuestion.questionText}</h2>

            <div className="flex justify-center">
                <div className="relative w-3/4 mb-6">
                    <iframe
                        key={playerKey}
                        src={`https://open.spotify.com/embed/track/${currentQuestion.spotifyTrackId}?utm_source=generator&theme=0&autoplay=1`}
                        loading="lazy"
                        className="w-full h-20"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                {currentQuestion.answerChoices.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerSelect(answer)}
                        disabled={showResult}
                        className={`p-4 rounded-lg text-lg font-medium transition-colors ${
                            showResult
                                ? answer === currentQuestion.correctAnswer
                                    ? "bg-green-500 text-white"
                                    : selectedAnswer === answer
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-200"
                                : selectedAnswer === answer
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    >
                        {answer}
                    </button>
                ))}
            </div>

            {showResult && (
                <div className="mb-6 p-4 rounded-lg bg-gray-100">
                    <h3 className="text-xl font-bold mb-2">
                        {selectedAnswer === currentQuestion.correctAnswer
                            ? "Correct! 🎉"
                            : "Wrong! 😢"}
                    </h3>
                    <p className="mb-1">
                        <span className="font-bold">Song:</span> {currentQuestion.songName}
                    </p>
                    <p>
                        <span className="font-bold">Artist:</span> {currentQuestion.artistName}
                    </p>
                    <p className="mt-2">
                        <span className="font-bold">Correct Answer:</span> {currentQuestion.correctAnswer}
                    </p>
                </div>
            )}

            {showResult && (
                <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                >
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Game"}
                </button>
            )}

            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
                    style={{width: `${(timeRemaining / 30) * 100}%`}}
                ></div>
            </div>
        </div>
    );
}

export default Quiz;
