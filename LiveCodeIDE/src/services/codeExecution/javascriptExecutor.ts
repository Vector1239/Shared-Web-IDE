import { CodeExecutor, ExecutionResult } from './types';

class JavaScriptExecutor implements CodeExecutor {
  language = 'javascript' as const;

  async execute(code: string): Promise<ExecutionResult> {
    let output = '';
    let error: string | undefined;

    // Create a sandbox environment with browser-like globals
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          output += args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ') + '\n';
        },
        error: (...args: any[]) => {
          output += args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ') + '\n';
        },
        warn: (...args: any[]) => {
          output += args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ') + '\n';
        },
      },
      // Browser-like environment
      window: {
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      },
      document: {
        createElement: () => ({}),
        addEventListener: () => {},
        removeEventListener: () => {},
      },
      // Node.js-like environment
      process: {
        env: {
          NODE_ENV: 'development'
        }
      },
      // Timer functions
      setTimeout: (cb: Function, ms: number) => setTimeout(cb, Math.min(ms, 5000)), // Limit timeout to 5s
      setInterval: (cb: Function, ms: number) => setInterval(cb, Math.min(ms, 1000)), // Limit interval to 1s
      clearTimeout,
      clearInterval,
      // Common globals
      undefined,
      Object,
      Array,
      String,
      Number,
      Boolean,
      Date,
      Math,
      JSON,
      Error,
      RegExp,
      Promise,
    };

    try {
      // Wrap code in an async function to allow await usage
      const wrappedCode = `
        (async function() {
          try {
            ${code}
          } catch (e) {
            throw e;
          }
        })()
      `;

      // Create a function with sandboxed context
      const fn = new Function(...Object.keys(sandbox), wrappedCode);
      
      // Execute the code with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Execution timeout (5s)')), 5000);
      });

      await Promise.race([
        fn(...Object.values(sandbox)),
        timeoutPromise
      ]);

      return { output: output.trim() };
    } catch (e) {
      error = e instanceof Error ? e.message : 'An error occurred';
      return { output: output.trim(), error };
    }
  }
}

export const javascriptExecutor = new JavaScriptExecutor(); 