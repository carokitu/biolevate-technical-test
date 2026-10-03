"use client";

import { useEffect, useId, useRef, useState } from "react";

import { type PokemonSort, type PokemonSortKey } from "@/search/sort";

const SORT_OPTIONS: { key: PokemonSortKey; label: string }[] = [
  { key: "relevance", label: "Relevance" },
  { key: "id", label: "Number" },
  { key: "hp", label: "HP" },
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "special-attack", label: "Sp. Atk" },
  { key: "special-defense", label: "Sp. Def" },
  { key: "speed", label: "Speed" },
];

function changeSort(sort: PokemonSort, key: PokemonSortKey): PokemonSort {
  if (key === "relevance") return { key, direction: "desc" };
  if (sort.key === "relevance") return { key, direction: key === "id" ? "asc" : "desc" };

  return { key, direction: sort.direction };
}

export function SortControl({
  sort,
  onChange,
}: {
  sort: PokemonSort;
  onChange: (sort: PokemonSort) => void;
}) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = SORT_OPTIONS.find((option) => option.key === sort.key) ?? SORT_OPTIONS[0];

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-stack">
      <span id={`${listId}-label`} className="kicker text-muted">
        Sort by
      </span>
      <div ref={menu} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${listId}-label`}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex cursor-pointer items-center gap-stack rounded-full border border-field bg-white/90 py-1.5 pr-3 pl-4 text-copy text-foreground shadow-sm"
        >
          {selected.label}
          <svg
            viewBox="0 0 12 12"
            aria-hidden="true"
            className={`h-3 w-3 text-soft transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        {open ? (
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={`${listId}-label`}
            className="absolute top-full left-0 z-20 mt-stack min-w-full overflow-hidden rounded-2xl border border-field bg-white py-inline shadow-[0_16px_32px_rgb(140_50_80/0.18)]"
          >
            {SORT_OPTIONS.map((option) => {
              const active = option.key === sort.key;

              return (
                <li key={option.key} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(changeSort(sort, option.key));
                      setOpen(false);
                    }}
                    className={`block w-full cursor-pointer px-4 py-2 text-left text-copy ${
                      active
                        ? "bg-accent font-semibold text-white"
                        : "text-foreground hover:bg-field/50"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      {sort.key !== "relevance" ? (
        <button
          type="button"
          onClick={() =>
            onChange({
              ...sort,
              direction: sort.direction === "desc" ? "asc" : "desc",
            })
          }
          className="cursor-pointer rounded-full border border-field bg-white/90 px-4 py-1.5 text-copy text-foreground shadow-sm hover:border-accent"
        >
          {sort.direction === "desc" ? "High to low" : "Low to high"}
        </button>
      ) : null}
    </div>
  );
}
