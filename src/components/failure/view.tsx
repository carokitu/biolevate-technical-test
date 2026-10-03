import Image from "next/image";

import pikachu from "./pikachu.webp";

export function Failure({ title = true }: { title?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-page">
      {title ? (
        <h1 className="pokedex-title text-center text-5xl sm:text-7xl">Pokedex</h1>
      ) : null}
      <Image
        src={pikachu}
        alt="Dizzy Pikachu"
        className="h-auto w-full max-w-sm"
      />
      <p className="text-center text-copy">An error occurred :/</p>
    </div>
  );
}
