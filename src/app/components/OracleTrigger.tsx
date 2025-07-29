import { useState } from "react";
import OracleModal from "./OracleModal";

interface OracleTriggerProps {
  onContactModalOpen: () => void;
}

export default function OracleTrigger({ onContactModalOpen }: OracleTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="oracle-trigger" onClick={() => setIsOpen(true)}>
        𓂀
      </div>
      <OracleModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onContactModalOpen={onContactModalOpen}
      />

      <style jsx>{`
        .oracle-trigger {
          position: fixed;
          bottom: 24px;
          right: 24px;
          font-size: 2.5rem;
          color: #cfc0ff;
          cursor: pointer;
          text-shadow: 0 0 8px rgba(190, 130, 255, 0.6);
          animation: pulse 3s ease-in-out infinite;
          z-index: 9998;
        }

        @keyframes pulse {
          0% {
            text-shadow: 0 0 6px rgba(190, 130, 255, 0.5);
            transform: scale(1);
          }
          50% {
            text-shadow: 0 0 16px rgba(255, 255, 255, 0.8);
            transform: scale(1.08);
          }
          100% {
            text-shadow: 0 0 6px rgba(190, 130, 255, 0.5);
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
} 