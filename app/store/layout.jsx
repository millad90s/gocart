import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Soulyn Jewelry - Store Dashboard",
    description: "Soulyn Jewelry - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
