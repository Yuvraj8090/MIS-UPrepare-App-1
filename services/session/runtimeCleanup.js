import { removeAllData } from "@/services/storage/AsyncStorage";
import { clearSecureSessionStore } from "@/services/storage/SecureStore";
import { clearDB } from "@/services/database/database";

// Clears every locally persisted session artifact so each app launch starts clean.
export async function clearRuntimeAppData() {
  await Promise.allSettled([removeAllData(), clearSecureSessionStore(), clearDB()]);
}
