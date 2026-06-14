/**
 * Clipt — Frontend clipboard script.
 *
 * Loaded only on pages containing the Clipt block (block.json viewScript).
 * Vanilla ES2017+. No jQuery. No external dependencies.
 *
 * Themes 1–3, 5:  dedicated copy <button> + optional inputClickToCopy on the content div.
 * Themes 4, 6–10: the entire pill <button> IS the copy trigger; its
 *                 .clipt-theme__pill-content span receives the success text swap.
 */
( function () {
	'use strict';

	const SUCCESS_DURATION = 2000;
	const FADE_TIMEOUT     = 400; // Safety ceiling for transitionend (ms).

	/** Pill-style themes where the whole element is the click target. */
	const PILL_THEMES = new Set( [
		'theme-4', 'theme-6', 'theme-7', 'theme-8', 'theme-9', 'theme-10',
	] );

	/**
	 * Copy text to clipboard.
	 * Prefers Navigator Clipboard API; falls back to execCommand.
	 *
	 * @param {string} text
	 * @return {Promise<void>}
	 */
	async function copyToClipboard( text ) {
		if ( navigator.clipboard && window.isSecureContext ) {
			return navigator.clipboard.writeText( text );
		}
		return new Promise( ( resolve, reject ) => {
			const ta = document.createElement( 'textarea' );
			ta.value = text;
			ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;';
			document.body.appendChild( ta );
			ta.focus();
			ta.select();
			try {
				const ok = document.execCommand( 'copy' );
				document.body.removeChild( ta );
				ok ? resolve() : reject( new Error( 'execCommand failed' ) );
			} catch ( e ) {
				document.body.removeChild( ta );
				reject( e );
			}
		} );
	}

	/**
	 * Wait for a transitionend on `el`, but never longer than `timeout` ms.
	 * Guards against themes that remove the CSS transition and against
	 * prefers-reduced-motion, where transitionend never fires.
	 *
	 * @param {HTMLElement} el
	 * @param {number}      timeout
	 * @return {Promise<void>}
	 */
	function afterTransition( el, timeout ) {
		return new Promise( function ( resolve ) {
			let done = false;
			const finish = function () {
				if ( done ) return;
				done = true;
				el.removeEventListener( 'transitionend', finish );
				resolve();
			};
			el.addEventListener( 'transitionend', finish, { once: true } );
			setTimeout( finish, timeout );
		} );
	}

	/**
	 * Animate button: fade out → swap label → fade in → wait → restore.
	 *
	 * @param {HTMLElement} button
	 * @param {HTMLElement} labelEl       Element whose textContent is swapped.
	 * @param {string}      originalLabel
	 * @param {string}      successLabel
	 */
	async function animateButton( button, labelEl, originalLabel, successLabel ) {
		button.disabled = true;
		button.classList.add( 'clipt-block__button--fade' );

		await afterTransition( button, FADE_TIMEOUT );
		labelEl.textContent = successLabel;
		button.classList.remove( 'clipt-block__button--fade' );

		setTimeout( async function () {
			button.classList.add( 'clipt-block__button--fade' );
			await afterTransition( button, FADE_TIMEOUT );
			labelEl.textContent = originalLabel;
			button.classList.remove( 'clipt-block__button--fade' );
			button.disabled = false;
		}, SUCCESS_DURATION );
	}

	/**
	 * Initialise a single Clipt block.
	 *
	 * @param {HTMLElement} block
	 */
	function initBlock( block ) {
		const successMsg      = block.dataset.success    || 'Copied!';
		const inputClickToCopy = block.dataset.inputClick === '1';
		const theme           = block.dataset.theme      || 'theme-1';

		// ── Pill themes: whole pill is the button ────────────────────────────
		if ( PILL_THEMES.has( theme ) ) {
			const pill    = block.querySelector( '.clipt-theme__pill' );
			const labelEl = pill && pill.querySelector( '.clipt-theme__pill-content' );
			if ( ! pill || ! labelEl ) return;

			const originalLabel = labelEl.textContent.trim();

			pill.addEventListener( 'click', async function () {
				const text = labelEl.innerText || labelEl.textContent || '';
				try {
					await copyToClipboard( text );
					animateButton( pill, labelEl, originalLabel, successMsg );
				} catch ( e ) {
					// eslint-disable-next-line no-console
					console.warn( '[Quick Copy Block] Copy failed:', e );
					pill.disabled = false;
				}
			} );
			return;
		}

		// ── Box themes: dedicated copy button ────────────────────────────────
		const button    = block.querySelector( '.clipt-block__button' );
		const labelEl   = button && button.querySelector( '.clipt-block__button-label' );
		const contentEl = block.querySelector( '.clipt-block__content' );

		if ( ! button || ! labelEl || ! contentEl ) return;

		const originalLabel = button.dataset.label || labelEl.textContent.trim();

		async function triggerCopy() {
			// Ignore clicks while the success animation is running.
			if ( button.disabled ) {
				return;
			}
			const text = contentEl.innerText || contentEl.textContent || '';
			try {
				await copyToClipboard( text );
				animateButton( button, labelEl, originalLabel, successMsg );
			} catch ( e ) {
				// eslint-disable-next-line no-console
				console.warn( '[Quick Copy Block] Copy failed:', e );
				button.disabled = false;
			}
		}

		button.addEventListener( 'click', triggerCopy );

		// inputClickToCopy — clicking the content area also copies.
		if ( inputClickToCopy ) {
			contentEl.style.cursor = 'pointer';
			contentEl.setAttribute( 'role', 'button' );
			contentEl.setAttribute( 'tabindex', '0' );
			contentEl.addEventListener( 'click', function ( e ) {
				// Let links inside the content navigate without copying.
				if ( e.target.closest( 'a' ) ) {
					return;
				}
				triggerCopy();
			} );
			contentEl.addEventListener( 'keydown', function ( e ) {
				if ( e.key === 'Enter' || e.key === ' ' ) {
					e.preventDefault();
					triggerCopy();
				}
			} );
		}
	}

	function init() {
		document.querySelectorAll( '.clipt-block' ).forEach( initBlock );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
