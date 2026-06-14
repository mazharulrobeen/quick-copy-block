/**
 * WordPress dependencies
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * SVG icons — must be byte-for-byte identical to edit.js.
 * React serialises these to static HTML in save(); any diff causes
 * a block validation error.
 */
const IconCopy = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
	</svg>
);
const IconGift = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<polyline points="20 12 20 22 4 22 4 12" />
		<rect x="2" y="7" width="20" height="5" />
		<line x1="12" y1="22" x2="12" y2="7" />
		<path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
		<path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
	</svg>
);
const IconMail = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
		<polyline points="22,6 12,13 2,6" />
	</svg>
);
const IconGlobe = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<circle cx="12" cy="12" r="10" />
		<line x1="2" y1="12" x2="22" y2="12" />
		<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
	</svg>
);
const IconCode = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<polyline points="16 18 22 12 16 6" />
		<polyline points="8 6 2 12 8 18" />
	</svg>
);
const IconHash = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<line x1="4" y1="9" x2="20" y2="9" />
		<line x1="4" y1="15" x2="20" y2="15" />
		<line x1="10" y1="3" x2="8" y2="21" />
		<line x1="16" y1="3" x2="14" y2="21" />
	</svg>
);
const IconKey = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
	</svg>
);

/**
 * Pill layout — shared by themes 4, 6, 7, 8, 9, 10 in the saved markup.
 * Rendered as a real <button> so the clipboard JS can attach to it.
 *
 * @param {Object} props
 * @return {JSX.Element}
 */
function PillSave( { style, iconLeft, iconRight, content, buttonLabel } ) {
	return (
		<button
			className="clipt-block__button clipt-theme__pill"
			type="button"
			style={ style }
			data-label={ buttonLabel }
			aria-live="polite"
		>
			{ iconLeft && (
				<span className="clipt-theme__pill-icon-left">{ iconLeft }</span>
			) }
			<RichText.Content
				tagName="span"
				className="clipt-block__content clipt-theme__pill-content"
				value={ content }
			/>
			{ iconRight && (
				<span className="clipt-theme__pill-icon-right">{ iconRight }</span>
			) }
		</button>
	);
}

/**
 * Save component for the Clipt block.
 *
 * Outputs static HTML for all 10 themes.
 * frontend.js reads data-* attributes to wire up clipboard behaviour.
 *
 * Data contract (consumed by frontend.js):
 *  .clipt-block[data-success]          — success message string
 *  .clipt-block[data-theme]            — active theme key
 *  .clipt-block[data-input-click]      — "1" when content click copies
 *  .clipt-block__content               — text to copy (innerText)
 *  .clipt-block__button[data-label]    — original label for restore
 *  .clipt-block__button-label          — <span> whose text is swapped
 *
 * @param {Object} props
 * @return {JSX.Element}
 */
export default function save( { attributes } ) {
	const {
		content,
		buttonLabel,
		successMessage,
		buttonBgColor,
		buttonTextColor,
		theme,
		label,
		showLabel,
		showSymbolIcon,
		showCopyIcon,
		inputClickToCopy,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className:          `clipt-block clipt-block--${ theme }`,
		'data-success':     successMessage || 'Copied!',
		'data-theme':       theme,
		'data-input-click': inputClickToCopy ? '1' : '0',
	} );

	const buttonStyle = {
		backgroundColor: buttonBgColor,
		color:           buttonTextColor,
	};

	/** Standard copy button for box-style themes (1, 2, 3, 5). */
	const CopyButton = (
		<button
			className="clipt-block__button"
			type="button"
			style={ buttonStyle }
			data-label={ buttonLabel }
			aria-live="polite"
		>
			{ showCopyIcon && <IconCopy /> }
			<span className="clipt-block__button-label">{ buttonLabel }</span>
		</button>
	);

	/** Content div for box-style themes. */
	const ContentEl = (
		<RichText.Content
			tagName="div"
			className="clipt-block__content"
			value={ content }
		/>
	);

	/** Optional label above the block. */
	const LabelEl = showLabel && label && (
		<div className="clipt-block__label">{ label }</div>
	);

	const renderTheme = () => {
		switch ( theme ) {

			case 'theme-1':
				return (
					<div className="clipt-theme clipt-theme--1">
						{ LabelEl }
						<div className="clipt-theme__box">
							{ ContentEl }
							<div className="clipt-theme__btn-wrap">{ CopyButton }</div>
						</div>
					</div>
				);

			case 'theme-2':
				return (
					<div className="clipt-theme clipt-theme--2">
						{ LabelEl }
						<div className="clipt-theme__box">
							<div className="clipt-theme__btn-wrap">{ CopyButton }</div>
							{ ContentEl }
						</div>
					</div>
				);

			case 'theme-3':
				return (
					<div className="clipt-theme clipt-theme--3">
						{ LabelEl }
						<div className="clipt-theme__row">
							<div className="clipt-theme__box">{ ContentEl }</div>
							<div className="clipt-theme__btn-wrap">{ CopyButton }</div>
						</div>
					</div>
				);

			case 'theme-4':
				return (
					<div className="clipt-theme clipt-theme--4">
						{ LabelEl }
						<PillSave
							style={ buttonStyle }
							iconLeft={  showSymbolIcon ? <IconGift /> : null }
							iconRight={ showCopyIcon   ? <IconCopy /> : null }
							content={ content }
							buttonLabel={ buttonLabel }
						/>
					</div>
				);

			case 'theme-5':
				return (
					<div className="clipt-theme clipt-theme--5">
						{ LabelEl }
						<div className="clipt-theme__box clipt-theme__box--full">
							{ ContentEl }
						</div>
						<div className="clipt-theme__btn-wrap clipt-theme__btn-wrap--center">
							{ CopyButton }
						</div>
					</div>
				);

			case 'theme-6':
				return (
					<div className="clipt-theme clipt-theme--6">
						{ LabelEl }
						<PillSave
							style={ buttonStyle }
							iconLeft={  showSymbolIcon ? <IconMail /> : null }
							iconRight={ showCopyIcon   ? <IconCopy /> : null }
							content={ content }
							buttonLabel={ buttonLabel }
						/>
					</div>
				);

			case 'theme-7':
				return (
					<div className="clipt-theme clipt-theme--7">
						{ LabelEl }
						<PillSave
							iconLeft={  showSymbolIcon ? <IconGlobe /> : null }
							iconRight={ showCopyIcon   ? <IconCopy />  : null }
							content={ content }
							buttonLabel={ buttonLabel }
						/>
					</div>
				);

			case 'theme-8':
				return (
					<div className="clipt-theme clipt-theme--8">
						{ LabelEl }
						<PillSave
							iconLeft={  showSymbolIcon ? <IconCode /> : null }
							iconRight={ showCopyIcon   ? <IconCopy /> : null }
							content={ content }
							buttonLabel={ buttonLabel }
						/>
					</div>
				);

			case 'theme-9':
				return (
					<div className="clipt-theme clipt-theme--9">
						{ LabelEl }
						<PillSave
							iconLeft={  showSymbolIcon ? <IconHash /> : null }
							iconRight={ showCopyIcon   ? <IconCopy /> : null }
							content={ content }
							buttonLabel={ buttonLabel }
						/>
					</div>
				);

			case 'theme-10':
				return (
					<div className="clipt-theme clipt-theme--10">
						{ LabelEl }
						<PillSave
							iconLeft={  showSymbolIcon ? <IconKey />  : null }
							iconRight={ showCopyIcon   ? <IconCopy /> : null }
							content={ content }
							buttonLabel={ buttonLabel }
						/>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div { ...blockProps }>{ renderTheme() }</div>
	);
}
