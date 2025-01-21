import { CodeExecutor, ExecutionResult } from './types';

// Define the Pyodide type
declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<any>;
  }
}

class PythonExecutor implements CodeExecutor {
  language = 'python' as const;
  private pyodideInstance: any = null;
  private pyodideLoading: Promise<any> | null = null;

  private async loadPyodideScript(): Promise<void> {
    if (!document.querySelector('script[src*="pyodide.js"]')) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Pyodide'));
        document.head.appendChild(script);
      });
    }
  }

  private async initializePyodide() {
    if (this.pyodideInstance) {
      return this.pyodideInstance;
    }

    if (this.pyodideLoading) {
      return this.pyodideLoading;
    }

    this.pyodideLoading = (async () => {
      try {
        await this.loadPyodideScript();
        this.pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
        });
        return this.pyodideInstance;
      } finally {
        this.pyodideLoading = null;
      }
    })();

    return this.pyodideLoading;
  }

  async execute(code: string): Promise<ExecutionResult> {
    try {
      const pyodide = await this.initializePyodide();
      
      // Redirect stdout to capture print statements
      pyodide.runPython(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);

      // Execute the code
      await pyodide.runPythonAsync(code);
      
      // Get the captured output
      const output = pyodide.runPython('sys.stdout.getvalue()');
      
      // Reset stdout
      pyodide.runPython('sys.stdout = sys.__stdout__');

      return {
        output: output || ''
      };
    } catch (err) {
      return {
        output: '',
        error: err instanceof Error ? err.message : String(err)
      };
    }
  }
}

export const pythonExecutor = new PythonExecutor(); 