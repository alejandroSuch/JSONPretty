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

  const theme = dark ? 'dark' : 'light';
  const icon = theme === 'dark' ? '🌙' : '☀️';

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="JSONPretty" className="h-9 w-9" />
          <div>
            <h1 className="text-lg font-semibold text-amber-500 dark:text-amber-400">{t('appName')}</h1>
            <p className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">{t('tagline')}</p>
          </div>
          <span className="hidden rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-400 sm:inline-flex">
            {t('privacyBadge')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={i18n.language.substring(0, 2)}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            aria-label={t('language')}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          <button
            onClick={toggleDark}
            className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={t('toggleTheme')}
          >
            {icon}
          </button>
        </div>
      </div>
    </header>
  );
}
