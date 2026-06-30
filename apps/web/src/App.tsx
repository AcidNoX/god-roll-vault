import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/AuthProvider.js";
import { ProtectedRoute } from "./components/ProtectedRoute.js";
import { AuthCallbackPage } from "./pages/AuthCallbackPage.js";
import { CharacterSelectorPage } from "./pages/CharacterSelectorPage.js";
import { HomePage } from "./pages/HomePage.js";
import { InventoryPage } from "./pages/InventoryPage.js";
import { LoginPage } from "./pages/LoginPage.js";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<AuthCallbackPage />} path="/auth/callback" />
        <Route
          element={
            <ProtectedRoute>
              <CharacterSelectorPage />
            </ProtectedRoute>
          }
          path="/characters"
        />
        <Route
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          }
          path="/inventory"
        />
      </Routes>
    </AuthProvider>
  );
}
