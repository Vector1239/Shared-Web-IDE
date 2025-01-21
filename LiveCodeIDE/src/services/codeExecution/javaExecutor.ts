import { CodeExecutor, ExecutionResult } from './types';

class JavaExecutor implements CodeExecutor {
  language = 'java' as const;
  private readonly PISTON_API = 'https://emkc.org/api/v2/piston/execute';

  private createJavaClass(code: string): string {
    // If the code already contains a public class, use it as is
    if (code.includes('public class')) {
      return code;
    }

    // Otherwise, wrap the code in a Main class
    return `
public class Main {
    public static void main(String[] args) {
        ${code}
    }
}`;
  }

  async execute(code: string): Promise<ExecutionResult> {
    try {
      const javaCode = this.createJavaClass(code);

      const response = await fetch(this.PISTON_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'java',
          version: '15.0.2',  // You can update this version as needed
          files: [{
            content: javaCode
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to execute Java code: ' + response.statusText);
      }

      const result = await response.json();
      
      // Piston API returns compile errors in result.compile.stderr
      // and runtime errors in result.run.stderr
      const error = result.compile?.stderr || result.run?.stderr;
      
      if (error) {
        return {
          output: '',
          error: error
        };
      }

      return {
        output: result.run?.stdout || ''
      };
    } catch (err) {
      return {
        output: '',
        error: err instanceof Error ? err.message : String(err)
      };
    }
  }
}

export const javaExecutor = new JavaExecutor();