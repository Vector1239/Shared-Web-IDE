import { SUPPORTED_LANGUAGES, type SupportedLanguage } from './constants';

interface ToolbarProps {
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  onRun: () => void;
  isExecuting: boolean;
}

export default function Toolbar({ language, onLanguageChange, onRun, isExecuting }: ToolbarProps) {
  return (
    <div className="bg-gray-800 p-3 flex items-center space-x-4">
      <select 
        className="bg-gray-700 text-white px-3 py-1.5 rounded hover:bg-gray-600 transition-colors"
        value={language}
        onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
        disabled={isExecuting}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>

      <button 
        onClick={onRun}
        disabled={isExecuting}
        className={`px-4 py-1.5 rounded transition-colors ${
          isExecuting 
            ? 'bg-green-700 text-gray-300 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {isExecuting ? 'Running...' : 'Run'}
      </button>
    </div>
  );
} 