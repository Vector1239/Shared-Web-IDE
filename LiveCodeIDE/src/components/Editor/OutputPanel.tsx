interface OutputPanelProps {
  output: string;
  error?: string;
}

export default function OutputPanel({ output, error }: OutputPanelProps) {
  return (
    <div className="h-full bg-gray-800 border-l border-gray-700">
      {/* Output Header */}
      <div className="px-4 py-2 border-b border-gray-700">
        <h2 className="text-sm font-medium text-gray-300">Output</h2>
      </div>

      {/* Output Content */}
      <div className="p-4 h-[calc(100%-2.5rem)] overflow-auto">
        {error ? (
          <pre className="text-red-400 font-mono text-sm whitespace-pre-wrap">
            {error}
          </pre>
        ) : output ? (
          <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
            {output}
          </pre>
        ) : (
          <div className="text-gray-400 text-sm">No output yet</div>
        )}
      </div>
    </div>
  );
} 