"use client";

import Image from "next/image";
import { useState } from "react";

/** Pokémon artwork, or a short note when the picture is missing or fails to load. */
export function CardArtwork({
  image,
  priority,
  large,
}: {
  image: string;
  priority: boolean;
  large: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const height = large ? "h-72" : "h-40";

  return (
    <div className="mt-stack overflow-hidden rounded-lg border-2 border-frame bg-gradient-to-b from-[#d5e6f2] to-card">
      {image && !failed ? (
        <Image
          src={image}
          alt=""
          width={240}
          height={240}
          unoptimized
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          onError={() => setFailed(true)}
          className={`mx-auto w-auto object-contain ${height}`}
        />
      ) : (
        <p className={`flex items-center justify-center px-stack text-center text-caption text-flavor ${height}`}>
          no image available
        </p>
      )}
    </div>
  );
}
