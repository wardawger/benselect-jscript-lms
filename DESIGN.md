---
name: BenSelect LMS
description: Self-paced certification course for BenSelect JScript in Selerix
colors:
  primary: "#2A6EBB"
  accent: "#4A9FD4"
  pale-blue: "#EBF4FB"
  navy: "#0B1829"
  navy-mid: "#112240"
  navy-card: "#162B45"
  navy-border: "#1E3A5F"
  body-text: "#3A5068"
  neutral-bg: "#F4F7FB"
  surface: "#FFFFFF"
  surface-alt: "#F8FAFC"
  muted-ink: "#7A9BB8"
  border: "#E2ECF5"
  border-light: "#E8F0F8"
  border-input: "#D0DEF0"
  success: "#28A87C"
  warning: "#F5A623"
  danger: "#E84C4C"
  track-1: "#007AFF"
  track-1-pale: "#E1F0FF"
  track-2: "#F59E0B"
  track-3: "#10B981"
  exam: "#EF4444"
typography:
  display:
    fontFamily: "Roboto, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Roboto, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "normal"
  title:
    fontFamily: "Roboto, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Roboto, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Roboto, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.04em"
  mono:
    fontFamily: "Roboto Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "#1e5a9e"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.pale-blue}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  nav-item-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
  nav-item-default:
    backgroundColor: "transparent"
    textColor: "rgba(255,255,255,0.7)"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  code-block:
    backgroundColor: "{colors.navy}"
    textColor: "#B8D4EC"
    rounded: "{rounded.lg}"
    padding: "16px 20px"
---

# Design System: BenSelect LMS

## 1. Overview

**Creative North Star: "The Certification Track"**

This is a professional learning tool built for consultants who need to move fast and leave with real skills. The visual system is guided, encouraging, and milestone-focused — warm enough to feel human, precise enough to feel like a serious product. Every screen should communicate: *you are making progress, this is well-organized, and the next step is clear.*

The palette pairs a cool navy sidebar (the structure that holds everything) with a bright, confident blue accent (the signal that marks progress and action) against a whisper-tinted neutral background. White content cards float on that background, separating concern without using shadows. Color is the primary depth signal; shadows are reserved for modals and overlays.

Typography is single-family (Roboto), differentiated by weight and size. Roboto Mono carries all code — it is treated as a first-class visual element, not an afterthought. Code blocks get full dark backgrounds and comfortable line-height because reading code in this course is a primary task.

This system explicitly rejects the bloated, overly-formal enterprise training portal feel (Cornerstone, SAP SuccessFactors) and the dated academic LMS aesthetic (Canvas, Blackboard). It should never feel like mandatory compliance training.

**Key Characteristics:**
- Tonal layering without shadows — depth through background color, not elevation
- Track colors as a navigation signal — four module tracks each have a named accent
- Code as a first-class surface — dark code blocks with generous spacing and monospace hierarchy
- Progress as ambient information — completion rings, progress bars, and scores are always visible but never demanding
- Sidebar as the backbone — the deep navy sidebar is persistent, confident, and never cluttered

## 2. Colors: The Track Palette

A cool, structured palette built on a single blue primary with a deep navy structural anchor. Four track accent colors provide wayfinding across the curriculum without competing with the core palette.

### Primary
- **Selerix Blue** (`#2A6EBB`): The core action and brand color. Used for interactive elements, active states, sidebar active pills, progress indicators, and primary buttons. Mid-depth blue — authoritative without being heavy.
- **Sky Accent** (`#4A9FD4`): The secondary blue used for hover states, focus rings, info callout borders, code breakdown labels, and inline code text. Lighter and more approachable than primary.

### Secondary
- **Pale Blue** (`#EBF4FB`): Secondary button backgrounds, section tints, badge backgrounds. The lightest blue in the ramp — used to create breathing room without introducing a new hue.
- **Track 1 Pale** (`#E1F0FF`): Track 1-specific tint background. Closely related to Pale Blue but reserved for Track 1 wayfinding surfaces only.

### Tertiary (Track Colors)
Four track colors provide consistent wayfinding across modules. Use exclusively for track headers, module card hover bars, and the track progress bars on the dashboard.
- **Track 1 — Language** (`#007AFF`): Bright sky blue.
- **Track 2 — Architecture** (`#F59E0B`): Amber. Only warm color in the system.
- **Track 3 — Patterns** (`#10B981`): Emerald.
- **Exam** (`#EF4444`): Red. Reserved exclusively for the certification exam module.

### Neutral
- **Ink Navy** (`#0B1829`): Sidebar background, page headings, module header cards, inline SVG fills. The structurally dominant dark value.
- **Navy Mid** (`#112240`): Secondary dark surfaces — sidebar hover backgrounds.
- **Navy Card** (`#162B45`): Interior surfaces of dark-mode cards and the script editor's dark pane.
- **Navy Border** (`#1E3A5F`): Borders and dividers on dark surfaces (sidebar border, editor panel dividers).
- **Body Text** (`#3A5068`): All prose on white backgrounds — lesson content, exercise descriptions, tooltips. Softer than Ink Navy; maintains ≥4.5:1 against white.
- **Page Tint** (`#F4F7FB`): The page canvas — a barely-blue near-white that keeps the palette coherent.
- **Surface White** (`#FFFFFF`): All content cards and content areas. Floats above the page tint.
- **Surface Alt** (`#F8FAFC`): Section headers inside cards, table headers, alternating row backgrounds. Slightly warmer than Page Tint; used for intra-card hierarchy.
- **Muted Slate** (`#7A9BB8`): Captions, placeholder text, secondary meta-labels. Verify 4.5:1 contrast before use on white — it sits near the boundary.
- **Border Ice** (`#E2ECF5`): Card borders, main dividers. Barely visible; structure without weight.
- **Border Light** (`#E8F0F8`): Subtler dividers inside cards — history modal rows, table row separators.
- **Border Input** (`#D0DEF0`): Form control strokes at rest. Shifts to Sky Accent (`#4A9FD4`) on focus.

### Semantic
- **Success** (`#28A87C`): Correct answers, completed state indicators, "Copied!" copy-button feedback, outcome boxes.
- **Warning** (`#F5A623`): Warning callout borders and icons. Amber — shares hue with Track 2 intentionally.
- **Danger** (`#E84C4C`): Incorrect answers, error states. Shares hue with Exam track intentionally.

### Named Rules
**The One Blue Rule.** The primary blue (`#2A6EBB`) is the only color that marks an actionable or selected state. Sky Accent (`#4A9FD4`) is informational and focus-ring only. Never use track colors for interactive states outside their own track header.

**The Track Fence Rule.** Track colors (`#007AFF`, `#F59E0B`, `#10B981`, `#EF4444`) are used exclusively for module-track identification surfaces. They must not appear on buttons, navigation pills, or progress indicators that apply globally across all tracks.

**The Border Ladder Rule.** Three border tokens, three use-cases: `#E2ECF5` for card/container edges, `#E8F0F8` for dividers inside cards, `#D0DEF0` for form input strokes. Do not introduce a fourth border color.

## 3. Typography: Roboto in Two Registers

**Display/Body Font:** Roboto (with ui-sans-serif, system-ui, sans-serif fallbacks)
**Code Font:** Roboto Mono (with ui-monospace, monospace fallbacks)

**Character:** Roboto's geometric clarity makes dense technical content scannable. Used alone in two registers — humanist proportions at body size, monospace sibling for code — the pairing reads as a coherent system, not a default stack. The lack of decorative type is deliberate: the code examples are the content; the type around them should be invisible.

### Hierarchy
- **Display** (700 weight, 1.5rem, line-height 1.2, letter-spacing −0.01em): Module titles in the lesson header card. White on dark navy background only.
- **Headline** (700 weight, 1.125rem, line-height 1.35): Section card headings inside lessons. Ink Navy on white.
- **Title** (600 weight, 1rem, line-height 1.4): Card headers, sidebar item labels, quiz question text.
- **Body** (400 weight, 0.875rem / 14px, line-height 1.6): All prose content and lesson explanations. Color: Body Text (`#3A5068`) on white backgrounds for slightly softer reading; Ink Navy (`#0B1829`) for structural labels. Max line length 65–75ch.
- **Label** (500 weight, 0.75rem, letter-spacing 0.04em, uppercase): Section tags, status badges, breakdown titles, track labels. Uppercase only for labels; never for body copy.
- **Mono** (Roboto Mono, 400 weight, 0.8125rem, line-height 1.75): All code blocks, inline code spans, IntelliSense dropdown, code breakdown line numbers, history modal version labels.

### Named Rules
**The Code-First Rule.** Code blocks receive full dark-background treatment at all sizes — never inline styled as prose. Roboto Mono must always be used for code; system monospace is an unacceptable fallback in the rendered UI.

**The Uppercase Ceiling.** Uppercase text is permitted only for Label-role elements (badges, breakdown titles, track labels). Never use uppercase for headings, body copy, or button labels.

## 4. Elevation

This system is flat by default with tonal layering. Depth is expressed through background color differences, not shadows. The four-level stack:

1. **Page** — `#F4F7FB` (blue-tinted near-white canvas)
2. **Surface** — `#FFFFFF` (content cards sitting above the canvas)
3. **Surface Alt** — `#F8FAFC` (section headers and table rows inside cards)
4. **Sidebar** — `#0B1829` (deep navy, the structurally dominant layer)

No `box-shadow` on cards or content surfaces. Borders (`#E2ECF5`, 1px) provide delineation where needed.

### Shadow Vocabulary
- **Modal / Overlay only:** `0 8px 32px rgba(11,24,41,0.18)` — the IntelliSense dropdown, editor modal, history modal, and any dialog. Reserved for floating UI that must break out of the document flow.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. The single permitted shadow (`0 8px 32px rgba(11,24,41,0.18)`) is only for elements that genuinely float above the content layer (dropdowns, modals, tooltips). Using shadows on cards or section dividers is prohibited.

## 5. Components

### Buttons
Rounded and approachable — slightly more generous corners and padding than a "tool" UI, but still precise.
- **Shape:** Gently curved (8px radius)
- **Primary:** Selerix Blue (`#2A6EBB`) background, white text, `10px 20px` padding, 500 weight. Hover: darken to `#1e5a9e`. No border, no shadow.
- **Secondary:** Pale Blue (`#EBF4FB`) background, Selerix Blue text. Same radius and padding. Used for secondary actions (e.g. "View Solution", "Reset").
- **Destructive / Warning:** Danger Red or Warning Amber background; white text. Reserved for reset and error-state actions.
- **Focus:** 2px solid `#4A9FD4` outline offset 2px. Never color-only.

### Cards / Containers
- **Corner Style:** Gently curved (12px radius)
- **Background:** White (`#FFFFFF`) on Page Tint (`#F4F7FB`)
- **Shadow Strategy:** None. Flat with 1px `#E2ECF5` border.
- **Internal Padding:** 24px standard; 16px for dense content cards (lesson section cards, quiz answer blocks)
- **Section Headers inside cards:** Surface Alt (`#F8FAFC`) background, `#E8F0F8` bottom border. Used to separate header from body inside the same card.
- **Module Header Card:** Dark navy (`#0B1829`) background, track-color bottom strip (4px), decorative SVG pattern overlay at 0.18 opacity. White text only. This is the only card with background color.

### Navigation (Sidebar)
- **Background:** Ink Navy (`#0B1829`)
- **Section labels (NAVIGATION, TRACK 1, etc.):** White at 50% opacity, 9px uppercase tracked
- **Default item:** White at 70% opacity, transparent background; 2-line `line-clamp-2` wrapping (no hard char truncation)
- **Active item:** White text, Selerix Blue (`#2A6EBB`) pill background, 8px radius
- **Hover item:** White at 100%, subtle `rgba(255,255,255,0.05)` background
- **Completed item:** Emerald (`#10B981`) at 80% — `emerald-300` equivalent
- **Locked item:** White at 35% opacity, `cursor-not-allowed`
- **Status icons:** Completed = `IcCheckCircle` emerald-400, Locked = `IcLock` white/20, Available = `IcChevronRight` sky-blue
- **Footer labels:** White at 55% opacity; score stat at 50%
- **Footer progress bar:** Selerix Blue fill on white/10 track

### Inputs / Code Editors
- **Form inputs (login modal):** White background, 1.5px `#D0DEF0` border at rest, focus shifts to Sky Accent (`#4A9FD4`) with subtle ring. 14px text, `#0B1829` color.
- **Quiz/Exercise script editor:** Modal-based; white background, dark ink text, contained inside a `bg-[#F0F0F0]` toolbar chrome. Separate from the dark code-block display.
- **IntelliSense dropdown:** White background, `#D0DEF0` border, 12px radius, `0 8px 32px rgba(11,24,41,0.18)` shadow. Fixed position to escape scroll containers.

### Lesson Callout Boxes
Three named callout variants with floated SVG icon:
- **Warn Box:** Amber gradient background, amber left border, `#7A5200` text.
- **Info Box:** Blue gradient background, sky-accent left border, Selerix Blue text.
- **Outcome Box:** Emerald gradient background, success left border, dark green text.

### Code Blocks
A first-class visual element, not a utility.
- **Background:** Ink Navy (`#0B1829`), 12px radius, `1rem 1.25rem` padding
- **Text:** `#B8D4EC` (desaturated sky blue — readable but clearly "code")
- **Copy Code button:** Appears top-right on hover. `rgba(255,255,255,0.06)` background, `rgba(184,212,236,0.7)` text. On copy success: transitions to Success green.
- **Keywords:** `#7EB3F7` (bright blue)
- **Comments:** `#4A6880` (muted slate, italic)
- **Inline code:** White background, Selerix Blue text, 4px radius, 1px `#C8DFF0` border
- **Line height:** 1.75 — generous, because this is a teaching context

### Script Editor (BenSelectScriptEditor)
The practice/quiz coding environment. Has two modes:
- **Lesson mode ("Practice Exercise"):** Green badge, no grading score. After saving, shows "Check My Answer →" button. Results show per-criterion pass/fail with human-readable feedback; no bonus-points language.
- **Quiz mode ("Coding Challenge +0–2 bonus pts"):** Blue badge. After saving, shows "Submit for Grading →" button. Results show bonus points earned and criteria breakdown.
- **Both modes:** After grading, "View solution" toggle reveals the reference implementation in a navy code block with explanation panel.

### Progress Indicators
- **Radial SVG ring:** Used on the dashboard hero. Selerix Blue stroke on `#e1f0ff` track.
- **Linear bars:** Used for per-track progress and sidebar footer. Selerix Blue fill.
- **Score badges:** White text on status color (success/warning/danger) with 9999px radius (pill).

## 6. Do's and Don'ts

### Do:
- **Do** use `#2A6EBB` (Selerix Blue) as the sole signal for actionable and selected states globally.
- **Do** use `#3A5068` (Body Text) for all prose on white backgrounds. Reserve `#0B1829` for structural elements (headings, sidebar, header cards).
- **Do** keep all code in Roboto Mono with full dark-background treatment — never styled as prose.
- **Do** use the Page Tint (`#F4F7FB`) as the canvas and white as the content surface. Flat layering only.
- **Do** use Surface Alt (`#F8FAFC`) for section headers and table rows inside cards — not as a card background.
- **Do** include a visible progress signal on every dashboard view — completion rings, progress bars, and score badges are core affordances, not decoration.
- **Do** use 8px radius on interactive elements (buttons, inputs) and 12px on content cards.
- **Do** follow the Border Ladder: `#E2ECF5` for card edges, `#E8F0F8` for intra-card dividers, `#D0DEF0` for input strokes.
- **Do** keep track colors (`#007AFF`, `#F59E0B`, `#10B981`, `#EF4444`) confined to module-track identification surfaces only.
- **Do** respect `prefers-reduced-motion` — every transition must have a zero-duration fallback.
- **Do** use `line-clamp-2` on sidebar module titles — never hard character truncation.

### Don't:
- **Don't** use `box-shadow` on cards, section dividers, or content surfaces. Shadows are reserved for floating UI (dropdowns, modals) only.
- **Don't** use gradient text (`background-clip: text`). Single solid colors only.
- **Don't** apply `border-left` greater than 1px as a decorative stripe on cards or list items. Callout boxes use left borders intentionally; do not extend this pattern to general cards or inputs.
- **Don't** design anything that resembles a corporate training portal (Cornerstone, SAP SuccessFactors) — no bloated sidebars, no institutional gray, no overly-formal content hierarchy.
- **Don't** design anything that resembles a heavy academic LMS (Canvas, Blackboard) — no cluttered nav, no academic formality, no dated enterprise components.
- **Don't** use uppercase text outside Label-role elements. Headings, body copy, and buttons are sentence case.
- **Don't** use `border-radius` above 16px on cards or containers. Pill radius (9999px) is permitted only for tags, badges, and small chips.
- **Don't** use track colors on interactive elements outside their own module track header context. They are wayfinding signals, not a general action palette.
- **Don't** add decorative SVG patterns, gradients, or illustration to any surface other than the module header card where they are intentional.
- **Don't** use `#7A9BB8` (Muted Slate) for body prose — use `#3A5068` (Body Text) instead. Muted Slate is for captions, placeholders, and secondary meta only.
