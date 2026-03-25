---
phase: 4
slug: thread-page
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 4 — Validation Strategy

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | jest 30.x + @testing-library/react |
| **Config file** | jest.config.js (exists from Phase 1) |
| **Quick run command** | `pnpm test --bail` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~15 seconds |

## Sampling Rate

- **After every task commit:** Run `pnpm test --bail`
- **After every plan wave:** Run `pnpm test`
- **Max feedback latency:** 15 seconds

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 4-01-01 | 01 | 1 | All THRD | seed | `pnpm test -- --testPathPattern=thread-seed` | ⬜ pending |
| 4-01-02 | 01 | 1 | All THRD | stubs | `pnpm test --passWithNoTests` | ⬜ pending |
| 4-02-01 | 02 | 2 | THRD-08 | unit | `pnpm test -- --testPathPattern=ThreadBreadcrumb` | ⬜ pending |
| 4-02-02 | 02 | 2 | THRD-01,02 | unit | `pnpm test -- --testPathPattern=OriginalPostBlock` | ⬜ pending |
| 4-02-03 | 02 | 2 | THRD-03 | unit | `pnpm test -- --testPathPattern=ActionButtons` | ⬜ pending |
| 4-03-01 | 03 | 2 | THRD-04,05,06 | unit | `pnpm test -- --testPathPattern=ReplyTree` | ⬜ pending |
| 4-03-02 | 03 | 2 | THRD-07 | unit | `pnpm test -- --testPathPattern=QuickReplyForm` | ⬜ pending |
| 4-04-01 | 04 | 3 | THRD-07 | integration | `pnpm test -- --testPathPattern=ThreadPageClient` | ⬜ pending |
| 4-04-02 | 04 | 3 | All THRD | build | `pnpm build` | ⬜ pending |

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Star rating SVGs render correctly | THRD-01 | Visual rendering | Check star icons in DevTools |
| Reply indentation visual spacing | THRD-05 | Pixel alignment | Inspect nested reply rows |
| Breadcrumb navigation works | THRD-08 | Route navigation | Click breadcrumb links |

## Validation Sign-Off

- [ ] All tasks have automated verify
- [ ] Sampling continuity maintained
- [ ] Wave 0 covers all test stubs
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
