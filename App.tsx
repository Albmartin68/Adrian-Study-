
import React, { useState, useCallback, useEffect } from 'react';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import type { QuizData, FlashcardData, Command, OutputType } from './types';
import { analyzeTopic, generateContent } from './services/geminiService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [outputType, setOutputType] = useState<OutputType>('welcome');
  const [outputContent, setOutputContent] = useState<string | QuizData | FlashcardData[] | null>(null);
  const [mainTopic, setMainTopic] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const parseQuiz = (rawText: string): QuizData => {
    const [questionsPart, answersPart] = rawText.split(/---/);
    const questions = [];
    const questionRegex = /(\d+)\.\s(.*?)\na\)\s(.*?)\nb\)\s(.*?)\nc\)\s(.*?)\nd\)\s(.*?)(?=\n\d+\.|\n*$)/gs;

    let match;
    while ((match = questionRegex.exec(questionsPart)) !== null) {
      questions.push({
        number: parseInt(match[1]),
        question: match[2].trim(),
        options: [
          `a) ${match[3].trim()}`,
          `b) ${match[4].trim()}`,
          `c) ${match[5].trim()}`,
          `d) ${match[6].trim()}`,
        ],
      });
    }

    const answers = answersPart
      ? answersPart.replace('**✅ Respuestas Correctas:**', '').trim().split('\n').map(a => a.trim())
      : [];

    return { questions, answers };
  };

  const parseFlashcards = (rawText: string): FlashcardData[] => {
    return rawText.split('---').map(cardText => {
      const frontMatch = cardText.match(/\*\*FRENTE:\*\*\s*(.*)/);
      const backMatch = cardText.match(/\*\*DORSO:\*\*\s*(.*)/);
      return {
        front: frontMatch ? frontMatch[1].trim() : 'Frente no encontrado',
        back: backMatch ? backMatch[1].trim() : 'Dorso no encontrado',
      };
    }).filter(card => card.front !== 'Frente no encontrado');
  };

  const handleCommandExecution = useCallback(async (command: Command, text: string) => {
    if (!text.trim()) {
      setOutputType('error');
      setOutputContent('El texto no puede estar vacío.');
      return;
    }

    setIsLoading(true);
    setOutputType(command);
    setOutputContent(null);
    setMainTopic(null);
    
    try {
      const rawText = await generateContent(text, command);
      if (command === 'quiz') {
        setOutputContent(parseQuiz(rawText));
      } else if (command === 'flashcards') {
        setOutputContent(parseFlashcards(rawText));
      } else {
        setOutputContent(rawText);
      }
    } catch (error) {
      setOutputType('error');
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      setOutputContent(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCommandClick = (command: Command) => {
    handleCommandExecution(command, inputText);
  };

  const handleTextAnalysis = useCallback(async (text: string) => {
      setIsLoading(true);
      try {
        const topic = await analyzeTopic(text);
        setMainTopic(topic);
        setOutputType('suggestion');
        setOutputContent(null);
      } catch (error) {
         setOutputType('error');
         setOutputContent('No se pudo analizar el texto.');
      } finally {
          setIsLoading(false);
      }
  }, []);

  const handleTextChange = (text: string) => {
    setInputText(text);
    if (debounceTimeout) clearTimeout(debounceTimeout);

    if (!text.trim()) {
      setOutputType('welcome');
      setOutputContent(null);
      setMainTopic(null);
      return;
    }

    const newTimeout = setTimeout(() => {
        const commandMatch = text.match(/\/(summary|quiz|flashcards)/);
        const cleanText = text.replace(/\/(summary|quiz|flashcards)/, '').trim();

        if(commandMatch && cleanText.length > 20) {
            handleCommandExecution(commandMatch[1] as Command, cleanText);
        } else if (text.length > 50) {
            handleTextAnalysis(text);
        }
    }, 1200);

    setDebounceTimeout(newTimeout);
  };
    
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
                Adrián <span className="text-slate-300 font-medium">Asistente de Estudio IA</span>
            </h1>
            <p className="text-slate-400 mt-2">Transforma cualquier texto en una herramienta de aprendizaje activo.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputPanel
            inputText={inputText}
            onTextChange={handleTextChange}
            onCommandClick={handleCommandClick}
            isLoading={isLoading}
          />
          <OutputPanel
            isLoading={isLoading}
            outputType={outputType}
            outputContent={outputContent}
            mainTopic={mainTopic}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
