export type SupportedLanguage = 'javascript' | 'python' | 'java' | 'cpp';

export const SUPPORTED_LANGUAGES = [
  { id: 'javascript' as SupportedLanguage, name: 'JavaScript' },
  { id: 'python' as SupportedLanguage, name: 'Python' },
  { id: 'java' as SupportedLanguage, name: 'Java' },
  { id: 'cpp' as SupportedLanguage, name: 'C++' }
] as const;

export const DEFAULT_CODE: Record<SupportedLanguage, string> = {
  javascript: '// Start coding in JavaScript...\nconsole.log("Hello World!");',
  python: '# Start coding in Python...\nprint("Hello World!")',
  java: '// Start coding in Java...\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}',
  cpp: '// Start coding in C++...\n#include <iostream>\n\nint main() {\n    std::cout << "Hello World!" << std::endl;\n    return 0;\n}'
}; 