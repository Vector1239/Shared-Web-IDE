import { javascriptExecutor } from './javascriptExecutor';
import { pythonExecutor } from './pythonExecutor';
import { javaExecutor } from './javaExecutor';
import type { CodeExecutor, ExecutionResult } from './types';
import type { SupportedLanguage } from '../../components/Editor/constants';

class CodeExecutionService {
  private executors: Partial<Record<SupportedLanguage, CodeExecutor>> = {
    javascript: javascriptExecutor,
    python: pythonExecutor,
    java: javaExecutor,
    // We'll add more executors later
  };

  async executeCode(language: SupportedLanguage, code: string): Promise<ExecutionResult> {
    const executor = this.executors[language];
    
    if (!executor) {
      return {
        output: '',
        error: `Execution not supported for ${language} yet`
      };
    }

    return executor.execute(code);
  }
}

export const codeExecutionService = new CodeExecutionService(); 