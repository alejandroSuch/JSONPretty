import { useTranslation } from 'react-i18next';

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

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      <div className="flex-1 flex flex-col gap-2">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={t('inputPlaceholder')}
          className="flex-1 min-h-[300px] w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
          spellCheck={false}
        />
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="relative flex-1">
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="min-h-[300px] w-full h-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800/50 text-sm resize-none focus:outline-none"
            spellCheck={false}
          />
          {output && (
            <button
              onClick={onCopy}
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
