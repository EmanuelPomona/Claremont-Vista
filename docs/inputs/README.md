# Inputs: source material for the manager

Put anything the manager should plan from in this folder: the pre-planning doc,
interview notes, research tables, screenshots of reference sites, photos of the
site or the North Campus area, copy drafts, and links (paste them into a `.md` or
`.txt` file).

**Everything here except this README is gitignored.** It stays on this machine
and never enters the repo history. That matters for this project because the
interview notes describe real 5C workers. What gets committed is what the manager
distills from them: `docs/PRODUCT.md`, `docs/DESIGN_BRIEF.md`, the task files, and
so on. Distilled docs refer to interviewees by persona ("late-20s dining worker,
25-minute commute"), never by name.

## Rules

- The manager reads every file here at the start of planning and lists what it
  read in `docs/status/main.md`.
- Worker worktrees do NOT see this folder. If a file here becomes part of the
  site (a photo, a chart, a downloadable PDF), the manager writes a task that
  copies the chosen, final version into the tracked asset directory. Site code
  never references `docs/inputs/` by path.
- Add new material at any time. Tell the manager it is there; it re-reads the
  folder and records what changed.
