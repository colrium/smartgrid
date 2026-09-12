# FULL MIGRATION PLAN (temp working file — DELETE at task end)

## Goal
Migrate every section component to the shared type components, and tag every
first-level locale section key with `"type"` (en + sw, values copied verbatim).

## Shared components state
Built — src/components/sections/shared/: SectionShell, CardGrid, Gallery, Faq,
Split, Cta (+ root files CtaBand.tsx, FinalCta.tsx, CtaPill.tsx,
IntroTextSection.tsx). UI: src/components/ui/Card/index.tsx.
TO BUILD: shared/Process/index.tsx (layout: "grid" | "timeline"),
shared/Stats/index.tsx (metric band).

## Working rules
- Every response that edits batch files ALSO updates the checkboxes below
  (independent editor calls, same response).
- Batches stay small (≤8 files) so a compaction loses at most one batch.
- Locale `"type"` values: copy verbatim across en/sw; never translate.
- Taxonomy: hero, intro, split, card-grid, gallery-grid, gallery-masonry,
  gallery-slider, faq, process, stats, tabs, pricing, logos, deliverables,
  cta, cta-closing, globe, contact, unique.
- Verify with output redirect files (terminal capture is unreliable):
  cmd /c "npm run typecheck > typecheck-report.txt 2>&1" then read the file.
  Same pattern for lint. Build SKIPPED (dev server occupies .next).

## Batches
- [x] B0 re-read inventory + shared APIs + cluster representatives
- [x] B1 build shared/Process + shared/Stats + export from shared/index.ts
- [ ] B2 migrate Process/Workflow/Timeline family (batch1 done: agri-ndvi, as-built, building-site; remaining: civil-landing, sectional Process+Timeline, surveying-landing, careers, solar, cadastral, bathymetric, aerial-workflow, root WorkflowSection, resource-mapping)
- [ ] B3 migrate Stats/Metrics family
- [ ] B4 migrate remaining uniform card-grid family
- [ ] B5 migrate Cta-family wrappers
- [ ] B6 migrate Faq-family wrappers
- [ ] B7 tag en locale section keys (all namespaces)
- [ ] B8 tag sw locale section keys (verbatim mirror)
- [ ] B9 typecheck + lint via redirect files; fix all issues
- [ ] B10 delete temp files (MIGRATION-PLAN.md, inventory-*.txt, *-report.txt)

## Progress notes
- B0 done: reps = grid Process (agricultural-ndvi, sectional), timeline Process
  (as-built), Workflow (resource-mapping), Timeline (sectional), Metrics band
  (as-built), WhyUse card grid (as-built), CtaSection (as-built),
  SectionalFaqSection (sectional-properties).
- B1 done: shared/Process (grid|timeline + phaseStyles/outcome/note) and
  shared/Stats (band|cards) created; barrel exports added; SectionShell width
  prop added. NOTE: Process file was recreated TWICE after compactions —
  verified on disk this time (grid cards + alternating timeline).
- B1 v2: Process rewritten faithful to reps — grid = numbered badge cards
  (as-built style), timeline = centre line + node dots + alternating offset
  cards + phase chips {chip,icon} + "Step NN" + outcome/ctaNote/cta footer
  (Workflow/sectional style). phaseStyles is now Record<string,{chip,icon}>.
  Barrel exports ProcessPhaseStyle + ProcessCta. Default tone: timeline=surface,
  grid=default.
- B1 v3 (final): Process completed on disk — Link import, ProcessPhaseStyle/
  ProcessCta types, outcome/ctaNote/cta props, styleFor/phaseChip (icon-aware),
  gridCard, timelineItem, shared footerNode used by BOTH layouts; timeline
  footer inline copy replaced; `list.map` refs fixed to `items.map`. File is
  now self-consistent and compile-ready. NEXT: B2 migration batch 1.
