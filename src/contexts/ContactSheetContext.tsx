import { createContext, useContext, useState, ReactNode } from "react";
import { ContactSheet } from "@/components/ContactSheet";

interface ContactSheetContextType {
  openContactSheet: () => void;
  closeContactSheet: () => void;
}

const ContactSheetContext = createContext<ContactSheetContextType | undefined>(undefined);

export function ContactSheetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openContactSheet = () => setIsOpen(true);
  const closeContactSheet = () => setIsOpen(false);

  return (
    <ContactSheetContext.Provider value={{ openContactSheet, closeContactSheet }}>
      {children}
      <ContactSheet open={isOpen} onOpenChange={setIsOpen} />
    </ContactSheetContext.Provider>
  );
}

export function useContactSheet() {
  const context = useContext(ContactSheetContext);
  if (context === undefined) {
    throw new Error("useContactSheet must be used within a ContactSheetProvider");
  }
  return context;
}
