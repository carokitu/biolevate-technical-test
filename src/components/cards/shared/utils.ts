import { MatchSource } from "@/search/search";

export function fieldHighlight(source: MatchSource): "name" | "type" | "short_effect" {
    if (source.kind === "name" || source.kind === "type" || source.kind === "short_effect") {
      return source.kind;
    }
  
    return "short_effect";
  }

export function formatName(name: string) {
    return name
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}