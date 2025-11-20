import { defineStore } from "pinia";
import type { UserProfile } from "~/entities/user/types";
import { useApi } from "~/shared/api/useApi";

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    profile: null,
    loading: false,
    error: null,
  }),

  getters: {
    isLoaded: (state) => Boolean(state.profile),
    balance: (state) => state.profile?.balance ?? 0,
    currency: (state) => state.profile?.currency ?? "usd",
  },

  actions: {
    async fetchProfile() {
      const api = useApi();

      this.loading = true;
      try {
        const payload = await api.get<UserProfile>("/api/user");

        this.profile = payload;
        this.error = null;
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "Не удалось загрузить профиль пользователя";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});


