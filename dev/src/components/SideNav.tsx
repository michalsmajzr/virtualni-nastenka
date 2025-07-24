import { useSession } from "next-auth/react";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useContext } from "react";
import { FabVisibleContext } from "@/components/FabVisible";
import { useMediaQuery } from "react-responsive";
import SideNavLiks from "@/components/SideNavLinks";
import Fab from "@/components/Fab";
import IconButton from "@/components/IconButton";

export default function SideNav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const params = useParams();

  const router = useRouter();

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1024px)" });

  const { fabVisible } = useContext(FabVisibleContext);

  if (!fabVisible && isTabletOrMobile) {
    return;
  }

  /* navigace */
  let src = "";
  let href = "";
  if (pathname === "/dashboard") {
    src = "/icons/add.svg";
    href = "/dashboard/board/add-board";
  } else if (pathname === `/dashboard/conversations`) {
    src = "/icons/chat-add.svg";
    href = `/dashboard/conversations/add-conversation`;
  } else if (pathname === "/dashboard/polls") {
    src = "/icons/add.svg";
    href = "/dashboard/polls/add-poll";
  } else if (pathname === "/dashboard/administration") {
    src = "/icons/person-add.svg";
    href = "/dashboard/administration/add-user";
  } else if (pathname === `/dashboard/${params.boardId}`) {
    src = "/icons/add.svg";
    href = `/dashboard/${params.boardId}/edit-section`;
  } else if (pathname === `/dashboard/${params.boardId}/${params.sectionId}`) {
    src = "/icons/add.svg";
    href = `/dashboard/${params.boardId}/${params.sectionId}/add`;
  }

  /* sipka zpet */
  function ArrowBack({ href }: { src: string; href: string }) {
    return (
      <nav className="hidden z-20 fixed grid grid-rows-3 items-center justify-center top-0 left-0 w-20 h-screen lg:grid bg-surface-container">
        <div className="justify-self-center right-0 bottom-0 px-3 text-on-surface-variant cursor-pointer">
          <IconButton
            src="/icons/arrow-back-36dp.svg"
            size="small"
            onClick={() => router.push(href)}
          />
        </div>
      </nav>
    );
  }
  if (pathname === `/dashboard/${params.boardId}/add-board`) {
    href = `/dashboard`;

    return <ArrowBack src={src} href={href} />;
  } else if (pathname === `/dashboard/conversations/add-conversation`) {
    href = `/dashboard/conversations`;

    return <ArrowBack src={src} href={href} />;
  } else if (pathname === `/dashboard/polls/add-poll`) {
    href = `/dashboard/polls`;

    return <ArrowBack src={src} href={href} />;
  } else if (
    pathname === `/dashboard/administration/add-user` ||
    pathname === `/dashboard/administration/edit-user/${params.id}` ||
    pathname === `/dashboard/administration/user/${params.id}`
  ) {
    href = `/dashboard/administration`;

    return <ArrowBack src={src} href={href} />;
  } else if (pathname === `/dashboard/${params.boardId}/edit-section`) {
    href = `/dashboard/${params.boardId}`;

    return <ArrowBack src={src} href={href} />;
  } else if (
    pathname === `/dashboard/${params.boardId}/${params.sectionId}/add/photo` ||
    pathname === `/dashboard/${params.boardId}/${params.sectionId}/add/text` ||
    pathname === `/dashboard/${params.boardId}/${params.sectionId}/add/pdf` ||
    pathname === `/dashboard/${params.boardId}/${params.sectionId}/add/video` ||
    pathname === `/dashboard/${params.boardId}/${params.sectionId}/add/file` ||
    pathname === `/dashboard/${params.boardId}/${params.sectionId}/add/audio`
  ) {
    href = `/dashboard/${params.boardId}/${params.sectionId}/add`;

    return <ArrowBack src={src} href={href} />;
  } else if (
    pathname === `/dashboard/${params.boardId}/${params.sectionId}/add` ||
    pathname ===
      `/dashboard/${params.boardId}/${params.sectionId}/photo/${params.photoId}` ||
    pathname ===
      `/dashboard/${params.boardId}/${params.sectionId}/text/${params.textId}` ||
    pathname ===
      `/dashboard/${params.boardId}/${params.sectionId}/pdf/${params.pdfId}` ||
    pathname ===
      `/dashboard/${params.boardId}/${params.sectionId}/video/${params.videoId}` ||
    pathname ===
      `/dashboard/${params.boardId}/${params.sectionId}/file/${params.fileId}` ||
    pathname ===
      `/dashboard/${params.boardId}/${params.sectionId}/audio/${params.audioId}`
  ) {
    src = "/icons/arrow-back-36dp.svg";
    href = `/dashboard/${params.boardId}/${params.sectionId}`;

    return <ArrowBack src={src} href={href} />;
  }

  return (
    <nav
      className="z-20 fixed bottom-0 flex w-full items-center justify-center bg-surface-container
        lg:top-0 lg:left-0 lg:grid lg:grid-rows-3 lg:w-auto lg:h-screen"
    >
      <div className="absolute bottom-18 right-0 justify-self-center mr-4 mb-4 lg:static lg:right-0 lg:bottom-0 lg:px-3 lg:my-6 lg:mr-0">
        {status === "authenticated" && session?.user?.role === "teacher" && (
          <>{src && <Fab src={src} onClick={() => router.push(href)} />}</>
        )}
      </div>
      <ul className="flex p-2 lg:flex-col lg:gap-3 lg:p-0">
        <SideNavLiks />
      </ul>
    </nav>
  );
}
