lobatools

lobatools.com is Julianne's personal site of interactive tools for recruiters, hiring managers and developers. The site looks like a 
desktop (macOS/Ubuntu inspired): each tool is an app in a dock that opens as a window. lobatools itself is meant to be her reference 
project, so engineering quality matters more than feature count.

Personal portfolio and blog live elsewhere (julobato.com). Anything people only read (blog posts, recommendation letter, "things I got 
wrong") belongs there, not here. lobatools is for things people use.

Repo
GitHub org: lobatools, main repo: lobatools/lobatools (monorepo)
Org profile README: lobatools/.github → profile/README.md
lobatools/
├── profile/      # profile YAML + Pydantic loader (single source of truth)
├── job_match/    # Flask app, POST /match
├── mcp/          # MCP server (official Python SDK, HTTP transport)
├── api/          # later: read-only public API + playground
└── web/          # desktop frontend
Build order
Profile — YAML file + module that loads and validates it with Pydantic. Shared by every tool. Do this cleanly first.
Job Match
MCP server
API Playground — later; read-only, small, built very cleanly.
Stack
Python, Flask (chosen over Kotlin/Spring and Django: simpler, fast to build and maintain alone)
APIFlask for OpenAPI + validation when building the API
No database for the profile: YAML is validated and loaded into memory at startup (Job Match, MCP and /v1 all read from memory)
No PostgreSQL for now; only if an optional writable sandbox is ever added
gunicorn 1 worker + threads so in-memory rate limiting (Flask-Limiter) stays correct; Cloudflare in front (hides the server IP, absorbs 
floods, Turnstile)
OpenTelemetry for tracing (API phase)
Deploy: VPS + Docker Compose + Caddy (reverse proxy with automatic HTTPS; nginx would also work)
No Redis, Kafka, microservices or Kubernetes unless there is a real technical reason — and document why not
Profile (source of truth)
Versioned YAML in git: experience, skills, education, languages, preferences, availability, recommendation quotes (from a public LinkedIn 
recommendation, with link).
Skills link to the experiences where they were used.
Preferences include deal-breakers: no C++/embedded roles, no pure management roles.
Tools never expose the raw YAML. Each tool returns only the slice it needs.
Job Match

Recruiter pastes a job description → gets an honest fit result written in first person.

Flow:

Frontend sends POST /match with the job text + Cloudflare Turnstile token.
Server checks before spending money: Turnstile, rate limit, text size limits, cache (hash of normalized job text).
Server builds the request: fixed instructions (first person as Julianne, only facts from the profile, never invent, be honest about gaps, 
respect deal-breakers, say so if it's not a job description) + profile + job text clearly marked as untrusted data.
Model (Claude Haiku, low temperature, capped max tokens) returns structured JSON only:
json
{
  "is_job_description": true,
  "role": "",
  "company": "",
  "fit": "good | partial | not_a_fit",
  "fit_score": 3,
  "summary": "",
  "what_i_bring": [],
  "still_learning": [],
  "ask_me_about": []
}
Validate with Pydantic; retry once; on second failure show a friendly "email me" message. Cache result.
Frontend renders the chosen design.

Other guardrails: API key server-side only, monthly spend cap, small eval set of real job descriptions to check output quality.

Result states (designs exist): good fit, partial fit, not the right fit (deal-breakers), not a job description, loading, mobile.

MCP server

Read-only tools for AI agents, reading the same profile module: get_profile, get_experience, get_skills, list_posts, get_post, 
check_match (reuses Job Match service, own rate limit), get_contact.

API Playground (later)

Keep it very simple and very clean: a small read-only API done right beats a big one with rough edges. Framed as "Explore my API" (people 
can still try to break it with bad input).

Domain is the profile itself (no fake business system).
/v1/... read-only, served from memory (no database): profile, experiences, skills (with where/since used and evidence), graph, 
availability.
Quality bar: consistent naming, OpenAPI that matches reality, problem+json errors everywhere, correct status codes (400/404/422/429, 
never 500), cursor pagination, ETag/304, limits on every parameter, rate limit, tests.
Real traces via OpenTelemetry, sanitized by allowlist (span names, durations, status). Diagram nodes light up from the real trace.
Each component links to a short decision note (ADR): decision, alternatives, trade-offs (e.g. why no database, why no Redis, Caddy vs 
nginx, 1 gunicorn worker).
Guided tour for non-technical visitors.
Optional, much later: a writable per-visitor sandbox. Only then add Postgres (transactions, optimistic locking with If-Match → 412), in 
a separate container with resource limits.
No opportunities/reverse-application endpoint (dropped).
Design
Desktop metaphor with dock and windows.
Colours: brand orange #EC6B43 (logo, app icons, the one main action per screen, small highlights — an accent, never the background mood). 
Ink #17171A for text, toggles and secondary buttons. Paper #FFFFFF windows, Mist #F1F2F4 title bars and surfaces, Post-it #FFE066 sticky 
notes, Aubergine #2B1630 default wallpaper. No cream/beige backgrounds (too close to Claude's look). White text on #EC6B43 is only ~3.1:1 
contrast: use it for large bold text only; small text on orange should be ink.
Fonts: Hanken Grotesk for all UI and text, Caveat for handwritten accents (e.g. "honest, I promise"), system monospace (ui-monospace, 
SFMono-Regular, Menlo, monospace) for code. All from Google Fonts.
Tool UI uses a "notes" style: sticky-note cards with slight rotation and tape, handwritten accents in Caveat, first-person voice. Avoid 
the generic "AI product" look.
Job Match result layout (chosen): header with role · company, fit label + 4 bars, then cards "What I'd bring", "Where I'd still be 
learning", "You might want to ask me", footer "Sounds interesting? Let's talk."
Mobile: home screen shows the "lobatools" header with the wolf, tool icons, the hello note and a dock (Home, Settings). Text files (readme.txt, why-a-wolf.txt) are file icons on the desktop and live in the Notes app on mobile (breadcrumb wolf / Notes / file). An open app is 
full screen with no dock and a breadcrumb top bar: wolf + "lobatools" (muted, tappable → home) / app icon + app name (bold). Each app 
has its own URL (e.g. /job-match) so the phone's back gesture and the browser back button also go home.
App icons: rounded squares, white line icons on colour (Job Match, MCP Server, Explore my API); readme.txt, why-a-wolf.txt and Notes are a page icon on slate; Home 
is the dark wolf on cream.
Site language: English.
Code style
No explanatory comments — code should speak for itself.
Always reuse existing functions and types instead of creating new ones.
Strong typing; always follow the implementation patterns already in the codebase.
UI strings in Portuguese use Brazilian Portuguese (PT-BR) conventions.

Frontend
For any work in web/, load the web skill first (.claude/skills/web/SKILL.md): folder layout, component patterns, palette tokens, tests and CI rules.
