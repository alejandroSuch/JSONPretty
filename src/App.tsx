import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from './hooks/useDarkMode';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import DiffView from './components/DiffView';
import Footer from './components/Footer';
import { formatJson, validateJson, jsonToYaml } from './utils/json';
import { useBeforeUnload } from './hooks/useBeforeUnload';

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
    <div className="min-h-screen flex flex-col">
      <Header dark={dark} toggleDark={toggleDark} />
      <Toolbar
        mode={mode}
        onFormat={handleFormat}
        onValidate={handleValidate}
        onToYaml={handleToYaml}
        onToggleDiff={() => setMode(mode === 'editor' ? 'diff' : 'editor')}
      />
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
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
    </div>
  );
}
