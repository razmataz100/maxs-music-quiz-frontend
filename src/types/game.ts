export interface GameWithHighScore {
    gameId: number;
    theme: string;
    highScore?: number;
    highScoreUsername?: string;
    userHighScore?: number;
    questionsAnswered?: number;
    correctAnswers?: number;
}

export interface CreateGameRequest {
    theme: string;
    playlistUrl: string;
}
