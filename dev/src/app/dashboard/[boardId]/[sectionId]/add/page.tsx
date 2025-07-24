"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import TopBar from "@/components/TopBar";
import StepLayout from "@/components/StepLayout";

export default function AddBoard() {
  const router = useRouter();
  const params = useParams();

  const posts = [
    {
      text: "Text",
      href: `/dashboard/${params.boardId}/${params.sectionId}/add/text`,
      src: "",
    },
    {
      text: "Fotografie",
      href: `/dashboard/${params.boardId}/${params.sectionId}/add/photo`,
      src: "",
    },
    {
      text: "Video",
      href: `/dashboard/${params.boardId}/${params.sectionId}/add/video`,
      src: "",
    },
    {
      text: "Soubor",
      href: `/dashboard/${params.boardId}/${params.sectionId}/add/file`,
      src: "",
    },
    {
      text: "PDF",
      href: `/dashboard/${params.boardId}/${params.sectionId}/add/pdf`,
      src: "",
    },
    {
      text: "Audio",
      href: `/dashboard/${params.boardId}/${params.sectionId}/add/audio`,
      src: "",
    },
  ];

  return (
    <>
      <TopBar
        name="Přidat příspěvek"
        onClick={() =>
          router.push(`/dashboard/${params.boardId}/${params.sectionId}`)
        }
        desktopVisible={false}
      />
      <StepLayout>
        <section className="flex-1 flex flex-col items-center justify-center overflow-hidden">
          <h2 className="text-display-small mb-6">Vyberte příspěvěk</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] items-center gap-6 w-full p-6 bg-surface-container-high rounded-3xl overflow-auto md:w-2/3">
            {posts.map((post) => (
              <div
                key={post.text}
                onClick={() => router.push(post.href)}
                className="group relative h-fit flex items-center justify-center gap-4 p-3 bg-surface-container-highest 
                cursor-pointer rounded-xl"
              >
                <div className="z-10 absolute inset-0 bg-on-surface opacity-0 group-hover:opacity-10 rounded-xl"></div>
                <div className="flex items-center">
                  <span className="text-title-medium-scale">{post.text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </StepLayout>
    </>
  );
}
