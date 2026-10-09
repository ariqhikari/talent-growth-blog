'use strict';

/**
 * Seed Data Definitions
 * 
 * All copy written to anti-AI-slop standards:
 * - Specific, grounded, friction-inclusive
 * - No corporate cheerleading
 * - Real numbers, real names, real tradeoffs
 * - Varied sentence structure, no uniform parataxis
 */

// ─── USERS ──────────────────────────────────────────────────────────────────

const USERS = [
  {
    name: 'Elena Rostova',
    email: 'elena@talentgrowth.dev',
    password: 'Password123!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    bio: "Systems engineer focused on distributed storage and Postgres query planning. Previously built telemetry pipelines at a mid-sized observability company. I write mostly when something breaks in a way I didn't expect.",
  },
  {
    name: 'Marcus Chen',
    email: 'marcus@talentgrowth.dev',
    password: 'Password123!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    bio: "Design systems lead. Obsessed with typography, tactile web interfaces, and whether a button feels pressed or just changes color. Five years of wrestling component libraries into submission.",
  },
  {
    name: 'Aria Tanaka',
    email: 'aria@talentgrowth.dev',
    password: 'Password123!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
    bio: "Infrastructure architect and Kubernetes grudging admirer. Keeping high-throughput Node.js services alive during sale events without paging anyone at 2am — that's the actual job.",
  },
  {
    name: 'Devon Miller',
    email: 'devon@talentgrowth.dev',
    password: 'Password123!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    bio: "Engineering manager who codes on Fridays to stay sane. Writing about team sizing, on-call rotations that don't destroy morale, and how to run a meaningful 1:1 when you have eight of them in a week.",
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah@talentgrowth.dev',
    password: 'Password123!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    bio: "Frontend engineer building accessible, fast interfaces. Heavy Tailwind user, recovering CSS-in-JS veteran, and TypeScript convert after spending six months debugging a large JavaScript codebase.",
  },
];

// ─── POSTS ──────────────────────────────────────────────────────────────────

const POSTS = [
  // ─────────────────────────────────────────── POST 1 (Elena, Engineering)
  {
    authorEmail: 'elena@talentgrowth.dev',
    category: 'Engineering',
    title: 'Why We Migrated from Raw SQL Strings to a Typed Repository Layer',
    content: `We had a problem that snuck up slowly over two years: every developer on the team had a slightly different mental model of which database queries were safe, and nobody could tell you at a glance whether a particular endpoint was protected against injection. Not because we were careless. Because raw SQL strings embedded in controller code look fine until they don't.

The migration took six weeks and broke some things. Here's what actually happened.

## The Before State

Our Express controllers looked like this:

\`\`\`javascript
const { rows } = await pool.query(
  \`SELECT * FROM posts WHERE category = '\${req.query.category}' LIMIT 20\`
);
\`\`\`

Yes, that's a direct string interpolation on a user-supplied query parameter. It worked in dev, it worked in staging, and it worked in production for 18 months because no one noticed or tried. When we eventually ran a security audit, the auditor highlighted 14 endpoints with identical patterns inside 20 minutes. Fourteen.

## What a Repository Layer Actually Does

The word "repository" intimidates people who haven't needed one yet. It's just a module that owns all the queries for a particular model — User, Post, Order, whatever. Nothing from outside that module can write raw SQL against that table. Everyone else calls functions like \`findByEmailWithPassword\` or \`updateById\`.

\`\`\`javascript
// repositories/postRepository.js
const findAll = async ({ category, page, limit }) => {
  const offset = (page - 1) * limit;
  
  const { rows, rowCount } = await pool.query(
    'SELECT id, title, excerpt, author_id, created_at FROM posts WHERE ($1::text IS NULL OR category = $1) ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [category || null, limit, offset]
  );

  return { posts: rows, total: rowCount };
};
\`\`\`

Parameterized queries. No interpolation. The database driver handles escaping. The controller no longer knows or cares what SQL looks like.

## The Migration

We didn't rewrite everything at once. We picked the five highest-risk endpoints (login, post creation, search, comment submission, and the user profile update) and repositorified those first. Ran the auditor's checklist again. Got eight endpoints flagged instead of fourteen. Then finished the rest in two-week batches while the product kept shipping.

One thing that slowed us down: our connection pool was instantiated in three different files. Consolidating it into \`src/config/database.js\` took a full day because of circular dependency issues we didn't anticipate. Not dramatic, just annoying.

## What Changed After

Code review got faster. When a PR touches database queries, reviewers go to one directory and scan one pattern. The PR that would've taken two hours of back-and-forth to review now takes twenty minutes. That's the real return on the abstraction investment — not architectural purity, just less time spent in review being uncertain.

The SQL injection surface is now effectively zero on the paths we control. Third-party integrations are a different story, but that's a separate post.

## What Didn't Change

Query performance. We had a brief panic mid-migration when a slow query showed up on our APM dashboard. It turned out to be a missing index on \`posts.category\` that had always been missing; we'd just never isolated that query enough to notice it. The repository layer didn't cause the slowness, it just made it visible. We added the index.

If you're sitting on raw SQL strings scattered through controller code, the migration isn't glamorous. It's a spreadsheet, some careful refactoring, and a pile of parameterized queries. But six weeks later you will not be staring at an audit report wondering how 14 things got through.`,
    daysAgo: 2,
  },

  // ─────────────────────────────────────────── POST 2 (Aria, Engineering)
  {
    authorEmail: 'aria@talentgrowth.dev',
    category: 'Engineering',
    title: 'Debugging a Stubborn 200ms Latency Spike in Vercel Serverless Functions',
    content: `Last month, our p99 response time on \`/api/posts\` climbed from 120ms to 320ms with no code change we could identify. Deployments were clean. MongoDB wasn't complaining. User complaints started on day four. Here's how we found it.

## First Hypothesis: Cold Starts

Serverless functions have cold starts. That's table stakes for anyone running on Lambda, Cloud Run, or Vercel. Our first hypothesis was that we'd crossed some traffic threshold where functions were spinning up more frequently. But the spike was consistent even on warm instances — you could reproduce it by hitting the endpoint ten times in five seconds and watching every response, not just the first.

Cold starts ruled out.

## Second Hypothesis: Database Connection Overhead

This one took longer to rule out because it felt more plausible. MongoDB connections don't persist between serverless invocations by default, so if your handler creates a new connection on every request, you're paying 60-120ms per request just for TCP handshake and TLS negotiation.

We had a connection caching pattern in place:

\`\`\`javascript
let cachedConnection = null;

module.exports = async (req, res) => {
  if (!cachedConnection) {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI);
  }
  return app(req, res);
};
\`\`\`

Looks fine. But we logged \`mongoose.connection.readyState\` on every request and found it returning \`0\` (disconnected) about 30% of the time despite the cache variable being set. The variable survived across warm invocations, but the underlying socket had been killed by MongoDB's idle connection timeout at 10 minutes.

The fix was checking \`readyState\` before trusting the cache:

\`\`\`javascript
const isConnected = () => mongoose.connection.readyState === 1;

module.exports = async (req, res) => {
  if (!isConnected()) {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  }
  return app(req, res);
};
\`\`\`

That cut our p99 from 320ms back to 140ms overnight. The remaining 20ms gap from our original baseline turned out to be a Vercel region routing change — our function was in \`iad1\` (US East) and our Atlas cluster was in \`ap-southeast-1\` (Singapore). We filed a support ticket, shifted the cluster region, and recovered those 20ms.

## What the Debugging Actually Looked Like

Two engineers, one Vercel log stream, one Atlas monitoring dashboard, one shared Notion doc tracking each hypothesis and its ruling. We spent two hours on cold starts before accepting the data. We spent one afternoon on the connection issue. The region lag took ten minutes to confirm once we thought to check it.

Total elapsed time from first alert to full resolution: four days. Most of that was waiting for enough traffic data to be certain about each ruling. The code changes themselves took maybe 45 minutes.

## Takeaways

If your serverless handler creates a database connection, verify the connection's readyState on every invocation rather than trusting that the cached object is still alive. It costs a single conditional and saves you a debugging spiral.

And check whether your compute region and your database region are geographically close. It sounds obvious. We somehow forgot to confirm it when we migrated to Atlas.`,
    daysAgo: 5,
  },

  // ─────────────────────────────────────────── POST 3 (Marcus, Design)
  {
    authorEmail: 'marcus@talentgrowth.dev',
    category: 'Design',
    title: 'The Anatomy of Tactile UI: Depth, States, and Why Flat Design Isn\'t Dead',
    content: `There's a pattern I've noticed across most design system audits: buttons that change color on hover but don't move, inputs that turn blue when focused but don't change border weight, and modals that appear instantly with no positional transition whatsoever. Everything technically works. Nothing feels like it's there.

Tactile UI isn't about gradients or drop shadows — it's about making the interface respond as though it has physical weight and resistance. Here's how we think about it.

## The Eight States Problem

Most UI components ship with two states: default and hover, maybe a disabled. That's half the job. A production-grade interactive element needs eight:

| State | What it communicates |
| :--- | :--- |
| **Default** | Available, not doing anything |
| **Hover** | I've noticed you |
| **Focus-visible** | Keyboard navigation is here |
| **Active / pressed** | Physical depression, action in progress |
| **Disabled** | Unavailable, not broken |
| **Loading** | Waiting on async work |
| **Error** | Failed, here's why |
| **Success** | Done, confirmed |

The \`:active\` state is the most neglected. When someone clicks a button and it doesn't visually depress, even slightly, the interface feels disconnected — like pressing a key that doesn't go down. A 1px downward translate and a 10% darker background takes four lines of CSS and changes how the entire component feels under a cursor.

\`\`\`css
.btn {
  transition: background-color 150ms ease, transform 80ms ease, box-shadow 150ms ease;
}

.btn:hover {
  background-color: var(--color-accent-hover);
}

.btn:active,
.btn.is-active {
  transform: translateY(1px);
  box-shadow: none;
}

.btn:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
\`\`\`

The \`is-active\` class lets you simulate the state in Storybook or a preview page without waiting for an actual click event. Small thing, but it matters for documentation.

## The Typography Problem That Ruins Tactile Work

You can get the button states perfect and still have an interface that feels generic because the typographic hierarchy is flat. Display headings need to read differently from body copy not just in size but in texture. This means:

- Serif or high-contrast display face for headings, roman style, no italics
- A complementary grotesque or humanist sans-serif for body and labels
- Actual line-height discipline — 1.1 for display, 1.65 for running text
- A consistent measure (55–75 characters wide) for reading columns

We use Newsreader for our editorial headings: oldstyle figures, high optical contrast, uncompromisingly upright. Pairing it with Plus Jakarta Sans at the label weight creates enough visual tension that the hierarchy reads immediately. The pair took about two weeks of testing before we stopped second-guessing it.

## Depth Without Skeuomorphism

The fear after the flat design wave of 2013-2016 is that any depth signal looks dated. It doesn't, if the depth is functional rather than decorative. What we use:

- A 1px inset border on interactive containers (not a box-shadow that bleeds outward, a border that defines the edge)
- A subtle ambient shadow (\`0 4px 12px rgba(0,0,0,0.05)\`) on card components that lifts on hover
- A slightly lighter paper background (\`#FAFAF8\`) under the main content surface, with components sitting on \`#F4F4F0\`

None of these are visible if you're not looking. Together, they tell the user exactly where to look and what they can touch.

## The Contrast Failure Mode

One thing that kills tactile work faster than bad states: poor contrast on interactive indicators. WCAG AA requires 4.5:1 for normal text and 3:1 for large text, but those are floors. Hover states that achieve 3.2:1 on an input border — technically passing on large elements — are frequently invisible on physical displays under fluorescent lighting in open offices. We target 4.5:1 on all interactive feedback regardless of element size.

Run your focus ring color through WebAIM's contrast checker against both your default and hover background. Then test it on a slightly overexposed monitor. You'll find failures you missed on your calibrated display.`,
    daysAgo: 8,
  },

  // ─────────────────────────────────────────── POST 4 (Devon, Product)
  {
    authorEmail: 'devon@talentgrowth.dev',
    category: 'Product',
    title: 'How We Cut PR Review Turnaround from 52 Hours to Under 6 Hours',
    content: `We ran the numbers in January. The median time from opening a pull request to getting a first review on our main product repo was 52 hours. The median time to merge after approval was another 6 hours. Developers were opening PRs on Monday afternoon and merging on Wednesday. That's not a code quality problem; it's a coordination problem, and treating it like a code quality problem makes it worse.

Here's what we changed, in the order we changed it.

## We Capped PR Size at 400 Lines

This was the most controversial conversation we had. Engineers argued that complex features require large PRs, that breaking things up creates artificial commits, that reviewers should just read more carefully. All of those are defensible points. None of them changed the data: PRs over 400 lines received their first review 3.2 days after opening. PRs under 200 lines received first review in 14 hours.

Reviewers aren't lazy. They're busy. A 600-line PR requires context-switching budget that most engineers don't have mid-sprint. A 150-line PR can be reviewed in one sitting before lunch.

We didn't ban large PRs — we required a draft review conversation before opening one. Two weeks in, the number of large PRs dropped by 60% because engineers started planning their work differently to avoid the conversation.

## We Made Review an Explicit Calendar Block

Before the change, code review happened whenever someone had "free time." Free time in engineering is a lie. There is no free time; there's time between meetings, time at the end of a context-heavy session, and time while waiting for a build. That's what reviews were competing with.

We added two 45-minute "review blocks" to every engineer's calendar: one at 10am, one at 4pm. Not for their own PRs — for others'. During those windows, the expectation is that you're in GitHub, not in your own code. Reviews started landing within 2 hours of the 10am block because PRs opened the previous afternoon would get caught the following morning.

The calendar pressure is real. Some engineers pushed back. The turnaround numbers made the case better than any argument could.

## We Fixed the Review Feedback Pattern

Nitpicks and style comments accounted for roughly 35% of our review comments by volume, and they created blocking conversations on PRs that were substantively ready to merge. We introduced a simple prefix convention:

- \`nit:\` — Non-blocking style preference, author can ignore or address at will
- \`question:\` — Clarification request, not a change request
- \`blocker:\` — Must be resolved before merge
- \`suggestion:\` — Worthwhile but not required

Within one sprint cycle, authors stopped feeling like they needed to address every comment before requesting re-review. Reviewers stopped using nitpick-level comments as a reason to withhold approval. Both sides trusted the signal.

## Where We Are Now

Six months after the changes: median first review time is 5.4 hours, median time to merge post-approval is 3.1 hours. We deploy about 40% more frequently than we did in January. The changes didn't require any tooling beyond a shared Slack channel for PR announcements and a calendar block.

The thing I'd do differently: I'd have run the numbers first in January instead of after two months of debate. Data ends arguments faster than persuasion.`,
    daysAgo: 11,
  },

  // ─────────────────────────────────────────── POST 5 (Elena, Notes)
  {
    authorEmail: 'elena@talentgrowth.dev',
    category: 'Notes',
    title: 'Seven PostgreSQL Constraints That Prevented Data Corruption at Scale',
    content: `We run a Postgres cluster handling around 12 million rows in our primary orders table. Over the past year, six of the seven constraints I'm about to describe caught actual data integrity violations before they reached production reads. One of them caught a migration error during a 3am deployment that would have orphaned about 14,000 records.

These aren't exotic. They're the boring half of the Postgres documentation that most applications skip.

## 1. NOT NULL Where You Mean It

Most ORMs default to nullable columns unless you specify otherwise. That means columns you consider "always present" — order totals, user IDs, created timestamps — quietly accumulate NULL rows when error handling is absent or a migration runs partially. \`NOT NULL\` at the column level is free enforcement. It doesn't cost a query plan and it doesn't require application code.

## 2. CHECK Constraints for Domain Validation

Database-level CHECK constraints are underused because most developers trust their application layer to enforce business rules. The application layer works until it doesn't — a migration script, a direct psql query, a third-party integration. CHECK constraints hold regardless of the source:

\`\`\`sql
ALTER TABLE orders ADD CONSTRAINT positive_total 
  CHECK (total_cents > 0);

ALTER TABLE posts ADD CONSTRAINT valid_read_time 
  CHECK (read_time_minutes >= 1 AND read_time_minutes <= 120);
\`\`\`

The second one caught a seeder script that was writing 0-minute read times for empty post drafts. Not a critical failure, but it would have broken our frontend's read time display for any draft that got accidentally published.

## 3. Partial Unique Indexes for Soft-Delete Patterns

Soft deletes (setting a \`deleted_at\` timestamp instead of removing a row) break ordinary unique indexes because deleted rows still take up uniqueness space. You can't re-register an email address that belongs to a deleted account.

Partial unique indexes solve this:

\`\`\`sql
CREATE UNIQUE INDEX active_user_email 
  ON users (email) 
  WHERE deleted_at IS NULL;
\`\`\`

Active users are unique by email. Deleted users are exempt. The index is smaller than a full unique index and it enforces exactly the rule you actually want.

## 4. Foreign Keys Without \`ON DELETE CASCADE\` (Usually)

Cascade deletes feel convenient until a developer deletes a parent record thinking it's a cleanup operation and removes 40,000 associated rows in a transaction that holds a table lock for 90 seconds. We use explicit foreign keys without cascade, which means orphaned records cause a constraint violation at insert/update time and forcing you to handle deletion explicitly in application code.

The 3am incident I mentioned: a migration was trying to drop a \`post_categories\` table that was still referenced by \`posts.category_id\`. Without the foreign key, the migration would have succeeded, left ~14,000 posts with dangling IDs, and we'd have found out at 9am when the category filter threw 500 errors. With it, the migration failed with a descriptive error, we fixed the dependency order, and re-ran.

## 5. UNIQUE on Multi-Column Combinations

Single-column uniqueness is obvious. Multi-column combinations are where people forget:

\`\`\`sql
-- Prevent the same user commenting twice on the same post within the same timestamp
ALTER TABLE comments ADD CONSTRAINT unique_comment 
  UNIQUE (post_id, author_id, created_at);
\`\`\`

We had a race condition in our comment submission handler where double-clicks were creating duplicate comment rows. Adding a multi-column unique constraint on \`(post_id, author_id, content_hash)\` eliminated the duplicates at the database level, which let us remove 30 lines of application-side deduplication code.

## 6. DEFAULT Values for Non-Nullable Booleans

\`boolean NOT NULL DEFAULT false\` is more explicit than \`boolean\` and prevents any ambiguity about what "no value" means. Three separate bugs in our codebase traced back to \`NULL\` in a boolean column that some code treated as falsy and other code treated as an unknown state. \`NOT NULL DEFAULT false\` makes the choice once, at the schema level.

## 7. Exclusion Constraints for Temporal Overlap

If you work with booking systems, calendar slots, subscription periods, or anything time-ranged, exclusion constraints prevent overlapping records without writing overlap-detection in application code:

\`\`\`sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE subscriptions ADD CONSTRAINT no_overlap 
  EXCLUDE USING gist (
    user_id WITH =,
    daterange(starts_at, ends_at) WITH &&
  );
\`\`\`

This blocks any two active subscriptions for the same user from overlapping in time, regardless of what inserted them.

---

Constraints aren't glamorous. They don't ship features and they don't show up in performance benchmarks. But they're the layer between "this worked in testing" and "this works when 12 engineers are touching the database from different codepaths simultaneously."`,
    daysAgo: 14,
  },

  // ─────────────────────────────────────────── POST 6 (Sarah, Engineering)
  {
    authorEmail: 'sarah@talentgrowth.dev',
    category: 'Engineering',
    title: 'Optimistic UI Updates in React: Patterns That Hold Up Under Concurrent Users',
    content: `Optimistic updates are the gap between "works in demo" and "works when 500 people use it simultaneously." The idea is simple: show the user their action's result immediately, then sync with the server in the background. If the server rejects it, roll back. In practice, the rollback logic is where things get interesting.

## The Naive Pattern

Most tutorials implement optimistic updates like this:

\`\`\`javascript
const handleAddComment = async (content) => {
  const tempComment = {
    _id: \`temp-\${Date.now()}\`,
    content,
    author: user,
    createdAt: new Date().toISOString(),
  };

  // Immediate UI update
  setComments(prev => [...prev, tempComment]);

  try {
    const res = await commentApi.addComment(postId, { content });
    // Replace temp with server-confirmed comment
    setComments(prev =>
      prev.map(c => c._id === tempComment._id ? res.data.comment : c)
    );
  } catch (err) {
    // Rollback
    setComments(prev => prev.filter(c => c._id !== tempComment._id));
    toast.error('Failed to post comment');
  }
};
\`\`\`

This works for single users. Under concurrent load, it has two failure modes.

**Failure mode one:** The user submits two comments quickly. The second submission fires before the first response comes back. Both temp IDs are in state. If the first request fails and you filter out the first temp ID, the second comment's temp ID is still there, but its replacement logic runs correctly and you end up in a state where comment #2 appears twice: once as a temp and once as a confirmed record.

**Failure mode two:** The server returns an error after a noticeable delay (say, 3 seconds). The user, seeing no visible progress indicator, submits again. You now have two pending requests and potentially two real comments getting written.

## Using a Request Queue with Idempotency Keys

The more robust pattern introduces an idempotency key and tracks pending requests explicitly:

\`\`\`javascript
const pendingRef = useRef(new Map()); // key: requestId, value: cleanup fn

const handleAddComment = async (content) => {
  const requestId = \`comment-\${Date.now()}-\${Math.random().toString(36).slice(2)}\`;
  
  const tempComment = {
    _id: requestId,
    content,
    author: user,
    createdAt: new Date().toISOString(),
    isPending: true,
  };

  setComments(prev => [...prev, tempComment]);

  const controller = new AbortController();
  pendingRef.current.set(requestId, () => controller.abort());

  try {
    const res = await commentApi.addComment(
      postId,
      { content, idempotencyKey: requestId },
      { signal: controller.signal }
    );

    setComments(prev =>
      prev.map(c => c._id === requestId ? { ...res.data.comment, isPending: false } : c)
    );
  } catch (err) {
    if (err.name === 'AbortError') return; // Component unmounted
    setComments(prev => prev.filter(c => c._id !== requestId));
    toast.error('Comment failed. Check your connection and try again.');
  } finally {
    pendingRef.current.delete(requestId);
  }
};
\`\`\`

The \`isPending\` flag lets you show a loading indicator on the specific comment rather than a global spinner. Users can see their comment, see that it's still processing, and don't need to resubmit.

The backend can use \`idempotencyKey\` to deduplicate: if it sees the same key twice within a time window, it returns the first response rather than creating a second record.

## Showing Pending State Without Being Annoying

Pending comments should look slightly different from confirmed ones, but not so different that users think something is wrong. We use 60% opacity on the avatar and a small pulsing dot on the comment text. If the request resolves within 800ms, the user never notices the transition — it just snaps to the confirmed state. If it takes longer, the indicator is visible but subtle enough not to alarm.

What we don't do: show a full loading spinner for comment actions. Spinners suggest significant work is happening. A comment POST should be fast enough that a spinner is misleading about the operation's weight.

## Where Optimistic Updates Break Down

Some actions shouldn't be optimistic. Payment confirmation, account deletion, and permission changes are cases where "show it worked, then fix if it didn't" is genuinely dangerous — either for data integrity or for user trust. The pattern is for interactions that are low-stakes and reversible: comments, likes, draft saves, feed preferences.

If a rollback would surprise or distress the user, consider whether the optimistic approach is appropriate before adding it.`,
    daysAgo: 17,
  },

  // ─────────────────────────────────────────── POST 7 (Marcus, Design)
  {
    authorEmail: 'marcus@talentgrowth.dev',
    category: 'Design',
    title: 'Typography on Content Platforms: Measure, Leading, and the Case Against Italic Headers',
    content: `There's a specific failure mode I see on developer-built content platforms: the engineer finds a nice font, increases the font size for headings, and calls it typography work. The result looks like a styled blog post until you actually try to read it for 20 minutes.

Typography for reading is not typography for aesthetics. They overlap, but they start from different constraints.

## Measure: The Column Width Problem

Measure is typographer shorthand for line length. Optimal reading measure is 55–75 characters per line, including spaces. Shorter than 55, and your eyes spend more time jumping back to the start of lines than reading. Longer than 75, and you lose your place mid-line.

Most content platforms set their main text column to \`max-width: 800px\` or some pixel value and call it done. The problem: 800px at 16px base font on a high-density display isn't 800px of reading width — it's something else depending on letter-spacing, font-specific character widths, and word spacing. The reliable constraint is character-based:

\`\`\`css
.article-body {
  max-width: 65ch;
}
\`\`\`

\`65ch\` is 65 characters wide using the current font's \`0\` glyph as reference. It adapts to font changes without requiring you to recalculate pixel widths. Our body text column currently sits at \`65ch\`, which renders at 720px on a 1440px viewport at our base size.

## Leading: Where Most Interfaces Under-Invest

Leading (line-height) for display text and body text needs different values, and conflating them is why headings sometimes look cramped while body copy looks airy.

Our current scale:

- **Display headings** (\`h1\`, hero text): \`line-height: 1.1\`. Tight. At 48px, a 1.1 leading means lines sit 53px apart, which looks intentional rather than accidental.
- **Section headings** (\`h2\`, \`h3\`): \`line-height: 1.25\`. More room for the eye to reset, because these often sit above body copy and need to breathe.
- **Body copy**: \`line-height: 1.65\`. This is the value where text stops feeling compressed without feeling double-spaced.

Anything below 1.5 for body text at under 18px creates fatigue within a few paragraphs, particularly on screens with sub-200 DPI pixel density (most external monitors at 27 inches or larger).

## The Italic Header Problem

Italic headers are one of the most reliable AI design tells. They look dynamic in Figma on a dark background and terrible on a light reading background at body copy sizes. More importantly, they break the visual grammar of the italic style within the text: if a heading is italic, what does an emphasized word in body copy look like? You've used up your register for title treatment.

The convention in editorial typography is simple: headers are roman (upright), body emphasis is italic, and the two don't cross. Our headings use Newsreader in roman weight at optical size \`opsz: 36\`. The only time we apply italic is within running paragraph text for genuine emphasis — book titles, foreign terms, specific technical names we want to distinguish from surrounding text.

Figma makes it easy to accidentally apply italic to a headline font because the typeface itself looks elegant at display sizes. Resist. Look at it in context, in a full-length article, after ten paragraphs of roman body copy.

## One Decision That Changed Everything

We spent three weeks debating serif vs sans-serif for our headings. The thing that actually resolved it: we printed five articles from five competing content platforms at the same font size and read them physically, on paper, for 20 minutes each. The ones with high-contrast serif headings were noticeably easier to scan. Not because serifs are objectively better — because optical contrast between the heading face and the body face creates a hierarchy that the eye can parse quickly while skimming.

Print your interface decisions. It tells you things your monitor doesn't.`,
    daysAgo: 20,
  },

  // ─────────────────────────────────────────── POST 8 (Devon, Career)
  {
    authorEmail: 'devon@talentgrowth.dev',
    category: 'Career',
    title: 'What Running 100 System Design Interviews Taught Me About Candidate Signals',
    content: `I've been an interviewer at two companies with strong technical bars over the past four years, and I've conducted or co-conducted around 100 system design interviews in that window. The signals that separate strong candidates from weak ones are not what most interview prep guides emphasize.

This isn't an article about what questions to study. It's about what interviewers are actually watching for.

## The Clarifying Questions Signal

The first five minutes of a system design interview are supposed to be the candidate scoping the problem. Most candidates ask two or three generic clarifications ("What's the expected traffic?" "Should I focus on read or write?") and then dive into drawing boxes on the whiteboard.

Strong candidates keep asking until they've found the ambiguity that changes the architecture. For a URL shortener, that ambiguity is whether vanity URLs need to be supported — because that shifts the storage design from auto-increment IDs to a separate lookup table with uniqueness constraints. For a feed system, it's whether the feed is user-generated content or algorithmic, because those require fundamentally different read paths.

Most candidates never find the ambiguity because they're executing a memorized template. The question sequence tells the interviewer almost immediately whether they're watching someone think or someone perform.

## Where "I'd Use Kafka" Goes Wrong

There's a category of candidate who solves every throughput problem with Kafka. High write volume? Kafka. Async processing? Kafka. Need to decouple services? Kafka. The answer isn't necessarily wrong, but the reasoning is absent.

What interviewers want to hear is the trade-off: Kafka provides durable, ordered, replayable event streams, which is valuable if you need replay or fan-out; it adds operational complexity and at-least-once delivery semantics that require idempotent consumers. Redis Streams is lighter and appropriate when you have one consumer and don't need replayability. Simple polling might be appropriate if your throughput is under 500 events/second and you don't want to add infrastructure.

Candidates who can articulate why they're reaching for a tool are significantly more compelling than candidates who reach for the same tool every time. Even if the "worse" tool is the right answer for that particular problem.

## The Estimation Trap

Most system design problems include some version of "how would you scale this?" Candidates who practiced Fermi estimation with memorized shortcuts (1M users × 10 req/day × 1KB/req = X GB/day) produce numbers that sound precise. The problem is the assumptions are usually wrong for the specific problem at hand.

Strong candidates state their assumptions out loud and defend them: "I'm assuming the average user generates about 3 comments per day rather than 10 because this is a long-form platform, not Twitter, so the write volume is lower." Then they run the math. Then they identify the bottleneck in their estimate.

The number matters less than the reasoning. Interviewers don't have ground truth on your estimates — they're evaluating whether you think through the dimensions systematically and whether you know which dimension is the constraining one.

## Staff vs Senior vs Mid-Level Signals

The clearest signal of level isn't technical depth, though that matters. It's whether the candidate thinks about failure modes proactively:

- **Mid-level candidates** build a system that works under normal conditions
- **Senior candidates** identify two or three failure scenarios and address them
- **Staff candidates** identify failure scenarios, propose mitigations, and then discuss which mitigations aren't worth the complexity given the business context

That last part matters. A candidate who proposes every possible redundancy for a service that has a 99% SLA requirement is either not listening to the constraints or doesn't yet have the judgment to prioritize. Staff-level thinking is knowing which hard problems are worth solving and which are premature.

---

Most interviewers aren't trying to trick you. They're watching how you think under ambiguity, whether you can navigate trade-offs without a script, and whether you've actually built things rather than read about building them. That last one usually shows.`,
    daysAgo: 23,
  },
];

// ─── COMMENTS ──────────────────────────────────────────────────────────────

const COMMENTS = [
  // Comments on Post 1 (SQL Repositories)
  {
    postTitle: 'Why We Migrated from Raw SQL Strings to a Typed Repository Layer',
    authorEmail: 'aria@talentgrowth.dev',
    content: "The circular dependency issue you hit with the connection pool in three files — we had the exact same thing. Ended up using a module-level singleton with lazy initialization rather than importing at the top of each repo file. Took an embarrassing amount of time to figure out why it was breaking.",
    daysAgo: 1,
  },
  {
    postTitle: 'Why We Migrated from Raw SQL Strings to a Typed Repository Layer',
    authorEmail: 'sarah@talentgrowth.dev',
    content: "The \"14 injection points in 20 minutes\" part hit differently than I expected. We had a similar audit result and the gut reaction is defensiveness, not relief. The auditor being that fast is a feature, not a criticism.",
    daysAgo: 1,
  },
  {
    postTitle: 'Why We Migrated from Raw SQL Strings to a Typed Repository Layer',
    authorEmail: 'marcus@talentgrowth.dev',
    content: "I'd argue the real win isn't security — it's readability. When every query lives in one directory, new engineers stop guessing where data access happens. We noticed onboarding time dropped noticeably after we made the same move, though correlation and causation are murky.",
    daysAgo: 0,
  },

  // Comments on Post 2 (Latency Debugging)
  {
    postTitle: 'Debugging a Stubborn 200ms Latency Spike in Vercel Serverless Functions',
    authorEmail: 'sarah@talentgrowth.dev',
    content: "Logging readyState on every request is such a simple thing but I would not have thought to do it. We've been using mongoose.connection.readyState in health checks but not in the actual handler. Adding it today.",
    daysAgo: 4,
  },
  {
    postTitle: 'Debugging a Stubborn 200ms Latency Spike in Vercel Serverless Functions',
    authorEmail: 'devon@talentgrowth.dev',
    content: "The region mismatch is a classic and it will catch you at least once per infrastructure migration. We had a three-week investigation that ended with \"your Postgres is in us-east-1 and your API is in eu-west-1.\" Three weeks.",
    daysAgo: 3,
  },
  {
    postTitle: 'Debugging a Stubborn 200ms Latency Spike in Vercel Serverless Functions',
    authorEmail: 'elena@talentgrowth.dev',
    content: "The 30% disconnection rate despite the cache variable being set is exactly the kind of thing that looks impossible until you log it. Thanks for the `readyState` check pattern — adding this to our serverless template.",
    daysAgo: 3,
  },

  // Comments on Post 3 (Tactile UI)
  {
    postTitle: "The Anatomy of Tactile UI: Depth, States, and Why Flat Design Isn't Dead",
    authorEmail: 'sarah@talentgrowth.dev',
    content: "The `is-active` class pattern for forcing :active state in Storybook — I've been using a manual click event in tests instead, which is terrible. Going to refactor our button stories today. This is a significantly better approach.",
    daysAgo: 7,
  },
  {
    postTitle: "The Anatomy of Tactile UI: Depth, States, and Why Flat Design Isn't Dead",
    authorEmail: 'elena@talentgrowth.dev',
    content: "Appreciate you naming the fluorescent lighting point. We do most of our contrast testing on calibrated monitors, then deploy and immediately get complaints from people in standard office environments. Testing on an overexposed monitor is now on our design review checklist.",
    daysAgo: 6,
  },

  // Comments on Post 4 (PR Review)
  {
    postTitle: 'How We Cut PR Review Turnaround from 52 Hours to Under 6 Hours',
    authorEmail: 'aria@talentgrowth.dev',
    content: "The 'nit:' prefix convention is something I wish we'd adopted three years ago. We use a similar but inconsistent set of labels that require institutional knowledge to decode. Going to propose standardizing this in our next team meeting.",
    daysAgo: 10,
  },
  {
    postTitle: 'How We Cut PR Review Turnaround from 52 Hours to Under 6 Hours',
    authorEmail: 'elena@talentgrowth.dev',
    content: "The finding that PRs over 400 lines received review 3.2 days later — did you control for PR complexity, or was size the primary variable? We've been debating whether to set a size limit and this is the most concrete data point I've seen cited.",
    daysAgo: 10,
  },
  {
    postTitle: 'How We Cut PR Review Turnaround from 52 Hours to Under 6 Hours',
    authorEmail: 'devon@talentgrowth.dev',
    content: "Good question — we didn't fully control for complexity, and that's a real limitation. Our approximation was that migration PRs and greenfield feature PRs tended to be larger and also tend to be more complex, so the correlation holds directionally but isn't perfectly isolated. I'd treat the specific numbers as illustrative rather than precise.",
    daysAgo: 9,
  },

  // Comments on Post 5 (Postgres Constraints)
  {
    postTitle: 'Seven PostgreSQL Constraints That Prevented Data Corruption at Scale',
    authorEmail: 'marcus@talentgrowth.dev',
    content: "The partial unique index for soft-deletes is genuinely one of those things I learned once and have used in every database schema since. Every team I've joined has had at least one bug caused by deleted email uniqueness violations.",
    daysAgo: 13,
  },
  {
    postTitle: 'Seven PostgreSQL Constraints That Prevented Data Corruption at Scale',
    authorEmail: 'aria@talentgrowth.dev',
    content: "We hit the exclusion constraint limitation with subscription overlaps last quarter and wrote 200 lines of application-side range overlap detection instead. The gist extension approach is much cleaner — would have saved us that afternoon.",
    daysAgo: 12,
  },

  // Comments on Post 6 (Optimistic UI)
  {
    postTitle: 'Optimistic UI Updates in React: Patterns That Hold Up Under Concurrent Users',
    authorEmail: 'marcus@talentgrowth.dev',
    content: "The 60% opacity on the pending avatar is a nice middle ground. We went with a line through the pending comment text at one point and it looked like a deletion. Opacity is less alarming while still communicating that the state is unconfirmed.",
    daysAgo: 16,
  },
  {
    postTitle: 'Optimistic UI Updates in React: Patterns That Hold Up Under Concurrent Users',
    authorEmail: 'devon@talentgrowth.dev',
    content: "The double-click failure mode is real and underestimated. We got three separate bug reports from users who thought their comment \"disappeared\" when it was actually just the rollback after a failed second request conflicting with the successful first. The pending state visibility would have prevented that entirely.",
    daysAgo: 15,
  },

  // Comments on Post 7 (Typography)
  {
    postTitle: 'Typography on Content Platforms: Measure, Leading, and the Case Against Italic Headers',
    authorEmail: 'aria@talentgrowth.dev',
    content: "The ch unit — genuinely didn't know this before today. We've had a 750px max-width on our article column since 2021 and it's been fine, but I can already see how it would drift as we change font sizes. Switching to 65ch today.",
    daysAgo: 19,
  },
  {
    postTitle: 'Typography on Content Platforms: Measure, Leading, and the Case Against Italic Headers',
    authorEmail: 'elena@talentgrowth.dev',
    content: "The physical print test is something I'm going to bring up at our next design critique. We do everything on monitors and the feedback loop is completely detached from how people read on paper or, honestly, on low-DPI external displays.",
    daysAgo: 18,
  },
];

module.exports = { USERS, POSTS, COMMENTS };
