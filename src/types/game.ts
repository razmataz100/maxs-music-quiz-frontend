export interface GameWithHighScore {
    gameId: number;
    theme: string;
    questionsAnswered?: number;
    correctAnswers?: number;
    username?: string;
    highScore?: number;
    highScoreUsername?: string;
    highScoreProfilePictureUrl?: string;
    highScoreDate?: string;
    userHighScoreDate?: string;
    userBestScore?: number;
    userBestScoreQuestions?: number;
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

export interface GameHistory {
    gameId: number;
    theme: string;
    playedAt: string;
    score: number;
    totalQuestions: number;
    username: string;
    isCurrentUser: boolean;
    profilePictureUrl?: string;
}
