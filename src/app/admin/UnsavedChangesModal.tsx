import React, { useEffect } from "react";
import Button from "../../components/Buttons/Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    handleContinue: (save: boolean) => void;
    children?: React.ReactNode;
}

export default function UnsavedChangesModal(props: ModalProps) {

    const { isOpen, onClose, handleContinue, children } = props
    // Close modal on outside click
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const modal = document.getElementById("modal-container");
            if (modal && !modal.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                id="modal-container"
                className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
            >
                {/* Close (X) button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                >
                    &times;
                </button>

                {/* Modal Content */}
                <div className="mt-2 mb-6">{children}</div>

                {/* Footer Buttons */}
                <div className="flex justify-end space-x-2">
                    <Button type="secondary" handleClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="primary" handleClick={() => handleContinue(false)}>
                        Continue without saving
                    </Button>
                    <Button type="primary" handleClick={() => handleContinue(true)}>
                        Save and Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}