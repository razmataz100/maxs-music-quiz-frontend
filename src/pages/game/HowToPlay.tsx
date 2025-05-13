import { useNavigate } from 'react-router-dom';

function HowToPlay() {
    const navigate = useNavigate();

    return (
        <div className="relative p-8 bg-white border border-gray-200 shadow-md w-full max-w-4xl mx-auto mt-8 rounded-lg">
            <div className="relative flex justify-center items-center mb-6">
                <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 pr-10">How to Play</h1>
                <button
                    onClick={() => navigate('/home')}
                    className="absolute right-0 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="ml-1 hidden sm:inline">Back</span>
                </button>
            </div>

            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-semibold text-indigo-600 mb-2">Getting Started</h2>
                    <p className="text-gray-700">
                        Max's Music Quiz tests your knowledge of songs and artists. Select a quiz from the home screen to begin playing.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-indigo-600 mb-2">Gameplay</h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Each quiz consists of multiple questions about music.</li>
                        <li>For each question, you'll hear a song clip from Spotify.</li>
                        <li>Select the correct answer from the four options provided.</li>
                        <li>You have 30 seconds to answer each question.</li>
                        <li>After selecting an answer, you'll see if you were correct and learn more about the song.</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-indigo-600 mb-2">Scoring</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>You earn 1 point for each correct answer.</li>
                        <li>No points are deducted for incorrect answers.</li>
                        <li>Your score is displayed at the top of the screen during the quiz.</li>
                        <li>After completing a quiz, your score is saved to your profile.</li>
                        <li>Check the leaderboard to see how you rank against other players!</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-indigo-600 mb-2">Tips</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Listen carefully to the song before selecting an answer.</li>
                        <li>Pay attention to vocals, instruments, and lyrics for clues.</li>
                        <li>Play quizzes multiple times to improve your score.</li>
                    </ul>
                </section>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Start Playing!
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HowToPlay;
