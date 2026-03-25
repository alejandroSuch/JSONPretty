import { useTranslation } from 'react-i18next';

interface Props {
  mode: 'editor' | 'diff';
  onFormat: () => void;
  onValidate: () => void;
  onToYaml: () => void;
  onToggleDiff: () => void;
}

export default function Toolbar({ mode, onFormat, onValidate, onToYaml, onToggleDiff }: Props) {
  const { t } = useTranslation();

  const btn = 'px-3 py-1.5 text-sm font-medium rounded transition-colors';
  const primary = `${btn} bg-amber-500 hover:bg-amber-600 text-white`;
  const secondary = `${btn} bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200`;
  const active = `${btn} bg-amber-600 text-white ring-2 ring-amber-400`;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50 px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
        <button onClick={onFormat} className={primary} disabled={mode === 'diff'} aria-label={t('format')}>{t('format')}</button>
        <button onClick={onValidate} className={secondary} disabled={mode === 'diff'} aria-label={t('validate')}>{t('validate')}</button>
        <button onClick={onToYaml} className={secondary} disabled={mode === 'diff'} aria-label={t('toYaml')}>{t('toYaml')}</button>
        <button onClick={onToggleDiff} className={mode === 'diff' ? active : secondary} aria-label={t('diff')}>{t('diff')}</button>
      </div>
    </div>
  );
}
