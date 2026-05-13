import { RouterProvider } from "react-router";
import { router } from "./routes";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
