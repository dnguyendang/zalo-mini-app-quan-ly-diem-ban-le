import { create } from "zustand";
import { devtools } from "zustand/middleware";
import createAppStore, { AppSlice } from "./appSlice";
import createAuthStore, { AuthSlice } from "./authSlice";
import createOrganizationStore, { OrganizationSlice } from "./organizationSlice";

type State = AppSlice &
    AuthSlice &
    OrganizationSlice

export const useStore = create<State>()(
    devtools((...a) => ({
        ...createAppStore(...a),
        ...createAuthStore(...a),
        ...createOrganizationStore(...a),
    })),
);
