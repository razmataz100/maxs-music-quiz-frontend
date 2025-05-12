export interface GameWithHighScore {
    gameId: number;
    theme: string;
    highScore?: number;
    highScoreUsername?: string;
    highScoreProfilePictureUrl?: string;
    userHighScore?: number;
    questionsAnswered?: number;
    correctAnswers?: number;
}

export interface CreateGameRequest {
    theme: string;
    playlistUrl: string;
}

export interface QuizQuestion {
    id: number;
    questionText: string;
    songName: string;
    artistName: string;
    spotifyTrackId: string;
    answerChoices: string[];
    correctAnswer: string;
    quizGameId: number;
}
