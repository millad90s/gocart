import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Soulyn Jewelry - Admin",
    description: "Soulyn Jewelry - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
