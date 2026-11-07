# Changelog

All notable public releases of Wonder Nature. This project follows
[Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`).

Public releases are snapshots of accepted work from the private development
repository. Development commits are never published automatically.

## [0.2.0] — 2026-11-07 — UI Refined Public Release

First public source release.

### Added

- Full, runnable source of the v0.2.0 exhibition, with a fresh Git history.
- MIT licence, third-party notices and contribution guidelines.
- Reproducible asset tooling: `scripts/generate-terrain.py`,
  `scripts/generate-vegetation.py` and `scripts/generate-specimens.py`.
- Project preview screenshots in `docs/`.

### Changed

- Homepage replaced with the refined layout: navigation arrangement, plant
  exhibit cards, decorative details and interaction visuals.
- Plant cards now use the botanical plates in `public/art/botanical/`.

### Removed

- Development-only quality-check pages (`/dev/*`, `public/garden-quality`,
  `public/asset-quality`) and their bundled Poly Haven / three.js vendors.
- All private development branches, tags and commit history.

### Notes

- Still a stylized garden planet. The real-Earth relief rebuild, cloud and
  atmosphere experiments, and the mimosa study are **not** included.
- 中文：首个开源版本。包含精修后的首页、风格化花园星球、植物卡片与导航；
  不含真实地球形态、云层实验与含羞草等开发中功能。

## [0.1.0] — 2026-11-07 — Public preview (website only)

- First exhibition "Garden Planet": rotate, zoom, exhibit markers, info cards.
- Four simulated habitats, exhibit index, basic mobile layout.
- Version number displayed in the footer and "about" panel.
- Public experience on the custom domain; source kept private.

[0.2.0]: https://github.com/wusansing-cloud/Wonder-Nature-OpenSource/releases/tag/v0.2.0
