import "server-only";

import { getDb } from "@/lib/firebase-admin";
import { projects as seedProjects, type Project } from "@/data/projects";

/**
 * 作品資料層（伺服器端）。
 *
 * 公開頁面（首頁、作品列表、作品內頁）都透過這裡取得資料。
 * - 已設定 Firebase → 讀 Firestore 的 projects 集合
 * - 尚未設定 → 回傳 src/data/projects.ts 的預設資料
 *   （讓網站在你完成 Firebase 設定前仍可正常運作）
 *
 * Firestore 中每個作品的「文件 ID」就是它的 slug，方便用網址查詢。
 */

const COLLECTION = "projects";

/** Firestore 內每筆作品的儲存結構 = Project 內容 + 排序欄位 */
export type ProjectDoc = Project & {
  order: number;
};

function docToProject(data: FirebaseFirestore.DocumentData): Project {
  // 只取 Project 需要的欄位，忽略 order / 時間戳等內部欄位
  const rest = { ...data };
  delete rest.order;
  delete rest.createdAt;
  delete rest.updatedAt;
  return rest as Project;
}

/** 取得所有作品，依 order 由小到大排序 */
export async function getAllProjects(): Promise<Project[]> {
  const db = getDb();
  if (!db) return seedProjects;

  const snap = await db.collection(COLLECTION).orderBy("order", "asc").get();
  if (snap.empty) return seedProjects;
  return snap.docs.map((d) => docToProject(d.data()));
}

/** 首頁精選作品 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.featured);
}

/** 依 slug 取得單一作品，找不到回傳 null */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = getDb();
  if (!db) return seedProjects.find((p) => p.slug === slug) ?? null;

  const doc = await db.collection(COLLECTION).doc(slug).get();
  if (!doc.exists) return null;
  return docToProject(doc.data()!);
}

/** 作品分類清單（去重） */
export async function getCategories(): Promise<string[]> {
  const all = await getAllProjects();
  return Array.from(new Set(all.map((p) => p.category)));
}

// ─────────────────────────────────────────────────────────────
// 以下為後台寫入用（新增 / 編輯 / 刪除）。呼叫端須先驗證登入。
// ─────────────────────────────────────────────────────────────

/** Firestore 不接受 undefined，寫入前先把 undefined 欄位移除 */
function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/** 取得目前最大的 order 值，用來把新作品排到最後 */
async function nextOrder(db: FirebaseFirestore.Firestore): Promise<number> {
  const snap = await db
    .collection(COLLECTION)
    .orderBy("order", "desc")
    .limit(1)
    .get();
  if (snap.empty) return 0;
  return (snap.docs[0]!.data().order ?? 0) + 1;
}

/** 新增作品。slug 重複會丟出錯誤。 */
export async function createProject(project: Project): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase 尚未設定");

  const ref = db.collection(COLLECTION).doc(project.slug);
  const existing = await ref.get();
  if (existing.exists) {
    throw new Error(`網址代稱「${project.slug}」已經有人用了，請換一個`);
  }

  await ref.set(
    stripUndefined({
      ...project,
      order: await nextOrder(db),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  );
}

/**
 * 更新作品。若 slug（文件 ID）有變動，會建立新文件並刪除舊的。
 */
export async function updateProject(
  originalSlug: string,
  project: Project,
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase 尚未設定");

  const oldRef = db.collection(COLLECTION).doc(originalSlug);
  const oldSnap = await oldRef.get();
  if (!oldSnap.exists) throw new Error("找不到要編輯的作品");

  const order = oldSnap.data()!.order ?? 0;
  const createdAt = oldSnap.data()!.createdAt ?? new Date().toISOString();

  const payload = stripUndefined({
    ...project,
    order,
    createdAt,
    updatedAt: new Date().toISOString(),
  });

  if (project.slug === originalSlug) {
    await oldRef.set(payload);
    return;
  }

  // slug 改了：確認新 slug 沒被占用，再搬家
  const newRef = db.collection(COLLECTION).doc(project.slug);
  if ((await newRef.get()).exists) {
    throw new Error(`網址代稱「${project.slug}」已經有人用了，請換一個`);
  }
  await newRef.set(payload);
  await oldRef.delete();
}

/** 刪除作品 */
export async function deleteProject(slug: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase 尚未設定");
  await db.collection(COLLECTION).doc(slug).delete();
}
