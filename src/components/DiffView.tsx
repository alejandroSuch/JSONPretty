import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { diffJson, diffJsonLines } from '../utils/json';

type DiffMode = 'keys' | 'lines';

export default function DiffView() {
  const { t } = useTranslation();
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [mode, setMode] = useState<DiffMode>('lines');
  const [keyResult, setKeyResult] = useState<ReturnType<typeof diffJson> | null>(null);
  const [lineResult, setLineResult] = useState<ReturnType<typeof diffJsonLines> | null>(null);

  function handleDiff() {
    if (!left.trim() || !right.trim()) return;
    // Format both inputs
    try { setLeft(JSON.stringify(JSON.parse(left), null, 2)); } catch { /* diffJson will report */ }
    try { setRight(JSON.stringify(JSON.parse(right), null, 2)); } catch { /* diffJson will report */ }
    setKeyResult(diffJson(left, right));
    setLineResult(diffJsonLines(left, right));
  }

  const keyColors = {
    added: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    removed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    changed: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    unchanged: 'text-gray-500 dark:text-gray-400',
  };

  const lineColors = {
    added: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    removed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    unchanged: 'text-gray-500 dark:text-gray-400',
  };

  const labels = { added: t('added'), removed: t('removed'), changed: t('changed'), unchanged: t('unchanged') };

  const hasResults = keyResult || lineResult;
  const error = mode === 'keys' ? keyResult?.error : lineResult?.error;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <textarea
          value={left}
          onChange={(e) => setLeft(e.target.value)}
          placeholder={t('diffLeftPlaceholder')}
          className="flex-1 min-h-[200px] p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
          spellCheck={false}
        />
        <textarea
          value={right}
          onChange={(e) => setRight(e.target.value)}
          placeholder={t('diffRightPlaceholder')}
          className="flex-1 min-h-[200px] p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleDiff}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded font-medium transition-colors"
        >
          {t('diff')}
        </button>
        <div className="flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden text-xs">
          <button
            onClick={() => setMode('keys')}
            className={`px-3 py-1.5 transition-colors ${
              mode === 'keys'
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {t('diffByKeys')}
          </button>
          <button
            onClick={() => setMode('lines')}
            className={`px-3 py-1.5 transition-colors ${
              mode === 'lines'
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {t('diffByLines')}
          </button>
        </div>
      </div>

      {hasResults && (
        <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <div className="bg-gray-100 dark:bg-slate-700 px-3 py-2 text-sm font-medium flex items-center justify-between">
            <span>{t('diffResult')}</span>
            {mode === 'lines' && lineResult && !lineResult.error && (
              <span className="text-xs font-normal">
                <span className="text-green-600 dark:text-green-400">+{lineResult.added}</span>
                {' · '}
                <span className="text-red-600 dark:text-red-400">-{lineResult.removed}</span>
              </span>
            )}
          </div>

          {error ? (
            <div className="p-3 text-red-600 dark:text-red-400 text-sm">{error}</div>
          ) : mode === 'keys' && keyResult ? (
            keyResult.entries.every((e) => e.type === 'unchanged') ? (
              <div className="p-3 text-gray-500 text-sm">{t('noDifferences')}</div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {keyResult.entries.map((entry) => (
                  <div key={entry.key} className={`px-3 py-2 text-sm ${keyColors[entry.type]}`}>
                    <span className="font-mono font-bold">{entry.key}</span>
                    <span className="ml-2 text-xs opacity-75">[{labels[entry.type]}]</span>
                    {entry.type === 'changed' && (
                      <div className="mt-1 flex flex-col lg:flex-row gap-2 text-xs font-mono">
                        <div className="flex-1 bg-red-50 dark:bg-red-900/20 p-1 rounded">{entry.left}</div>
                        <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-1 rounded">{entry.right}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : mode === 'lines' && lineResult ? (
            lineResult.lines.every((l) => l.type === 'unchanged') ? (
              <div className="p-3 text-gray-500 text-sm">{t('noDifferences')}</div>
            ) : (
              <div className="font-mono text-xs">
                {lineResult.lines.map((l, i) => (
                  <div key={i} className={`px-3 py-0.5 ${lineColors[l.type]}`}>
                    {l.type === 'added' ? '+' : l.type === 'removed' ? '-' : ' '} {l.line}
                  </div>
                ))}
              </div>
            )
          ) : null}
        </div>
      )}
    </div>
  );
}
