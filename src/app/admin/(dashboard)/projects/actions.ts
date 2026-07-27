"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/projects";
import type { Project } from "@/data/projects";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** 更新公開頁面的快取，讓改動立即反映在網站上 */
function revalidatePublic(slug: string, originalSlug?: string) {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${slug}`);
  if (originalSlug && originalSlug !== slug) {
    revalidatePath(`/work/${originalSlug}`);
  }
}

function validate(p: Project): string | null {
  if (!p.slug || !/^[a-z0-9-]+$/.test(p.slug)) {
    return "網址代稱（slug）只能用小寫英文、數字與連字號，且不可空白";
  }
  if (!p.title.trim()) return "請填寫作品標題";
  if (!p.category.trim()) return "請填寫分類";
  return null;
}

/**
 * 新增或更新作品。
 * originalSlug 為 null 代表新增；否則為編輯（可能改了 slug）。
 */
export async function saveProjectAction(
  originalSlug: string | null,
  projectJson: string,
): Promise<ActionResult> {
  try {
    await requireUser();
    const project = JSON.parse(projectJson) as Project;

    const err = validate(project);
    if (err) return { ok: false, error: err };

    if (originalSlug) {
      await updateProject(originalSlug, project);
    } else {
      await createProject(project);
    }

    revalidatePublic(project.slug, originalSlug ?? undefined);
    return { ok: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : "儲存失敗";
    return { ok: false, error };
  }
}

/** 刪除作品 */
export async function deleteProjectAction(slug: string): Promise<ActionResult> {
  try {
    await requireUser();
    await deleteProject(slug);
    revalidatePublic(slug);
    return { ok: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : "刪除失敗";
    return { ok: false, error };
  }
}
