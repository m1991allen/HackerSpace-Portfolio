import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects";
import ProjectForm from "../../project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectForm initial={project} originalSlug={slug} />;
}
