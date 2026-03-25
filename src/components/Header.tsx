import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'de', label: 'Deutsch' },
  { code: 'cs', label: 'Čeština' },
];

interface Props {
  dark: boolean;
  toggleDark: () => void;
}

export default function Header({ dark, toggleDark }: Props) {
  const { t, i18n } = useTranslation();

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-amber-500">{t('appName')}</h1>
          <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">{t('tagline')}</span>
          <span className="hidden sm:inline text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">{t('privacyBadge')}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={i18n.language.substring(0, 2)}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="text-sm bg-gray-100 dark:bg-slate-700 border-none rounded px-2 py-1 cursor-pointer"
            aria-label={t('language')}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          <button
            onClick={toggleDark}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={t('toggleTheme')}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
