import { useEffect, useState } from "react";
const API_URL = '/api/api/fe/wordle-words';

export default function App() {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  const fetchWord = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network error');
      const words = await response.json();
      const randomWord = words[Math.floor(Math.random() * words.length)];
      console.log('SOLUTION:', randomWord.toLowerCase());
      setSolution(randomWord.toLowerCase());
    } catch (error) {
      console.error("Failed to fetch word:", error);
    }
  };

  useEffect(() => {
    fetchWord();
  }, []);

  useEffect(() => {
    const handletype = (event) => {
      if (isGameOver || !solution) {
        return;
      }

      if (event.key === 'Enter') {
        if (currentGuess.length !== 5) {
          return;
        }

        const index = guesses.findIndex(val => val == null);
        const newGuesses = [...guesses];
        newGuesses[index] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess('');

        const isCorrect = solution === currentGuess;
        if (isCorrect) {
          setIsGameOver(true);
          return;
        }

        if (index === 5) {
          setIsGameOver(true);
        }
      }

      if (event.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (currentGuess.length >= 5) {
        return;
      }

      const isLetter = /^[a-zA-Z]$/.test(event.key);
      if (isLetter) {
        setCurrentGuess(oldGuess => oldGuess + event.key.toLowerCase());
      }
    }
    window.addEventListener('keydown', handletype);
    return () => window.removeEventListener('keydown', handletype);
  }, [isGameOver, solution, guesses, currentGuess]);


  const resetGame = () => {
    setIsGameOver(false);
    setGuesses(Array(6).fill(null));
    setCurrentGuess('');
    fetchWord(); 
  };
  
  const hasWon = guesses.includes(solution);
  const hasLost = isGameOver && !hasWon;

  return (
    <div className="App">
      {}
      <div className="emoji-bg-container">
        <span className="emoji-bg-item">🟩</span>
        <span className="emoji-bg-item">🟨</span>
        <span className="emoji-bg-item">⬜</span>
        <span className="emoji-bg-item">🧠</span>
        <span className="emoji-bg-item">💡</span>
        <span className="emoji-bg-item">🧩</span> {}
        <span className="emoji-bg-item">✨</span> {}
        <span className="emoji-bg-item">📚</span> {}
        <span className="emoji-bg-item">🤔</span>
        <span className="emoji-bg-item">🧩</span>
        <span className="emoji-bg-item">🤔</span> 
        <span className="emoji-bg-item">🧠</span> {}
      </div>

      <h1 className="title">Wordle</h1>
      {
        guesses.map((guess, i) => {
          const isCurrentGuess = i === guesses.findIndex(val => val === null);
          return (
            <Line
              key={i}
              guess={isCurrentGuess ? currentGuess : guess ?? ""}
              isFinal={!isCurrentGuess && guess != null}
              solution={solution} />
          );
        })
      }
      {(hasWon || hasLost) && (
        <GameOverModal
          hasWon={hasWon}
          solution={solution}
          resetGame={resetGame}
        />
      )}
    </div>
  )
}

function Line({ guess, isFinal, solution }) {
  const tiles = [];
  for (let i = 0; i < 5; i++) {
    const char = guess[i];
    let className = 'tile';

    if (isFinal) {
      if (char === solution[i]) {
        className += ' correct';
      } else if (solution.includes(char)) {
        className += ' close';
      } else {
        className += ' incorrect';
      }
    } else if (char) {
      className += ' filled';
    }

    tiles.push(<div key={i} className={className}>{char}</div>);
  }
  return (
    <div className="line">
      {tiles}
    </div>
  )
}

function GameOverModal({ hasWon, solution, resetGame }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{hasWon ? 'You Win!' : 'You Lost!'}</h2>
        
        {!hasWon && (
          <p>The correct word was: <strong>{solution.toUpperCase()}</strong></p>
        )}

        <button onClick={resetGame}>Play Again</button>
      </div>
    </div>
  );
}

