=== Quick Copy Block ===
Contributors:      mazharulrobeen
Tags:              copy, clipboard, block, gutenberg, snippet
Requires at least: 6.6
Tested up to:      7.0
Stable tag:        1.2.1
Requires PHP:      7.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Add a one-click copy-to-clipboard button to any text in your posts and pages.

== Description ==

**Quick Copy Block** is a Gutenberg block that makes it effortless for your visitors to copy text with a single click. Whether you're sharing code snippets, quotes, commands, URLs, or any other text content, Quick Copy Block adds a polished, accessible copy button right next to it.

= Features =

* **Two editable fields** — the content to copy and the button label, both editable directly in the block editor.
* **Custom button colors** — choose a background and text color from the color picker in the block sidebar.
* **Custom success message** — configure what the button says after a successful copy (default: "Copied!").
* **Smooth fade animation** — the button label fades out, swaps to the success message, then fades back to the original label after 2 seconds.
* **Modern Clipboard API** — uses `navigator.clipboard.writeText()` with an automatic `execCommand` fallback for non-HTTPS environments.
* **No jQuery** — pure vanilla JavaScript, zero dependencies on the front end.
* **Accessible** — correct `aria-live` attribute on the button so screen readers announce the success state.
* **Lightweight** — the clipboard script is loaded only on pages that contain the Quick Copy Block.

= Use cases =

* Code snippets and terminal commands
* Referral links or coupon codes
* Shareable quotes
* API keys or configuration values
* Any text your visitors need to reuse

== Source Code & Build Instructions ==

The full, human-readable source code for this plugin is publicly available on GitHub:
https://github.com/mazharulrobeen/quick-copy-block

The `build/` directory contains compiled assets generated from the source files in `src/`. To regenerate them:

1. Install Node.js and npm
2. Run `npm install`
3. Run `npm run build`

The `src/` directory contains:

* `index.js` — block registration and editor icon
* `edit.js` — block editor component
* `save.js` — static save output
* `frontend.js` — vanilla JS clipboard logic (source for `build/frontend.js`)
* `style.scss` — frontend and editor styles
* `editor.scss` — editor-only styles

No third-party libraries are used in the compiled output. All code is original.

== Installation ==

= Automatic =
1. Go to **Plugins → Add New** in your WordPress admin.
2. Search for **Quick Copy Block**.
3. Click **Install Now** then **Activate**.

= Manual =
1. Download the plugin ZIP.
2. Go to **Plugins → Add New → Upload Plugin**.
3. Upload the ZIP and click **Install Now**.
4. Click **Activate Plugin**.

== Frequently Asked Questions ==

= Does this work with the Classic Editor? =

No. Quick Copy Block is a Gutenberg block and requires the Block Editor (WordPress 6.6+).

= Does the copy work on HTTP (non-HTTPS) sites? =

Yes. When the `navigator.clipboard` API is unavailable (HTTP or older browsers), Quick Copy Block automatically falls back to `document.execCommand('copy')`.

= Can I use HTML in the content field? =

Yes — the content field is a `RichText` field, so you can apply bold, italic, links, and other inline formatting. Only the plain text is copied to the clipboard.

= Can I have multiple Quick Copy blocks on one page? =

Absolutely. Each block is independently initialised.

== Screenshots ==

1. The Quick Copy Block in the editor — content field and button label both editable inline.
2. Block sidebar showing the color pickers and success message field.
3. The published block on the front end before and after clicking copy.

== Changelog ==

= 1.2.1 ( June 13, 2026 ) =
* Fixed: text inside pill-style themes (4, 6–10) was not editable in the block editor — the frontend `pointer-events: none` rule on the pill content was also applied in the editor, blocking RichText focus.
* Fixed: minimum WordPress version raised to 6.6 — the editor script depends on the `react-jsx-runtime` handle introduced in WP 6.6, so the block could fail to load on 6.3–6.5.
* Fixed: copy button could remain disabled forever when the theme removed CSS transitions or the visitor uses reduced motion; the label swap now has a timeout safety fallback.
* Fixed: clicking a link inside the content no longer triggers a copy when "Click content to copy" is enabled.
* Fixed: repeated clicks on the content area during the success animation are now ignored.
* Improved: corrected sidebar control labels ("Show symbol icon", "Select a theme", etc.) for clarity and translators.
* Improved: replaced the generic Dashicon with a custom copy-glyph SVG block icon in the inserter and block toolbar.
* Removed: unused admin-notices scaffolding and the related uninstall routine (no options were ever stored).

= 1.2.0 ( May 21, 2026 ) =
* Added Themes 5–10 with new icon variants (stacked, mail, globe, code, hash, key).
* Fixed: RichText text input was blocked in pill-style themes in the editor.
* Removed RichText source binding from buttonLabel for cleaner attribute handling.

= 1.1.0 ( May 21, 2026 ) =
* Added theme selector (Themes 1–4).
* Added Elements toggles: Label, Symbol Icon, Copy Icon, Input Click To Copy.
* Added Label sidebar panel.

= 1.0.0 ( May 21, 2026 ) =
* Initial release.

== Upgrade Notice ==

= 1.2.1 =
Reliability release: fixes a button-stuck-disabled edge case and raises the minimum WordPress version to 6.6. Recommended for all users.
