import React, { type ReactNode } from "react";

interface ModalContextType {
  show: (content: ReactNode) => void;
  hide: () => void;
}

export const ModalContext = React.createContext<ModalContextType | undefined>(undefined);