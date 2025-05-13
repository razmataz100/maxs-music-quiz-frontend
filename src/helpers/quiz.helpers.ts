export const getAnswerButtonStyles = (
    answer: string,
    correctAnswer: string,
    selectedAnswer: string | null,
    showResult: boolean
): string => {
    const baseStyles = "p-3 rounded-lg text-base sm:text-lg font-medium transition-colors h-auto cursor-pointer";

    if (showResult) {
        if (answer === correctAnswer) return `${baseStyles} bg-green-500 text-white`;
        if (selectedAnswer === answer) return `${baseStyles} bg-red-500 text-white`;
        return `${baseStyles} bg-gray-100 text-gray-700`;
    }

    if (selectedAnswer === answer) return `${baseStyles} bg-indigo-600 text-white`;
    return `${baseStyles} bg-gray-100 hover:bg-gray-200 text-gray-700`;
};
