// Validation.tsx
import React, { FC, ReactNode } from 'react';
import "./styles/Validation.css";

interface ValidationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: ReactNode;
  bg_modal_show: string
  style_pers_confirm: string;
  style_pers_cancel: string;
}

const Validation: FC<ValidationProps> = ({ isOpen, onConfirm, onCancel, message, bg_modal_show, style_pers_confirm, style_pers_cancel }) => {
  return (
    <>
      {isOpen && (
        <div className={ "validation-dialog " + bg_modal_show }>
          <div className="validation-message">{message}</div>
          <div className="validation-buttons">
            <button onClick={onConfirm} className={"shadow-xl " + style_pers_confirm}>Confirmer</button>
            <button onClick={onCancel} className={"shadow-xl " + style_pers_cancel}>Annuler</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Validation;
