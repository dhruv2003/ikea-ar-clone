"use client";

import { useTheme } from './ThemeProvider';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className={styles.themeToggle}>
      <button 
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className={styles.toggleBtn}
        title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {resolvedTheme === 'dark' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 1V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 21V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M1 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M21 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.7478 21.1181 10.0794 20.7461C8.41097 20.3741 6.88299 19.5345 5.67423 18.3258C4.46546 17.117 3.62594 15.589 3.25391 13.9206C2.88188 12.2522 2.99272 10.5121 3.57346 8.9043C4.1542 7.29651 5.18079 5.88737 6.53321 4.84175C7.88562 3.79614 9.5078 3.15731 11.21 3C10.2134 4.34827 9.73383 6.00945 9.85856 7.68141C9.98328 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0167 16.3186 14.1414C17.9906 14.2662 19.6517 13.7866 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      
      <div className={styles.menu}>
        <button
          className={`${styles.menuItem} ${theme === 'light' ? styles.active : ''}`}
          onClick={() => setTheme('light')}
        >
          <span className={styles.icon}>☀️</span>
          <span>Light</span>
        </button>
        <button
          className={`${styles.menuItem} ${theme === 'dark' ? styles.active : ''}`}
          onClick={() => setTheme('dark')}
        >
          <span className={styles.icon}>🌙</span>
          <span>Dark</span>
        </button>
        <button
          className={`${styles.menuItem} ${theme === 'system' ? styles.active : ''}`}
          onClick={() => setTheme('system')}
        >
          <span className={styles.icon}>💻</span>
          <span>System</span>
        </button>
      </div>
    </div>
  );
}