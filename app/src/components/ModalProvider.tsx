// ModalContext.tsx
import { useState, useCallback,type ReactNode } from 'react';
import { ModalContext } from './ModalContext';

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const show = useCallback((content: ReactNode) => setModalContent(content), []);
  const hide = useCallback(() => setModalContent(null), []);

  return (
    <ModalContext.Provider value={{ show, hide }}>
      {children}
      {modalContent && (
        <dialog
          open
          className="modal-backdrop"
          onClick={hide}
          role="dialog"
          aria-modal="true"
        >
          <section
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {modalContent}
          </section>
        </dialog>
      )}
    </ModalContext.Provider>
  );
};