'use client';

import { SessionProvider } from 'next-auth/react';
import { AppointmentProvider } from './context/AppointmentContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppointmentProvider>
        {children}
      </AppointmentProvider>
    </SessionProvider>
  );
} 