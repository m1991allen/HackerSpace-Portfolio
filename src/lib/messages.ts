import "server-only";

import { getDb } from "@/lib/firebase-admin";

/**
 * 聯絡訊息資料層（伺服器端）。
 * 前台表單送出後存進 Firestore 的 messages 集合，
 * 後台收件匣讀取、標記已讀、刪除。
 */

const COLLECTION = "messages";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  type?: string;
  budget?: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type NewMessage = Omit<ContactMessage, "id" | "read" | "createdAt">;

/** 新增一筆聯絡訊息，回傳文件 ID */
export async function createMessage(data: NewMessage): Promise<string> {
  const db = getDb();
  if (!db) throw new Error("Firebase 尚未設定");

  const payload = JSON.parse(
    JSON.stringify({
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    }),
  );
  const ref = await db.collection(COLLECTION).add(payload);
  return ref.id;
}

/** 取得所有訊息，最新的在前面 */
export async function getAllMessages(): Promise<ContactMessage[]> {
  const db = getDb();
  if (!db) return [];

  const snap = await db
    .collection(COLLECTION)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ContactMessage);
}

/** 未讀訊息數量 */
export async function getUnreadCount(): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  const snap = await db.collection(COLLECTION).where("read", "==", false).get();
  return snap.size;
}

/** 標記已讀 / 未讀 */
export async function setMessageRead(id: string, read: boolean): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase 尚未設定");
  await db.collection(COLLECTION).doc(id).update({ read });
}

/** 刪除訊息 */
export async function deleteMessage(id: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase 尚未設定");
  await db.collection(COLLECTION).doc(id).delete();
}
