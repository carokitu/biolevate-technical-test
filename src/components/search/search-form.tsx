"use client";

export function SearchForm({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      className="mx-auto flex w-full max-w-xl gap-stack"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="q" className="sr-only">
        Search the Pokédex
      </label>
      <input
        id="q"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search for a name, characteristic or move"
        className="min-w-0 flex-1 rounded-full border border-field bg-white/85 px-4 py-2.5 text-copy text-foreground shadow-inner outline-none placeholder:text-placeholder focus:border-accent"
      />
      <button
        type="submit"
        className="shrink-0 cursor-pointer rounded-full bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-strong"
      >
        Search
      </button>
    </form>
  );
}
