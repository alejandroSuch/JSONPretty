import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from './hooks/useDarkMode';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import DiffView from './components/DiffView';
import Footer from './components/Footer';
import { formatJson, validateJson, jsonToYaml } from './utils/json';
import { useBeforeUnload } from './hooks/useBeforeUnload';
import { useFileDrop } from './hooks/useFileDrop';

type Mode = 'editor' | 'diff';

export default function App() {
  const { t } = useTranslation();
  const [dark, toggleDark] = useDarkMode();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('editor');
  const [copied, setCopied] = useState(false);

  useBeforeUnload(input.length > 0);

  // Prevent browser default file open on window drop
  useEffect(() => {
    function preventDrop(e: DragEvent) {
      e.preventDefault();
    }
    window.addEventListener('dragover', preventDrop);
    window.addEventListener('drop', preventDrop);
    return () => {
      window.removeEventListener('dragover', preventDrop);
      window.removeEventListener('drop', preventDrop);
    };
  }, []);

  // Global drop fallback — populate main editor input
  const handleGlobalFileDrop = useCallback((content: string) => {
    setInput(content);
    if (mode === 'diff') setMode('editor');
  }, [mode]);

  const { isDragging: isGlobalDragging, dropError: globalDropError, onDragOver: globalDragOver, onDragLeave: globalDragLeave, onDrop: globalDrop } = useFileDrop(handleGlobalFileDrop);

  function handleFormat() {
    const { output: o, error: e } = formatJson(input);
    setOutput(o);
    setError(e ? (e.line ? t('errorAtLine', { line: e.line, message: e.message }) : t('parseError', { message: e.message })) : '');
  }

  function handleValidate() {
    const { valid, error: e } = validateJson(input);
    setOutput(valid ? t('validJson') : '');
    setError(e ? (e.line ? t('errorAtLine', { line: e.line, message: e.message }) : t('parseError', { message: e.message })) : '');
  }

  function handleToYaml() {
    const { output: o, error: e } = jsonToYaml(input);
    setOutput(o);
    setError(e ? (e.line ? t('errorAtLine', { line: e.line, message: e.message }) : t('parseError', { message: e.message })) : '');
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="h-screen flex flex-col relative bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors overflow-hidden"
      onDragOver={globalDragOver}
      onDragLeave={globalDragLeave}
      onDrop={globalDrop}
    >
      <Header dark={dark} toggleDark={toggleDark} />
      <Toolbar
        mode={mode}
        onFormat={handleFormat}
        onValidate={handleValidate}
        onToYaml={handleToYaml}
        onToggleDiff={() => setMode(mode === 'editor' ? 'diff' : 'editor')}
      />
      <main className="flex-1 min-h-0 p-4 w-full overflow-auto">
        {mode === 'editor' ? (
          <Editor
            input={input}
            output={output}
            error={error}
            copied={copied}
            onInputChange={setInput}
            onCopy={handleCopy}
          />
        ) : (
          <DiffView />
        )}
      </main>
      <Footer />
      {isGlobalDragging && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-indigo-500/5 dark:bg-indigo-400/5 pointer-events-none z-50"
          aria-label={t('dropFileHere')}
        >
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg bg-white/80 dark:bg-gray-900/80 px-6 py-3 rounded-xl shadow-lg">
            {t('dropFileHere')}
          </span>
        </div>
      )}
      {globalDropError && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg shadow">
          {globalDropError}
        </div>
      )}
    </div>
  );
}
