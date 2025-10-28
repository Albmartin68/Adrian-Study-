import React, { useRef } from 'react';
import type { Command } from '../types';

interface InputPanelProps {
  inputText: string;
  onTextChange: (text: string) => void;
  onCommandClick: (command: Command) => void;
  isLoading: boolean;
  onFileUploadError: (message: string) => void;
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

const InputPanel: React.FC<InputPanelProps> = ({ inputText, onTextChange, onCommandClick, isLoading, onFileUploadError }) => {
  const isButtonDisabled = !inputText.trim() || isLoading;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const reader = new FileReader();

    reader.onload = (e) => {
      let text = e.target?.result as string;
      // For HTML, parse it and extract text content to avoid rendering tags in the textarea
      if (extension === 'html') {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');
          text = doc.body.textContent || "";
      }
      onTextChange(text);
    };

    reader.onerror = (e) => {
        console.error("Error reading file", e);
        onFileUploadError("No se pudo leer el archivo.");
    }
    
    const supportedTextFormats = ['txt', 'md', 'html'];
    const unsupportedFormats = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];

    if (supportedTextFormats.includes(extension)) {
      reader.readAsText(file);
    } else if (unsupportedFormats.includes(extension)) {
      onFileUploadError(`El formato .${extension} requiere procesamiento especial. Por ahora, solo puedes copiar y pegar el texto del archivo manualmente.`);
    } else {
      onFileUploadError(`El formato de archivo .${extension} no es compatible.`);
    }

    // Reset the input value to allow re-uploading the same file
    if(event.target) {
        event.target.value = '';
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-100">Tu Texto de Estudio</h2>
        <button
            onClick={handleUploadClick}
            disabled={isLoading}
            className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 flex items-center justify-center space-x-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>Subir Archivo</span>
        </button>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.md,.html,.pdf,.doc,.docx,.xls,.xlsx"
        />
      </div>
      <p className="text-slate-400 mb-4 -mt-2 text-sm">Soporte para <code className="bg-slate-700 text-cyan-400 px-1 rounded">.txt</code>, <code className="bg-slate-700 text-cyan-400 px-1 rounded">.md</code> y <code className="bg-slate-700 text-cyan-400 px-1 rounded">.html</code>. La lectura de PDF y otros formatos llegará pronto.</p>

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