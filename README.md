# Bayzicks

A mobile-first educational website built with the latest stable Next.js App Router, TypeScript, Tailwind CSS and Lucide React. Forest green, warm cream, sage and restrained orange accents are paired with optimized DM Sans and DM Serif Display fonts.

## Run locally

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and fill in only the services you want to enable. Preserve the sandbox's existing `.env` and `DATABASE_URL`.
3. Run `npm run dev` and open `http://localhost:3000`.
4. For production validation, run `npx next typegen`, `npm exec tsc -- --noEmit --pretty false`, and `npm run build`.

The application pages, newsletter signup and enquiry forms do **not** use a database and no tables or migrations have been added. The scaffold's PostgreSQL/Drizzle files and database health endpoint remain for the managed preview environment.

## Routes

- `/`: homepage, five foundations, guide signup, resources, learning options, about, FAQ.
- `/start-here`: keyboard-accessible interactive explorer with six career examples and first-project ideas.
- `/resources`: searchable, category-filtered resource library.
- `/resources/digital-careers-field-guide`: focused Instagram landing page with minimal navigation, benefits, form and FAQ.
- `/about`: brand purpose and an explicitly unfilled founder introduction.
- `/contact` and `/collaborate`: validated enquiry forms.
- `/privacy` and `/terms`: clearly marked legal drafts requiring review.
- `/api/subscribe`, `/api/contact`, `/api/collaborate`: server-only POST endpoints.
- `/sitemap.xml`, `/robots.txt`, `/opengraph-image`: generated SEO assets.

Use `/resources/digital-careers-field-guide` as the Instagram profile destination. Source tracking is server-allowlisted, not an arbitrary tag taken from a URL.

## The supplied Bayzicks image: action required

The original graphic was visible in the brief but **was not made available as a file in this workspace**. It has not been recreated with CSS or AI, fetched from unrelated sites, or replaced with a fake version.

Place the exact original at `public/images/bayzicks-digital-world.png`. Alternatively, set `BAYZICKS_IMAGE_PATH` to another local `/images/` PNG, JPEG or WebP path. `BrandVisual` in `src/components/guide-visual.tsx` checks that the original exists, then displays it prominently in the homepage hero through `next/image`, with responsive sizes and descriptive alt text. The supplied graphic's intrinsic dimensions are 946 × 630; update them if using a different approved export. Rebuild after adding or changing the asset.

Until that original is present, the hero uses a **separate, clearly labelled guide-cover preview**, not a recreation of the supplied graphic. Its artwork is `public/images/digital-careers-guide.svg`. The final PDF and cover are not included or implied to have been uploaded. Replace the single `guideCover` object in `src/lib/content.ts` with the approved cover path, alt text and dimensions, and set its `preview` flag to false when ready. That updates both the shared guide visual and resource card. Other resources can have their own optional `cover` object; available resources without a cover use a neutral document icon rather than showing another guide’s cover.

## Environment variables

All service credentials are server-side and must never use a `NEXT_PUBLIC_` prefix.

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Final origin for canonical URLs, metadata, sitemap and origin checks. Defaults to localhost during development. |
| `SOCIAL_IMAGE_URL` | Optional final absolute social image URL. Defaults to the generated PNG. |
| `INSTAGRAM_URL` | Optional confirmed HTTPS Instagram profile URL. Otherwise the footer says the link is coming soon. |
| `BAYZICKS_IMAGE_PATH` | Local public path of the supplied original brand graphic. |
| `MAILCHIMP_API_KEY` | Mailchimp Marketing API key. |
| `MAILCHIMP_SERVER_PREFIX` | API data centre, such as `us19`; must match the account/key. |
| `MAILCHIMP_AUDIENCE_ID` | The intended audience ID. |
| `MAILCHIMP_MODE` | `preview` (default) or `live`. |
| `MAILCHIMP_DELIVERY_READY` | Set `true` only after the PDF, automation and delivery email have been tested. |
| `MAILCHIMP_DOUBLE_OPT_IN` | `true` by default; `false` only after reviewing consent requirements. |
| `RESEND_API_KEY` | Resend key for forwarding enquiries. |
| `CONTACT_FROM_EMAIL` | Verified sender address, optionally `Bayzicks <hello@your-domain>`. |
| `CONTACT_TO_EMAIL` | Destination mailbox for both types of enquiry. |
| `FORMS_MODE` | `preview` (default) or `live`. |

Next.js may statically render public form readiness notices and metadata at build time. **Rebuild and redeploy after changing configuration**, especially readiness, domain, social links or the original image. The API itself reads credentials on the server at request time.

## Finish Mailchimp setup

The API is implemented with native `fetch`, not a browser embed or an additional SDK. It validates the email and explicit consent, hashes the normalized address for the member endpoint, checks an existing contact's status, performs an upsert, and applies resource/source tags. Errors never expose raw provider responses, credentials or submitted content.

1. **Audience:** create/select the actual Bayzicks audience. Set its audience ID. Make email sufficient for signup: other merge fields must not be required. Review audience GDPR/marketing-permission settings and map any required permissions before going live.
2. **API credentials:** generate a restricted, server-only Marketing API key; configure its data centre and audience. Never commit credentials.
3. **Resource and source tags:** the endpoint activates `digital-careers-field-guide`, `bayzicks-website`, `bayzicks-email-consent-v1`, plus an allowlisted `source-*` tag. Sources are `homepage`, `instagram-guide`, `resources`, `start-here`, and `about`. Only sources actually used by a form are applied. Tags are created by Mailchimp if necessary. Review the consent wording before changing its version tag.
4. **Actual resource:** finish and upload the real PDF to a reliable HTTPS download URL (Mailchimp Content Studio or your approved hosting). Confirm access works on mobile without an account. The application does not attach a PDF or return a fake download URL.
5. **Automation/customer journey:** configure delivery for the resource tag. With the default double opt-in, the resource tag is applied while the new member is pending. Make sure a journey starts when the contact **becomes subscribed**, with the resource-tag condition. Also cover already-subscribed contacts receiving that resource tag for the first time, using a tag-added entry or a separate filtered journey as your Mailchimp plan allows. Avoid duplicate sends between these entry points. Do not assume that a tag-added event on a pending contact will send automatically after confirmation.
6. **Delivery email:** write the real welcome/delivery email and link it to the actual PDF URL. Include a useful plain-text version and recognizable subject/sender. No email content or download URL is configured inside this application's API.
7. **Unsubscribe:** include Mailchimp's required unsubscribe merge tag (`*|UNSUB|*`) and the legally required sender/address footer. Test unsubscribing. Existing unsubscribed, cleaned or otherwise inactive contacts are not silently resubscribed by this endpoint.
8. **Sender authentication:** verify the real sending address/domain and complete Mailchimp's required DNS authentication. Review DKIM, SPF and DMARC with your domain provider as applicable. Configure a monitored reply-to address.
9. **Test all cases:** new address → pending → confirmation → one delivery email; existing subscriber without resource tag → delivery; existing subscriber already tagged → an honest already-requested message; invalid and opted-out addresses → safe errors. An already-active resource tag is not removed/re-added just to trigger another email.
10. **Activate:** only after those tests, set `MAILCHIMP_MODE=live` and `MAILCHIMP_DELIVERY_READY=true`, then rebuild/redeploy.

### Honest development fallback

Default `preview` mode validates submissions without contacting Mailchimp, storing a subscriber or sending email. The frontend displays a preview notice before submission and a distinct preview response afterward. It never says “check your inbox” for a mock request. A deliberately selected live mode with missing configuration returns a safe 503 response instead of silently falling back to a simulated subscription.

Real pending contacts are asked to confirm their email. A successful subscribed response is shown only after the actual provider calls succeed and the owner has explicitly marked the delivery automation ready. Delivery still depends on the configured and tested Mailchimp journey.

### Adding another lead magnet

Add a resource to `resources` and an allowlisted ID/tag to `leadMagnets` in `src/lib/content.ts`. Include its own optional `cover` metadata. Use `planned` until confirmed; only `featured` or `available` resources get working landing-page links. Add a focused resource page and pass its ID/source to `EmailSignupForm`. Configure its PDF and Mailchimp delivery journey separately. Add a sitemap route if needed. Never accept arbitrary tags or download URLs from a client request.

## Contact and collaboration delivery

Both forms use `/api/contact` or `/api/collaborate` and the native Resend REST API, keeping the key on the server.

1. Configure a real destination mailbox.
2. Verify a sender domain in Resend and configure its required DNS records.
3. Set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` and `FORMS_MODE=live`.
4. Rebuild/redeploy. Test receipt of both forms and reply-to behaviour.

Messages are sent as plain text, preventing submitted markup from becoming an HTML email. A submission UUID is used as the provider idempotency key for retries. The real success state appears only when Resend accepts the request. Enquiries do not subscribe anyone to Mailchimp.

Without configuration, the forms validate and show **“preview only; not sent or saved.”** There is no fake success, silent storage or invented fallback mailbox.

## Spam and security

- Required, bounded server validation; JSON-only requests and bounded streamed request bodies.
- Honeypot fields, same-origin browser checks and rate limits (8 signup or 5 enquiry attempts per 15 minutes per hashed request identifier).
- Provider timeouts, safe errors, no raw provider output or PII in application logs.
- Server-only credentials and no application database persistence.
- Basic security response headers; no third-party analytics or tracking scripts by default.

The bounded in-memory limiter is a **baseline for a single server, not a distributed guarantee**. Use your deployment's trusted edge/WAF or a shared limiter for multiple instances. Ensure forwarding headers are overwritten by the trusted proxy. Add a server-verified bot challenge in the shared request guard if traffic warrants it; no nonfunctional CAPTCHA is shown now. Review logs, retention, CSP, HTTPS/HSTS and host rules for the real deployment. Be mindful of the managed preview's embedding requirements when choosing frame restrictions.

## Editing content and components

- `src/lib/content.ts`: brand introduction, navigation, foundations, resources, FAQ, career examples and form categories.
- `src/components/`: Header, MobileNavigation, Footer, Button/Container/Section, ResourceCard, EmailSignupForm, FAQ, ContactForm and CollaborationForm, plus small homepage sections.
- `src/app/(site)/`: full-navigation pages.
- `src/app/(lead)/`: focused conversion layout and guide landing page.
- `src/app/globals.css`: tokens, typography, layout and responsive styles.
- `/about`: replace the explicitly reserved founder block with the approved real story and photo. Use `next/image`; never use a stock person as the founder.
- Community, coaching and 1:1 consultation remain **unconfirmed and unavailable**. Confirm details before replacing their status labels or adding booking/payment functionality.

Interactive client components are limited to the menu, forms, resource filtering and career tabs. The FAQ uses native keyboard-accessible `<details>` elements. The rest is server-rendered. Mobile email fields use email keyboards, 16px text to prevent iOS zoom, autocomplete and no autocapitalization. Focus states, reduced-motion support and 44px controls are included.

## Smoke tests and launch review

Run `node scripts/smoke-test.mjs` against a started app. `SMOKE_TEST_URL` defaults to `http://localhost:3000`. The script checks public pages, local links/anchors, metadata, SEO assets, safe validation and request protections. Set `SMOKE_TEST_PREVIEW=1` only against a fresh **preview-mode** build to test honest mocked states; it checks for the preview notice before doing so.

Run isolated provider tests with `npm exec --yes --package=tsx -- tsx scripts/provider-tests.ts`. They intercept every outgoing fetch and check new/pending/existing/opted-out Mailchimp contacts, tag failures, safe errors, source tags, readiness gates and Resend acceptance/rejection. Test fixture keys are not real credentials; no network requests, subscriptions or emails occur.

Optional browser validation (test dependencies are ephemeral, not application dependencies): run `npm exec --yes --package=playwright -- playwright install chromium`, then `npm exec --yes --package=playwright --package=@axe-core/playwright -- node scripts/browser-test.mjs`. On a minimal Linux/CI image, install the system libraries with `npm exec --yes --package=playwright -- playwright install-deps chromium` (requires installation permissions). The browser suite exercises 360/390/430/768/1280/1440px layouts, keyboard interactions, form states and axe WCAG A/AA checks. Add `SMOKE_TEST_PREVIEW=1` only for the explicit preview-form checks. Screenshots are saved to the git-ignored `artifacts/` directory.

Before public launch:

- Add the exact supplied brand image and approved final guide cover/PDF.
- Review the copy and add the founder's actual introduction.
- Confirm offered services rather than presenting future ones as available.
- Complete and test Mailchimp delivery, unsubscribe and sender authentication.
- Complete and test contact/collaboration email forwarding.
- Set the final canonical domain, confirmed Instagram URL and approved social image.
- Replace/review both legal drafts, add the actual business/privacy contact and retention policies. The source comments identify required legal review areas.
- Test keyboard navigation, 360/390/430px layouts, tablet/desktop and the Instagram in-app browser.
- Run type generation, TypeScript, ESLint, a production build and smoke tests.
- For the managed sandbox, finish with its `build_and_start` validation so the production server and `/api/health` are checked.
