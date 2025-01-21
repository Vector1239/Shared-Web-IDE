import { type SupportedLanguage } from '../../components/Editor/constants';

export interface ExecutionResult {
  output: string;
  error?: string;
}

export interface CodeExecutor {
  execute(code: string): Promise<ExecutionResult>;
  language: SupportedLanguage;
} 