<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Business details (phone, WhatsApp, email, socials, showreel) live only in `src/config/site.ts`; content lists live in `src/data/*`. Why: the owner edits one place and every page updates.
- Package prices are `null` in `src/data/packages.ts` until the owner supplies them; UI shows "Price on request". Why: never invent business prices.
- Form validation schemas in `src/lib/inquiry-schema.ts` are shared by the browser forms and the server functions in `src/lib/inquiries.functions.ts`. Why: one source of truth for rules.
- Inquiry/booking tables accept anonymous inserts only (no public reads); server functions insert with the publishable key. Why: visitors can submit but never read submissions.
- Colors come from tokens in `src/styles.css`; light mode is the `.light` class on `<html>`. Why: keep the black-and-gold brand consistent in both themes.
