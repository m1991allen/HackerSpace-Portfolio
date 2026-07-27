"use server";

import { requireUser } from "@/lib/auth";
import { setMessageRead, deleteMessage } from "@/lib/messages";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function markReadAction(
  id: string,
  read: boolean,
): Promise<ActionResult> {
  try {
    await requireUser();
    await setMessageRead(id, read);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "操作失敗" };
  }
}

export async function deleteMessageAction(id: string): Promise<ActionResult> {
  try {
    await requireUser();
    await deleteMessage(id);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "刪除失敗" };
  }
}
