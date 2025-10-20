
import React from 'react';
import type { QuizData, FlashcardData, OutputType } from '../types';
import Flashcard from './Flashcard';

interface OutputPanelProps {
  isLoading: boolean;
  outputType: OutputType;
  outputContent: string | QuizData | FlashcardData[] | null;
  mainTopic: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
  </div>
);

const WelcomeMessage: React.FC = () => (
  <div className="text-center text-slate-400 h-full flex flex-col justify-center items-center">
    <div className="text-6xl mb-4">👋</div>
    <h2 className="text-2xl font-bold text-slate-200 mb-2">¡Hola! Soy Adrián.</h2>
    <p>Pega cualquier texto en el panel de la izquierda para empezar.</p>
    <p>Puedo crear resúmenes, quizzes y flashcards para ayudarte a estudiar.</p>
  </div>
);

const SimpleMarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400">$1</strong>') // Bold
    .replace(/^\s*-\s(.*)/gm, '<li class="ml-4 list-disc">$1</li>') // List items
    .replace(/(\r\n|\n|\r)/gm, '<br />'); // Line breaks

  return <div className="prose prose-invert text-slate-300" dangerouslySetInnerHTML={{ __html: html.replace(/<br \/>\s*<li/g, '<li').replace(/(<li.*<\/li>)/gs, '<ul>$1</ul>') }} />;
};

const QuizComponent: React.FC<{ quiz: QuizData }> = ({ quiz }) => {
  const [showAnswers, setShowAnswers] = React.useState(false);
  
  return (
    <div>
      <h3 className="text-xl font-bold text-cyan-400 mb-4">¡Excelente! Aquí tienes tu quiz:</h3>
      <div className="space-y-6">
        {quiz.questions.map((q) => (
          <div key={q.number} className="bg-slate-700/50 p-4 rounded-lg">
            <p className="font-semibold text-slate-200 mb-3">{q.number}. {q.question}</p>
            <ul className="space-y-2">
              {q.options.map((opt, i) => (
                <li key={i} className="text-slate-300">{opt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {showAnswers ? 'Ocultar' : 'Mostrar'} Respuestas
        </button>
        {showAnswers && (
          <div className="mt-4 bg-slate-900/50 p-4 rounded-lg text-left">
            <h4 className="font-bold text-slate-200 mb-2">✅ Respuestas Correctas:</h4>
            <p className="text-slate-300 whitespace-pre-wrap font-mono">{quiz.answers.join('\n')}</p>
          </div>
        )}
      </div>
    </div>
  );
};


const OutputPanel: React.FC<OutputPanelProps> = ({ isLoading, outputType, outputContent, mainTopic }) => {
  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (!outputType || outputType === 'welcome') return <WelcomeMessage />;

    switch (outputType) {
      case 'suggestion':
        return (
          <div className="text-center text-slate-300 h-full flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold text-slate-100 mb-3">¡Texto analizado!</h2>
            <p className="mb-4">Tu texto es sobre <strong className="text-cyan-400">{mainTopic || 'un tema interesante'}</strong>. ¿Qué te gustaría hacer?</p>
            <p>Usa los botones de la izquierda para generar una herramienta de estudio.</p>
          </div>
        );
      case 'summary':
        return (
            <div>
                <h3 className="text-xl font-bold text-cyan-400 mb-4">¡Claro que sí! Aquí tienes tu resumen:</h3>
                <SimpleMarkdownRenderer text={outputContent as string} />
            </div>
        );
      case 'quiz':
        return <QuizComponent quiz={outputContent as QuizData} />;
      case 'flashcards':
        return (
          <div>
            <h3 className="text-xl font-bold text-cyan-400 mb-4">¡Perfecto! Aquí están tus flashcards:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(outputContent as FlashcardData[]).map((card, i) => (
                <Flashcard key={i} card={card} />
              ))}
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="text-center text-red-400 h-full flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold text-red-300 mb-2">¡Oh, no!</h2>
            <p>{outputContent as string}</p>
          </div>
        );
      default:
        return <WelcomeMessage />;
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg h-full min-h-[500px] overflow-y-auto">
      {renderContent()}
    </div>
  );
};

export default OutputPanel;
