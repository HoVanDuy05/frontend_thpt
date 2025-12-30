import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { TUser } from "@/shared/types/user.type";

interface State {
    user: TUser | null;
    token: string | null;
    isHydrated: boolean;
}

interface Actions {
    setUser: (user: TUser | null) => void;
    setToken: (token: string | null) => void;
    setHydrated: (state: boolean) => void;
    reset: () => void;
    logout: () => void;
}

const initialState: State = {
    user: null,
    token: null,
    isHydrated: false,
};


export const useAppStore = create<State & Actions>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,
                setUser: (user) => set({ user }, false, "setUser"),
                setToken: (token) => set({ token }, false, "setToken"),
                setHydrated: (state) => set({ isHydrated: state }, false, "setHydrated"),
                reset: () => set(initialState, false, "reset"),
                logout: () => set({ user: null, token: null }, false, "logout"),
            }),

            {
                name: "auth_store",
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state) => {
                    state?.setHydrated(true);
                },
            }
        ),
        { name: "auth_store" }
    )
);
