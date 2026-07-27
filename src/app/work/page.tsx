import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import WorkGrid from "@/components/work-grid";
import { getAllProjects, getCategories } from "@/lib/projects";

export const metadata: Metadata = {
  title: "作品",
  description:
    "品牌官網、電子商務與網頁系統的完整作品集，每個專案都附有設計思考與成果數據。",
};

export const revalidate = 300;

export default async function WorkPage() {
  const [projects, categories] = await Promise.all([
    getAllProjects(),
    getCategories(),
  ]);
  return (
    <>
      <section className="shell pt-16 pb-14 sm:pt-24">
        <Reveal>
          <p className="eyebrow">作品集</p>
          <h1 className="display mt-5 max-w-3xl text-[2.5rem] leading-[1.15] text-ink sm:text-6xl">
            我們做過的每一個網站，
            <br />
            都在解決一個具體的問題
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-2">
            以下是 {projects.length}{" "}
            個代表性專案。每一則都包含我們遇到的實際挑戰、做出的判斷，以及上線後的結果。
          </p>
        </Reveal>
      </section>

      <WorkGrid projects={projects} categories={[...categories]} />
    </>
  );
}
