---
phase: 2
slug: homepage
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | jest 30.x + @testing-library/react |
| **Config file** | jest.config.js (exists from Phase 1) |
| **Quick run command** | `pnpm test --bail` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~15 seconds |

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
| 2-01-01 | 01 | 1 | HOME-01 | unit | `pnpm test -- --testPathPattern=Homepage` | ❌ W0 | ⬜ pending |
| 2-01-02 | 01 | 1 | HOME-02 | unit | `pnpm test -- --testPathPattern=BreakingNews` | ❌ W0 | ⬜ pending |
| 2-01-03 | 01 | 1 | HOME-03 | unit | `pnpm test -- --testPathPattern=Ticker` | ❌ W0 | ⬜ pending |
| 2-02-01 | 02 | 2 | HOME-04 | unit | `pnpm test -- --testPathPattern=AutoRefresh` | ❌ W0 | ⬜ pending |
| 2-02-02 | 02 | 2 | HOME-05 | unit | `pnpm test -- --testPathPattern=AdSlot` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/Homepage.test.tsx` — 3-column layout rendering
- [ ] `src/__tests__/BreakingNews.test.tsx` — headline format verification
- [ ] `src/__tests__/Ticker.test.tsx` — sidebar dimensions
- [ ] `src/__tests__/AutoRefresh.test.tsx` — timer setup verification
- [ ] `src/__tests__/AdSlot.test.tsx` — placeholder slot rendering

*Test stubs should be created as part of the first plan task.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 3-column layout renders at exact widths | HOME-01 | Visual pixel verification | Open localhost:3000, inspect table widths |
| Red timestamp + navy headline styling | HOME-02 | Color rendering check | Verify computed styles in DevTools |
| Ticker scrolls vertically | HOME-03 | Overflow behavior | Scroll the left sidebar div |
| Auto-refresh fires network request | HOME-04 | Timer + network behavior | Wait 13 min or reduce interval, check Network tab |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
