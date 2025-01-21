import { useState, useRef, useCallback, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Toolbar from './Toolbar';
import OutputPanel from './OutputPanel';
import { DEFAULT_CODE, type SupportedLanguage } from './constants';
import { codeExecutionService } from '../../services/codeExecution';

export default function Editor() {
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [code, setCode] = useState(DEFAULT_CODE[language]);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string>();
  const [splitPosition, setSplitPosition] = useState(60); // percentage
  const [isExecuting, setIsExecuting] = useState(false);
  const isDragging = useRef(false);
  const editorRef = useRef<any>(null);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  function handleLanguageChange(newLanguage: SupportedLanguage) {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage]);
    // Clear output when changing languages
    setOutput('');
    setError(undefined);
  }

  // Handle mouse down on the divider
  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    // Disable text selection while dragging
    document.body.style.userSelect = 'none';
  }, []);

  // Handle mouse move for resizing
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    const container = document.getElementById('split-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Limit the split position between 20% and 80%
    const limitedPosition = Math.min(Math.max(newPosition, 20), 80);
    setSplitPosition(limitedPosition);
  }, []);

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  async function handleRunCode() {
    if (isExecuting) return;

    setIsExecuting(true);
    setError(undefined);
    setOutput('Running...');

    try {
      const result = await codeExecutionService.executeCode(language, code);
      setOutput(result.output);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsExecuting(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Toolbar 
        language={language}
        onLanguageChange={handleLanguageChange}
        onRun={handleRunCode}
        isExecuting={isExecuting}
      />
      
      <div id="split-container" className="flex-1 flex">
        {/* Editor Panel */}
        <div style={{ width: `${splitPosition}%` }} className="border-r border-gray-700">
          <MonacoEditor
            height="100%"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={(value: string | undefined) => setCode(value ?? code)}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              cursorStyle: 'line',
            }}
          />
        </div>

        {/* Draggable Divider */}
        <div
          className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Output Panel */}
        <div style={{ width: `${100 - splitPosition}%` }}>
          <OutputPanel output={output} error={error} />
        </div>
      </div>
    </div>
  );
} 