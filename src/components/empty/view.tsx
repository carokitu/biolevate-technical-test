import Image from "next/image";

import pikachu from "./pikachu.jpg";

export function Empty({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center gap-page">
      <Image
        src={pikachu}
        alt="Dizzy Pikachu"
        className="h-auto w-full max-w-sm"
      />
      <p className="text-center text-copy">No result for {query}</p>
    </div>
  );
}
