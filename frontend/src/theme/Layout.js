import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import { AuthProvider } from '../contexts/AuthContext';
import TranslationProvider from '../contexts/TranslationContext';

export default function Layout(props) {
  return (
    <TranslationProvider>
      <AuthProvider>
        <OriginalLayout {...props} />
      </AuthProvider>
    </TranslationProvider>
  );
}