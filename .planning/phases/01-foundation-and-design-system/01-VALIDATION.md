---
phase: 1
slug: foundation-and-design-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | jest 29.x + @testing-library/react 14.x |
| **Config file** | jest.config.js (created in Wave 0) |
| **Quick run command** | `pnpm test --bail` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test --bail`
- **After every plan wave:** Run `pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | DSGN-01 | unit | `pnpm test -- --testPathPattern=tokens` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | DSGN-02 | unit | `pnpm test -- --testPathPattern=typography` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 1 | DSGN-03 | unit | `pnpm test -- --testPathPattern=icons` | ❌ W0 | ⬜ pending |
| 1-03-01 | 03 | 2 | LYOT-01 | unit | `pnpm test -- --testPathPattern=HeaderBar` | ❌ W0 | ⬜ pending |
| 1-03-02 | 03 | 2 | LYOT-02, LYOT-03 | unit | `pnpm test -- --testPathPattern=NavBar` | ❌ W0 | ⬜ pending |
| 1-03-03 | 03 | 2 | LYOT-04 | unit | `pnpm test -- --testPathPattern=Dropdown` | ❌ W0 | ⬜ pending |
| 1-03-04 | 03 | 2 | LYOT-05, DSGN-04 | unit | `pnpm test -- --testPathPattern=Table` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Jest + @testing-library/react installed and configured
- [ ] `jest.config.js` with CSS Module mock and TypeScript transform
- [ ] `src/__tests__/` directory structure created

*Wave 0 is handled as part of the project scaffold plan.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| HeaderBar gradient renders correctly | LYOT-01 | Visual rendering check | Open localhost:3000, verify gradient background matches Rotter header |
| SVG icons render pixelated | DSGN-03 | Visual rendering quality | Open icon showcase page, verify `image-rendering: pixelated` effect |
| Dropdown menus open on hover | LYOT-04 | Mouse interaction | Hover over nav bar items, verify dropdown appears with correct colors |
| No hydration console errors | DSGN-04 | Browser console check | Open DevTools console, verify zero hydration warnings on page load |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
