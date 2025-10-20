
import React, { useState } from 'react';
import type { FlashcardData } from '../types';

interface FlashcardProps {
  card: FlashcardData;
}

const Flashcard: React.FC<FlashcardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full h-48 perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden bg-slate-700 rounded-lg p-4 flex flex-col justify-center items-center text-center shadow-lg border border-slate-600">
          <p className="text-sm text-cyan-400 font-semibold mb-2">FRENTE</p>
          <p className="text-slate-100">{card.front}</p>
        </div>
        
        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden bg-sky-800 rounded-lg p-4 flex flex-col justify-center items-center text-center shadow-lg border border-sky-700 rotate-y-180">
           <p className="text-sm text-sky-300 font-semibold mb-2">DORSO</p>
          <p className="text-slate-50">{card.back}</p>
        </div>
      </div>
    </div>
  );
};

// Custom CSS for 3D transforms - Tailwind doesn't have these utilities by default
const style = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .rotate-y-180 { transform: rotateY(180deg); }
  .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
`;

// Inject styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = style;
document.head.appendChild(styleSheet);


export default Flashcard;
