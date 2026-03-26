import { useTranslation } from 'react-i18next';
import { useFileDrop } from '../hooks/useFileDrop';

interface Props {
  input: string;
  output: string;
  error: string;
  copied: boolean;
  onInputChange: (v: string) => void;
  onCopy: () => void;
}

export default function Editor({ input, output, error, copied, onInputChange, onCopy }: Props) {
  const { t } = useTranslation();
  const { isDragging, dropError, onDragOver, onDragLeave, onDrop } = useFileDrop(onInputChange);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      <div className="flex-1 flex flex-col gap-2">
        <div
          className="relative flex-1"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={t('inputPlaceholder')}
            aria-label={t('inputPlaceholder')}
            className={`flex-1 min-h-[300px] w-full h-full p-3 rounded-lg border bg-white dark:bg-gray-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              isDragging
                ? 'border-indigo-500 dark:border-indigo-400 border-2'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            spellCheck={false}
          />
          {isDragging && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-lg bg-indigo-500/10 dark:bg-indigo-400/10 pointer-events-none"
              aria-label={t('dropFileHere')}
            >
              <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                {t('dropFileHere')}
              </span>
            </div>
          )}
        </div>
        {(error || dropError) && (
          <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {error || dropError}
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="relative flex-1">
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            aria-label={t('outputPlaceholder')}
            className="min-h-[300px] w-full h-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-sm resize-none focus:outline-none"
            spellCheck={false}
          />
          {output && (
            <button
              onClick={onCopy}
              aria-label={t('copy')}
              className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-amber-500 hover:bg-amber-600 text-white transition-colors"
            >
              {copied ? t('copied') : t('copy')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
