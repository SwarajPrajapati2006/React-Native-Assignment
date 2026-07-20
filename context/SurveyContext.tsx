import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface PhotoData {
  uri: string;
  timestamp: string;
}

export interface ContactData {
  name: string;
  number: string;
}

export interface SurveyDraft {
  siteName: string;
  clientName: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  date: Date;
  photo: PhotoData | null;
  location: LocationData | null;
  contact: ContactData | null;
  notes: string;
}

interface SurveyContextType {
  draft: SurveyDraft;
  updateDraft: (data: Partial<SurveyDraft>) => void;
  resetDraft: () => void;
}

const initialDraft: SurveyDraft = {
  siteName: '',
  clientName: '',
  description: '',
  priority: 'Low',
  date: new Date(),
  photo: null,
  location: null,
  contact: null,
  notes: '',
};

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<SurveyDraft>(initialDraft);

  const updateDraft = (data: Partial<SurveyDraft>) => {
    setDraft((prev) => ({ ...prev, ...data }));
  };

  const resetDraft = () => {
    setDraft({ ...initialDraft, date: new Date() });
  };

  return (
    <SurveyContext.Provider value={{ draft, updateDraft, resetDraft }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}
