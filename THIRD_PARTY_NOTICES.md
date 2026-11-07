# Third-party notices

Wonder Nature is released under the MIT licence (see [LICENSE](LICENSE)) for
its original source code and original assets. This file records the licences
and provenance of everything else that ships in this repository.

## Runtime dependencies

| Component | Version | Licence | Notes |
| --- | --- | --- | --- |
| [Next.js](https://nextjs.org/) | 16.3.4 | MIT | Application framework and static export |
| [React](https://react.dev/) / React DOM | 19.2.6 | MIT | UI runtime |

Development-only tooling (`typescript`, `@types/*`) is installed from npm and
is not redistributed in this repository; each package keeps its own licence
(Apache-2.0 for TypeScript, MIT for the `@types` packages).

No webfonts are bundled or fetched. The interface uses system font stacks
(Georgia, Arial, PingFang SC, Microsoft YaHei, Noto Sans CJK, SFMono,
Consolas, Liberation Mono).

## Bundled assets

| Path | Content | Provenance | Licence |
| --- | --- | --- | --- |
| `public/atlas/surface.webp`, `relief.png`, `vegetation.webp` | Planet surface colour map, height/biome data map, vegetation billboards | Generated from scratch by `scripts/generate-terrain.py` and `scripts/generate-vegetation.py` using deterministic NumPy noise; no third-party imagery is sampled | MIT (project original) |
| `public/art/fern.svg`, `poppy.svg`, `lupine.svg`, `agave.svg`, `stars.svg` | Vector specimen plates and star field | Drawn procedurally by `scripts/generate-specimens.py` / project code | MIT (project original) |
| `public/art/botanical/fern.webp`, `poppy.webp`, `lupine.webp`, `agave.webp` | Botanical plates used by the exhibit index cards | Produced for this project and first published with the v0.2.0 exhibition | MIT (project original) |
| `src/app/icon.svg` | Site icon | Project original | MIT (project original) |
| `docs/preview.webp` | Screenshot of the live site | Captured from `https://wonder-nature.xingh.cc` | MIT (project original) |

No Poly Haven, three.js vendor bundle, GLTF model or external texture is
redistributed in this repository. Those assets exist only in the private
development workspace's quality-check pages, which are not part of this
release.

## Trademarks and identity

"Wonder Nature", "奇妙自然", the logotype, exhibition numbering and the
official deployment at `https://wonder-nature.xingh.cc` identify the project
owner's official project. The MIT licence grants rights to the source code; it
does not grant permission to operate a deployment or distribution as the
official Wonder Nature site.

## Reporting a licensing problem

If you believe something in this repository is attributed incorrectly, please
open an issue and it will be reviewed promptly.
