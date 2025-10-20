
import React from 'react';
import type { Command } from '../types';

interface InputPanelProps {
  inputText: string;
  onTextChange: (text: string) => void;
  onCommandClick: (command: Command) => void;
  isLoading: boolean;
}

const CommandButton: React.FC<{ command: Command, onClick: (cmd: Command) => void, disabled: boolean, children: React.ReactNode }> = ({ command, onClick, disabled, children }) => (
    <button
        onClick={() => onClick(command)}
        disabled={disabled}
        className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 flex items-center justify-center space-x-2"
    >
        {children}
    </button>
);

const InputPanel: React.FC<InputPanelProps> = ({ inputText, onTextChange, onCommandClick, isLoading }) => {
  const isButtonDisabled = !inputText.trim() || isLoading;
  
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col h-full">
      <h2 className="text-2xl font-bold text-slate-100 mb-4">Tu Texto de Estudio</h2>
      <p className="text-slate-400 mb-4">Pega tu texto aquí. Si incluyes un comando como <code className="bg-slate-700 text-cyan-400 px-1 rounded">/quiz</code>, lo ejecutaré directamente.</p>
      <textarea
        value={inputText}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Escribe o pega tu texto aquí..."
        className="flex-grow w-full bg-slate-700 text-slate-200 p-4 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none resize-none"
        rows={15}
        disabled={isLoading}
      />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <CommandButton command="summary" onClick={onCommandClick} disabled={isButtonDisabled}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
            <span>/resumen</span>
        </CommandButton>
        <CommandButton command="quiz" onClick={onCommandClick} disabled={isButtonDisabled}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            <span>/quiz</span>
        </CommandButton>
        <CommandButton command="flashcards" onClick={onCommandClick} disabled={isButtonDisabled}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm10-1a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V3z" /></svg>
            <span>/flashcards</span>
        </CommandButton>
      </div>
    </div>
  );
};

export default InputPanel;
