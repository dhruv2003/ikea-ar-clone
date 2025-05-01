"use client";

import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import ThemeToggle from './ThemeToggle';
import dynamic from 'next/dynamic';

// Dynamically import the InstallPrompt component with no SSR
const InstallPrompt = dynamic(() => import("./InstallPrompt"), { ssr: false });

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="app-container">
        <div className="theme-toggle-container" style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          zIndex: 1000,
          pointerEvents: 'none', /* Make container transparent to clicks */
        }}>
          <div style={{ pointerEvents: 'auto' }}> {/* Re-enable pointer events for the toggle */}
            <ThemeToggle />
          </div>
        </div>
        <main className="main-content">
          {children}
        </main>
        <InstallPrompt />
      </div>
    </ThemeProvider>
  );
}