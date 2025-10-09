export async function $apiFetch<T>(path: string) {
  const base = useRuntimeConfig().public.dummyJsonBase;
  try {
    return await $fetch<T>(base + path);
  } catch (e) {
    throw e;
  }
}
