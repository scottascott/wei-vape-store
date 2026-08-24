import { Cpu, Droplet, Layers, Wrench, Zap, type LucideIcon } from "lucide-react";

const ICONS_BY_SLUG: Record<string, LucideIcon> = {
  disposable: Zap,
  pods: Layers,
  "e-liquid": Droplet,
  devices: Cpu,
  accessories: Wrench,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return ICONS_BY_SLUG[slug] ?? Layers;
}
