"use client";

import { useState, useEffect } from 'react';
import styles from './InstallPrompt.module.css';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installEvent, setInstallEvent] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    
    // Check if already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    if (isAppInstalled) {
      return; // Don't show the prompt if already installed
    }

    // For non-iOS devices, listen for beforeinstallprompt
    if (!isIOSDevice) {
      const handler = (e: Event) => {
        e.preventDefault();
        setInstallEvent(e);
        setShowPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handler);
      
      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    } else {
      // For iOS, we'll show a custom prompt after 5 seconds
      const timer = setTimeout(() => {
        // Only show if user has been engaged (has visited at least 2 pages)
        const pageViews = parseInt(localStorage.getItem('pageViews') || '0') + 1;
        localStorage.setItem('pageViews', pageViews.toString());
        
        if (pageViews >= 2) {
          setShowPrompt(true);
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = async () => {
    if (!isIOS && installEvent) {
      try {
        await installEvent.prompt();
        const choiceResult = await installEvent.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      } catch (e) {
        console.error('Install prompt error:', e);
      }
    }
    
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
    // Remember decision for 7 days
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className={styles.promptOverlay}>
      <div className={styles.promptContainer}>
        <button className={styles.closeButton} onClick={handleClose}>×</button>
        
        <div className={styles.promptHeader}>
          <img 
            src="/icons/icon-192.png" 
            alt="IKEA AR App" 
            className={styles.appIcon} 
          />
          <h3>Install IKEA AR App</h3>
        </div>
        
        <p className={styles.promptText}>
          Add our app to your home screen for a better AR experience!
        </p>
        
        {isIOS ? (
          <div className={styles.iosInstructions}>
            <p>To install:</p>
            <ol>
              <li>Tap <span className={styles.shareIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor" />
                </svg>
              </span> on your browser</li>
              <li>Select "Add to Home Screen"</li>
              <li>Tap "Add" in the top right</li>
            </ol>
          </div>
        ) : (
          <button className={styles.installButton} onClick={handleInstall}>
            Install Now
          </button>
        )}
      </div>
    </div>
  );
}