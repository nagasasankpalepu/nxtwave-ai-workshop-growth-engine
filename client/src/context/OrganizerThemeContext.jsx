import React, { createContext, useContext, useState, useEffect } from 'react';

const OrganizerThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  sidebarCollapsed: false,
  toggleSidebar: () => {}
});

export function OrganizerThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('nxtwave_organizer_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('nxtwave_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nxtwave_organizer_theme', theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('nxtwave_sidebar_collapsed', sidebarCollapsed ? 'true' : 'false');
    } catch (e) {}
  }, [sidebarCollapsed]);

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <OrganizerThemeContext.Provider value={{ theme, isDark, toggleTheme, sidebarCollapsed, toggleSidebar }}>
      {children}
    </OrganizerThemeContext.Provider>
  );
}

export function useOrganizerTheme() {
  return useContext(OrganizerThemeContext);
}
