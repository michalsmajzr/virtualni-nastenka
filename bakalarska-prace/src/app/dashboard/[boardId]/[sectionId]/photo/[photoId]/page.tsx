"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import DashboardLayout from "@/components/DashboardLayout";
import { RowsPhotoAlbum, Photo } from "react-photo-album";
import "react-photo-album/rows.css";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Thumbnail } from "@/types/photo";
import { useRouter } from "next/navigation";

/* dle: https://yet-another-react-lightbox.com/examples/gallery */

export default function PhotoPage() {
  const params = useParams() as {
    boardId: string;
    sectionId: string;
    photoId: string;
  };

  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);
  const [name, setName] = useState("");
  const [photos, setPhotos] = useState<Photo[]>();
  const [thumbnails, setThumbnails] = useState<Photo[]>([]);
  const [index, setIndex] = useState(-1);

  async function loadPhotoGallery() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/photo-gallery/${params.photoId}`
    );

    if (res.ok) {
      const data = await res.json();
      const { name, photos } = data;
      const thumbnails = photos.map((image: Thumbnail) => ({
        src: image.thumbnail_url,
        width: image.thumbnail_width,
        height: image.thumbnail_height,
      }));

      setName(name);
      setPhotos(photos);
      setThumbnails(thumbnails);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function sendBadge() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/audio/${params.photoId}/badge`,
      { method: "PUT" }
    );

    if (!res.ok) {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    sendBadge();
    loadPhotoGallery();
  }, []);

  if (!photos && !thumbnails) {
    return;
  }

  return (
    <>
      <TopBar
        name={name}
        onClick={() =>
          router.push(`/dashboard/${params.boardId}/${params.sectionId}`)
        }
      />

      <DashboardLayout>
        <h1 className="hidden text-display-medium lg:text-display-large mb-6 lg:block">
          {name}
        </h1>
        <RowsPhotoAlbum
          photos={thumbnails}
          targetRowHeight={150}
          onClick={({ index: current }) => setIndex(current)}
        />

        <Lightbox
          index={index}
          slides={photos}
          open={index >= 0}
          close={() => setIndex(-1)}
          plugins={[Fullscreen, Slideshow, Zoom]}
        />
      </DashboardLayout>
    </>
  );
}
