"use client";

import { AuthProvider } from "@/src/core/providers/auth-provider/AuthProvider";

const AdminPage = () => {
  return (
    <AuthProvider>
      <p>Admin page</p>
    </AuthProvider>
  );
};

export default AdminPage;
