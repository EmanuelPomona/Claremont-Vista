# claremonthousing

The website for a proposed affordable housing community for low-income workers
at the Claremont Colleges (5C), planned for the North Campus study area under the
working name "North Commons".

The site is built around the team's problem statement:

> How might we empower low-income 5C workers to build community on their own
> terms, balancing opportunities for social connection with their need for
> privacy and independence?

It covers the community and its homes, an events board, shared facilities
(fitness, childcare, gathering space), groups, and an about/contact/forum area.
University Hills at UC Irvine (https://uhills.org) is the reference for what a
college workforce-housing site should do. We borrow its functions, not its look.

## Status

Planning. The manager agent turns `docs/inputs/` (local only) into
`docs/PRODUCT.md`, `docs/DESIGN_BRIEF.md`, and the task files in `docs/tasks/`.

## How this repo is built

Several Claude Code agents work in separate git worktrees under
`docs/AGENT_PROTOCOL.md`:

| Folder | Branch | Agent |
|---|---|---|
| `claremonthousing` | `main` | `claude --agent manager` |
| `claremonthousing-Frontend` | `agent/frontend` | `claude --agent frontend-engineer` |
| `claremonthousing-Backend` | `agent/backend` | `claude --agent backend-engineer` |
| `claremonthousing-Reviewer` | `agent/reviewer` | `claude --agent reviewer` |

The full loop, scripts, and enforcement rules are in `docs/WORKFLOW.md`.
