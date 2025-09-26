// components/modals/ConfirmationModal.tsx
import { X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionName: string; // e.g., "delete your account", "logout", "spend currency"
  description?: string; // optional additional description
  confirmButtonText?: string; // defaults to "Confirm"
  cancelButtonText?: string;  // defaults to "Cancel"
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  actionName,
  description,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-gray-800 justify-center text-center">
          Are you sure you want to {actionName}?
        </h2>

        {/* Optional Description */}
        {description && <p className="mt-2 text-gray-600 text-center">{description}</p>}

        {/* Action Buttons */}
        <div className="mt-6 flex-grow flex flex-row items-center justify-center gap-5">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
