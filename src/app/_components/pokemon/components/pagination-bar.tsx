"use client";

import { Button } from "~/app/_components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePokemonStore } from "~/app/_store/usePokemonStore";

type PageItem = number | "ellipsis";

function getPageItems(current: number, total: number, itemsPerPage: number): PageItem[] {
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  const isWide = width > 500;

  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (current < 4 && !isWide) return [1, "ellipsis", total];
  if (current < 4) return [1, 2, 3, "ellipsis", total];
  if (current > total - 3 && !isWide) return ["ellipsis", total - 1];
  if (current > total - 3) return [1, "ellipsis", total - 2, total - 1, total];

  return isWide
    ? [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total]
    : ["ellipsis", current, "ellipsis"];
}

export function PaginationBar({
  currentPage,
  totalPages,
  itemsPerPage,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  mySetCurrentPage: any;
  onChange: (page: number) => void;
}) {
  const setLastPage = usePokemonStore((s) => s.setLastPage);
  const pokemonCache = usePokemonStore((s) => s.pokemonCache);

  // 👇 Find the last cached Pokémon ID
  const lastKey = pokemonCache.size
    ? Math.max(...Array.from(pokemonCache.keys()))
    : 0;

  // 👇 Compute the ID of the last Pokémon on the current page
  const endIndex = currentPage * itemsPerPage;

  // 👇 Hide if this page reaches/passes the last cached Pokémon
  if (endIndex >= lastKey) {
    return null;
  }

  const items = getPageItems(currentPage, totalPages, itemsPerPage);
  const isFirst = currentPage <= 1;

  return (
    <nav
      className="mx-auto flex w-full max-w-3xl items-center justify-between p-2 rounded-2xl border border-slate-200 bg-white p-3"
      aria-label="Pagination"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange(currentPage - 1)}
        disabled={isFirst}
        className="mr-4 min-w-[80px] justify-center border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        <ChevronLeft className="mr-2 h-4 w-4 hidden sm:inline" />
        Previous
      </Button>

      <div className="flex items-center justify-center w-max">
        {items.map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`e-${idx}`}
              className="px-2 text-sm text-slate-400 select-none"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                if (item === totalPages) {
                  setLastPage();
                } else {
                  onChange(item);
                }
              }}
              className={[
                "h-9 w-9 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 mx-[0.1rem] md:mx-[0.3rem]",
                item === currentPage
                  ? "ring-1 ring-slate-900/10 text-slate-900 font-medium"
                  : "",
              ].join(" ")}
              aria-current={item === currentPage ? "page" : undefined}
              aria-label={`Go to page ${item}`}
            >
              {item}
            </Button>
          )
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange(currentPage + 1)}
        className="ml-4 min-w-[80px] justify-center border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      >
        Next
        <ChevronRight className="ml-2 h-4 w-4 hidden sm:inline" />
      </Button>
    </nav>
  );
}

