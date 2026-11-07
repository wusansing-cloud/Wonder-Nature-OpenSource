# Contributing to Wonder Nature

Thanks for taking a look at the project. Issues and pull requests are welcome.

## Ground rules

- This repository is the **official public source snapshot**. Only the owner
  and explicitly invited maintainers have write access. Fork the repository and
  work in your own copy.
- The official site `https://wonder-nature.xingh.cc` and the official releases
  are controlled by the maintainer. Please do not ask for deployment access.
- By contributing, you agree that your contribution is licensed under the
  project's MIT licence.

## Reporting a bug

Open an issue and include:

- what you expected and what happened;
- browser and OS (plus whether hardware acceleration / WebGL is enabled — the
  scene falls back to a Canvas software renderer when it is not);
- steps to reproduce, and a screenshot if the problem is visual;
- the version shown in the site footer (currently `v0.2.0`).

## Proposing a change

1. Fork the repository and create a topic branch.
2. Keep pull requests focused: one behaviour change or one exhibit per PR.
3. Match the existing style — the code is TypeScript (strict), no UI framework,
   CSS lives in `src/app/globals.css`, comments stay sparse and factual.
4. Before opening the PR, run:

   ```bash
   npm ci
   npm run typecheck
   npm run build
   ```

5. Describe the change, the motivation, and how you verified it. Screenshots of
   the globe in both the WebGL and software-rendering paths are appreciated.

New assets must be original or licensed for redistribution, and must be listed
in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) with their provenance.

## What happens next

Because public releases are cut from a private development repository, an
accepted PR may land in the public repository as part of a later tagged release
rather than being merged directly. Either way, you will get an answer on the PR.

## Code of conduct

Be civil and specific. Criticism of the work is fine; personal attacks are not.
