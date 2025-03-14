'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Função para verificar se duas datas são o mesmo dia
export const isSameDay = (date1: Date, date2: Date) => {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    console.error('Data inválida recebida:', { date1, date2 });
    return false;
  }
  return (
    date1.getUTCDate() === date2.getUTCDate() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCFullYear() === date2.getUTCFullYear()
  )
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Appointment {
  id: string;
  date: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  status: string;
  notes?: string;
  service: Service;
}

interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  vehicle: string;
  message?: string;
}

interface AppointmentContextType {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  appointmentData: AppointmentData | null;
  setAppointmentData: (data: AppointmentData | null) => void;
  clearAppointmentData: () => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);

  const clearAppointmentData = () => {
    setAppointmentData(null);
    setSelectedDate(null);
    setSelectedService(null);
  };

  return (
    <AppointmentContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        selectedService,
        setSelectedService,
        appointments,
        setAppointments,
        appointmentData,
        setAppointmentData,
        clearAppointmentData,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
}

// Simulação de banco de dados (em um cenário real, seria uma API)
const saveToDatabase = async (appointment: Appointment) => {
  try {
    console.log('Salvando no banco de dados:', appointment);
    
    const existingData = localStorage.getItem('appointmentsDatabase') || '[]';
    const database = JSON.parse(existingData);
    
    // A data já é uma string, não precisa converter
    const appointmentToSave = {
      ...appointment
    };
    
    database.push(appointmentToSave);
    localStorage.setItem('appointmentsDatabase', JSON.stringify(database));
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar no banco de dados:', error);
    return false;
  }
}

const removeFromDatabase = async (id: number) => {
  try {
    // Em um cenário real, aqui seria uma chamada à API para remover do banco de dados
    console.log('Removendo do banco de dados, ID:', id);
    
    // Simulando uma chamada de API com localStorage
    const existingData = localStorage.getItem('appointmentsDatabase') || '[]';
    const database = JSON.parse(existingData);
    const updatedDatabase = database.filter((app: any) => app.id !== id);
    localStorage.setItem('appointmentsDatabase', JSON.stringify(updatedDatabase));
    
    return true;
  } catch (error) {
    console.error('Erro ao remover do banco de dados:', error);
    return false;
  }
} 