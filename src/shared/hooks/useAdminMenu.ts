import { ADMIN_MENU_ITEMS } from "@/shared/constants/navigation";
import { useMemo } from "react";

export function useAdminMenu() {
    // In the future, you can add logic here to filter based on user roles
    // const { user } = useAppStore();

    const menuItems = useMemo(() => {
        return ADMIN_MENU_ITEMS;
    }, []);

    return {
        menuItems,
    };
}
