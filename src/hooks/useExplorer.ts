"use client";
import { useRef, useState, useCallback } from "react";
import type { SceneControls } from "@/globe/scene";
import { exhibits } from "@/data/exhibits";
export function useExplorer() {
  const controls = useRef<SceneControls | null>(null);
  const [selectedId, setSelected] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [ready, setReady] = useState(false);
  const [touched, setTouched] = useState(false);
  const interact = useCallback(() => setTouched(true), []);
  const select = useCallback((id: string, fly: boolean) => {
    setSelected(id);
    setTouched(true);
    if (fly)
      controls.current?.visit(id);
  }, []);
  const close = useCallback(() => setSelected(null), []);
  const reset = () => { controls.current?.reset(); close(); };
  return { controls, selected: exhibits.find(e => e.id === selectedId) ?? null, select, close, zoom, setZoom,
    ready, setReady, touched, interact, reset };
}
export type Explorer = ReturnType<typeof useExplorer>;
