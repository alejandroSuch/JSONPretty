import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { diffJson } from '../utils/json';

export default function DiffView() {
  const { t } = useTranslation();
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [result, setResult] = useState<ReturnType<typeof diffJson> | null>(null);

  function handleDiff() {
    if (!left.trim() || !right.trim()) return;
    // Format both inputs before diffing so the user sees clean JSON
    try { setLeft(JSON.stringify(JSON.parse(left), null, 2)); } catch { /* leave as-is, diffJson will report error */ }
    try { setRight(JSON.stringify(JSON.parse(right), null, 2)); } catch { /* leave as-is */ }
    setResult(diffJson(left, right));
  }

  const colors = {
    added: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    removed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    changed: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    unchanged: 'text-gray-500 dark:text-gray-400',
  };

  const labels = { added: t('added'), removed: t('removed'), changed: t('changed'), unchanged: t('unchanged') };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <textarea
          value={left}
          onChange={(e) => setLeft(e.target.value)}
          placeholder={t('diffLeftPlaceholder')}
          className="flex-1 min-h-[200px] p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
          spellCheck={false}
        />
        <textarea
          value={right}
          onChange={(e) => setRight(e.target.value)}
          placeholder={t('diffRightPlaceholder')}
          className="flex-1 min-h-[200px] p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
          spellCheck={false}
        />
      </div>
      <button
        onClick={handleDiff}
        className="self-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded font-medium transition-colors"
      >
        {t('diff')}
      </button>
      {result && (
        <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <div className="bg-gray-100 dark:bg-slate-700 px-3 py-2 text-sm font-medium">{t('diffResult')}</div>
          {result.error ? (
            <div className="p-3 text-red-600 dark:text-red-400 text-sm">{result.error}</div>
          ) : result.entries.length === 0 || result.entries.every((e) => e.type === 'unchanged') ? (
            <div className="p-3 text-gray-500 text-sm">{t('noDifferences')}</div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {result.entries.map((entry) => (
                <div key={entry.key} className={`px-3 py-2 text-sm ${colors[entry.type]}`}>
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
          )}
        </div>
      )}
    </div>
  );
}
