import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

type Props = {
  project: Project;
  /** 大卡片會佔滿寬度並放大字級 */
  size?: "default" | "large";
  priority?: boolean;
};

export default function ProjectCard({
  project,
  size = "default",
  priority = false,
}: Props) {
  const large = size === "large";

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block"
      aria-label={`查看作品：${project.title} — ${project.subtitle}`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-paper-2">
        <div className={large ? "aspect-16/10" : "aspect-4/3"}>
          <Image
            src={project.cover}
            alt={`${project.title}${project.subtitle}`}
            fill
            priority={priority}
            sizes={
              large
                ? "(max-width: 1024px) 100vw, 1200px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        </div>

        {/* hover 時浮現的遮罩與提示 */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0 p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="rounded-full bg-paper px-4 py-2 text-xs text-ink">
            查看專案 →
          </span>
        </div>

        <span
          className="absolute top-4 left-4 rounded-full px-3 py-1.5 text-[0.6875rem] font-medium text-paper backdrop-blur-sm"
          style={{ backgroundColor: `${project.accent}e6` }}
        >
          {project.category}
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3
            className={`display text-ink transition-colors group-hover:text-accent ${
              large ? "text-2xl sm:text-3xl" : "text-xl"
            }`}
          >
            {project.title}
            <span className="ml-2.5 font-sans text-sm font-normal text-muted">
              {project.subtitle}
            </span>
          </h3>
          <p
            className={`mt-2.5 leading-relaxed text-muted ${
              large ? "max-w-2xl text-base" : "text-sm"
            }`}
          >
            {project.excerpt}
          </p>
        </div>
        <span className="shrink-0 pt-1.5 text-xs text-muted tabular-nums">
          {project.year}
        </span>
      </div>
    </Link>
  );
}
