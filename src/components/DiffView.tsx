import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { diffJson, diffJsonLines } from '../utils/json';
import { useFileDrop } from '../hooks/useFileDrop';

type DiffMode = 'keys' | 'lines';

function DiffTextarea({
  value,
  onChange,
  placeholder,
  ariaLabel,
  borderColor,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  ariaLabel: string;
  borderColor: 'indigo' | 'amber';
}) {
  const { t } = useTranslation();
  const { isDragging, dropError, onDragOver, onDragLeave, onDrop } = useFileDrop(onChange);

  const dragBorder = borderColor === 'indigo'
    ? 'border-indigo-500 dark:border-indigo-400 border-2'
    : 'border-amber-500 dark:border-amber-400 border-2';

  const overlayBg = borderColor === 'indigo'
    ? 'bg-indigo-500/10 dark:bg-indigo-400/10'
    : 'bg-amber-500/10 dark:bg-amber-400/10';

  const overlayText = borderColor === 'indigo'
    ? 'text-indigo-600 dark:text-indigo-400'
    : 'text-amber-600 dark:text-amber-400';

  return (
    <div className="flex-1 flex flex-col gap-1">
      <div
        className="relative flex-1"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={`flex-1 min-h-[200px] w-full h-full p-3 rounded-lg border bg-white dark:bg-gray-800 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            isDragging ? dragBorder : 'border-gray-300 dark:border-gray-600'
          }`}
          spellCheck={false}
        />
        {isDragging && (
          <div
            className={`absolute inset-0 flex items-center justify-center rounded-lg ${overlayBg} pointer-events-none`}
            aria-label={t('dropFileHere')}
          >
            <span className={`${overlayText} font-medium text-sm`}>
              {t('dropFileHere')}
            </span>
          </div>
        )}
      </div>
      {dropError && (
        <div className="text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/20 p-1.5 rounded">
          {dropError}
        </div>
      )}
    </div>
  );
}

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
        <DiffTextarea
          value={left}
          onChange={setLeft}
          placeholder={t('diffLeftPlaceholder')}
          ariaLabel={t('diffLeftPlaceholder')}
          borderColor="indigo"
        />
        <DiffTextarea
          value={right}
          onChange={setRight}
          placeholder={t('diffRightPlaceholder')}
          ariaLabel={t('diffRightPlaceholder')}
          borderColor="amber"
        />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleDiff}
          aria-label={t('diff')}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded font-medium transition-colors"
        >
          {t('diff')}
        </button>
        <div className="flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden text-xs">
          <button
            onClick={() => setMode('keys')}
            aria-label={t('diffByKeys')}
            className={`px-3 py-1.5 transition-colors ${
              mode === 'keys'
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {t('diffByKeys')}
          </button>
          <button
            onClick={() => setMode('lines')}
            aria-label={t('diffByLines')}
            className={`px-3 py-1.5 transition-colors ${
              mode === 'lines'
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {t('diffByLines')}
          </button>
        </div>
      </div>

      {hasResults && (
        <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-medium flex items-center justify-between">
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
            <div className="p-3 text-red-600 dark:text-red-400 text-sm">{t(error)}</div>
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
