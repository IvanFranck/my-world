import AdminDashboardHeader from "@/src/components/app/admin/Header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <>
      <AdminDashboardHeader />
      <div>{children}</div>
    </>
  );
};

export default AdminLayout;
