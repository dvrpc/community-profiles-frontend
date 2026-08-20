"use client";

import { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AdminToastContextValue {
  showToast: (message: string, type?: "success" | "error") => void;
  showError: (error: unknown, action: string) => void;
}

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

export function AdminToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    if (type === "error") {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const showError = (error: unknown, action: string) => {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      message = String(error.message);
    } else if (typeof error === "string") {
      message = error;
    }
    showToast(`${action}: ${message}`, "error");
  };

  return (
    <AdminToastContext.Provider value={{ showToast, showError }}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error("useAdminToast must be used inside AdminToastProvider");
  }
  return context;
}
