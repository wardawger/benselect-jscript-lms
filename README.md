# JScript in Selerix BenSelect — LMS

A fully self-contained Learning Management System for JScript scripting inside Selerix BenSelect.

## What's inside

- **14 modules** across 3 tracks: Language Foundation, BenSelect Architecture, Applied JScript
- **Instructional videos** embedded in Module 1 (more modules can be added)
- **Coding challenges** on every lesson with hints, scoring, and model solutions
- **Quiz coding exercises** on every module quiz (+2 bonus points)
- **IntelliSense** autocomplete for BenSelect APIs in all code editors
- **Glossary & Index** with 90+ searchable definitions
- **User login** with progress persistence via localStorage
- **Admin panel** (first account created is admin)
- **Final certification exam** — MC, code reading, and code writing

## Repository structure

```
your-repo/
├── index.html          ← The entire LMS app (single file)
├── README.md           ← This file
└── videos/
    └── module1_intro.mp4   ← Module 1 instructional video
```

**Important:** The `videos/` folder must sit alongside `index.html` at the repo root. The video player in Module 1 loads from `videos/module1_intro.mp4` as a relative path.

## Deploy to GitHub Pages

1. Create a new GitHub repository (Public)
2. Upload `index.html` and `README.md` to the repo root
3. Create a `videos/` folder in the repo and upload `module1_intro.mp4` into it
4. Go to **Settings → Pages → Source: Deploy from branch → main → / (root)**
5. Save — live at `https://<username>.github.io/<repo-name>/` in ~60 seconds

## Adding more videos

To add videos to other modules, upload the video file to the `videos/` folder in your repo, then open `index.html` and find the lesson content for that module inside `const LESSONS = { ... }`. Add the following HTML at the start of the lesson string, adjusting the filename and title:

```html
<div class="lesson-video-wrap">
  <div class="lesson-video-header">
    <div class="lesson-video-icon">▶</div>
    <div>
      <div class="lesson-video-title">Module N — Title Here</div>
      <div class="lesson-video-sub">Watch before reading</div>
    </div>
  </div>
  <video controls preload="metadata">
    <source src="videos/moduleN_filename.mp4" type="video/mp4">
  </video>
  <div class="lesson-video-footer">moduleN_filename.mp4</div>
</div>
```

## Notes

- All user data (accounts, progress) is stored in the browser's `localStorage` — it does not leave the device
- The first account created automatically becomes Admin
- Progress does not sync between devices or browsers
- Works fully offline after initial load (Google Fonts requires internet on first visit; videos stream from GitHub)
