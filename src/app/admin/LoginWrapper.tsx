import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const SESSION_DURATION_MS = 60 * 60 * 1000;

export default function LoginWrapper(props: Props) {
  const { children } = props;
  const { status } = useSession();
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [suppressAutoSignIn, setSuppressAutoSignIn] = useState(false);
  const [isSigningBackIn, setIsSigningBackIn] = useState(false);
  const handlingExpiry = useRef(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    const timer = window.setTimeout(() => {
      setSuppressAutoSignIn(true);
      setShowExpiryModal(true);
    }, SESSION_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    const handleSessionExpired = () => {
      if (handlingExpiry.current) return;

      handlingExpiry.current = true;
      setSuppressAutoSignIn(true);
      setShowExpiryModal(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("session-expired", handleSessionExpired);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated" && !suppressAutoSignIn) {
      void signIn("google", { callbackUrl: window.location.href });
    }
  }, [status, suppressAutoSignIn]);

  const handleSignOut = async () => {
    setSuppressAutoSignIn(true);
    setShowExpiryModal(false);
    await signOut({ redirect: false });
  };

  const handleSignBackIn = async () => {
    setIsSigningBackIn(true);
    setShowExpiryModal(false);
    // Clear the expired session before starting OAuth so the next request
    // cannot use the previous ID token while sign-in is completing.
    await signOut({ redirect: false });
    setSuppressAutoSignIn(false);
    handlingExpiry.current = false;
    await signIn("google", { callbackUrl: window.location.href });
  };

  if (status === "loading" || isSigningBackIn) return <div>Loading...</div>;

  if (status !== "authenticated") {
    return (
      <div>
        Sign in required.
        <button
          type="button"
          onClick={() => {
            setSuppressAutoSignIn(false);
            void signIn("google", { callbackUrl: window.location.href });
          }}
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <>
      {children}
      {showExpiryModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-expired-title"
          className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 id="session-expired-title" className="mb-2 text-xl font-semibold">
              Your session has expired
            </h2>
            <p className="mb-6 text-gray-600">
              Sign out or sign back in to continue working.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="rounded border px-4 py-2"
                onClick={() => void handleSignOut()}
              >
                Sign out
              </button>
              <button
                type="button"
                className="rounded bg-dvrpc-blue-3 px-4 py-2 text-white"
                onClick={() => void handleSignBackIn()}
              >
                Sign back in
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
