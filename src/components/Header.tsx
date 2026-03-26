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
            className="appearance-none rounded-md border border-gray-300 bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.35rem_center] bg-no-repeat pl-2 pr-7 py-1 text-xs text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
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
