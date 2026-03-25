import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <a
          href="https://github.com/alejandroSuch/JSONPretty"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-500 transition-colors"
        >
          {t('viewOnGithub')}
        </a>
        <span>·</span>
        <a
          href="https://buymeacoffee.com/alejandrosuch"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-500 transition-colors"
        >
          {t('buyMeACoffee')}
        </a>
      </div>
    </footer>
  );
}
