/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	ColorPicker,
	TextControl,
	ToggleControl,
	SelectControl,
	__experimentalDivider as Divider,
} from '@wordpress/components';

/**
 * Theme definitions.
 *
 * Themes 1–4 existed previously.
 * Themes 5–10 are new additions matching the provided screenshots:
 *
 *  theme-5:  Stacked — full-width box on top, centred button below
 *  theme-6:  Blue solid pill — envelope icon left, text centre, copy icon right
 *  theme-7:  Light grey rounded box — globe icon left, dark text, copy icon right
 *  theme-8:  Dark navy pill — code `<>` icon left, green text, copy icon right
 *  theme-9:  Lavender pill — hash `#` icon left, purple text, copy icon right
 *  theme-10: Light grey box blue border — key icon left, blue text, copy icon right
 *
 * @type {Array<{label: string, value: string}>}
 */
const THEMES = [
	{ label: __( 'Theme 1 — Button inside right',    'quick-copy-block' ), value: 'theme-1'  },
	{ label: __( 'Theme 2 — Button outside left',    'quick-copy-block' ), value: 'theme-2'  },
	{ label: __( 'Theme 3 — Box + button separated', 'quick-copy-block' ), value: 'theme-3'  },
	{ label: __( 'Theme 4 — Gradient pill',          'quick-copy-block' ), value: 'theme-4'  },
	{ label: __( 'Theme 5 — Stacked vertical',       'quick-copy-block' ), value: 'theme-5'  },
	{ label: __( 'Theme 6 — Blue solid pill',        'quick-copy-block' ), value: 'theme-6'  },
	{ label: __( 'Theme 7 — Light box globe',        'quick-copy-block' ), value: 'theme-7'  },
	{ label: __( 'Theme 8 — Dark code pill',         'quick-copy-block' ), value: 'theme-8'  },
	{ label: __( 'Theme 9 — Lavender hash pill',     'quick-copy-block' ), value: 'theme-9'  },
	{ label: __( 'Theme 10 — Key border box',        'quick-copy-block' ), value: 'theme-10' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SVG Icons
// All icons must match save.js exactly for block validation to pass.
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// ThemePreview
//
// BUG FIX for theme-4 (and all pill-style themes):
// The previous implementation wrapped RichText inside a <button disabled>.
// A disabled button intercepts all pointer events including focus, so the
// RichText was impossible to click into and edit.
//
// Fix: Replace the outer <button> with a <div role="button"> in the EDITOR
// ONLY. The save.js still outputs a real <button> for the front end.
// The div has no `disabled` attribute so RichText receives focus normally.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pill layout used by themes 4, 6, 7, 8, 9, 10.
 * Rendered as a <div> in the editor so RichText is focusable.
 *
 * @param {Object} props
 * @return {JSX.Element}
 */
function PillEditor({
    className = '',
    style = {},
    iconLeft,
    iconRight,
    content,
    setAttributes,
    placeholder,
}) {
    return (
        <div
            className={`clipt-theme__pill ${className}`.trim()}
            style={style}
            aria-label={__('Copy button preview — click text to edit', 'quick-copy-block')}
        >
            {iconLeft && (
                <span className="clipt-theme__pill-icon-left">{iconLeft}</span>
            )}
            <RichText
                tagName="span"
                className="clipt-block__content clipt-theme__pill-content"
                value={content}
                onChange={(value) => setAttributes({ content: value })}
                placeholder={placeholder || __('Add text to copy…', 'quick-copy-block')}
                allowedFormats={[]}
                // Ensure RichText is focusable and editable
                keepPlaceholderOnFocus
            />
            {iconRight && (
                <span className="clipt-theme__pill-icon-right">{iconRight}</span>
            )}
        </div>
    );
}

/**
 * ThemePreview — renders the editor-side canvas for the active theme.
 *
 * @param {Object} props
 * @return {JSX.Element|null}
 */
function ThemePreview( {
	theme,
	content,
	buttonLabel,
	buttonBgColor,
	buttonTextColor,
	showSymbolIcon,
	showCopyIcon,
	showLabel,
	label,
	setAttributes,
} ) {
	const buttonStyle = {
		backgroundColor: buttonBgColor,
		color:           buttonTextColor,
	};

	/** Standard copy button for themes 1–3 and 5. */
	const CopyButton = (
		<button
			className="clipt-block__button"
			type="button"
			style={ buttonStyle }
			disabled
			aria-label={ __( 'Copy button preview', 'quick-copy-block' ) }
		>
			{ showCopyIcon && <IconCopy /> }
			<span className="clipt-block__button-label">
				{ buttonLabel || __( 'Copy', 'quick-copy-block' ) }
			</span>
		</button>
	);

	/** Editable content field for themes 1–3 and 5. */
	const ContentField = (
		<RichText
			tagName="div"
			className="clipt-block__content"
			value={ content }
			onChange={ ( value ) => setAttributes( { content: value } ) }
			placeholder={ __( 'Add the text you want visitors to copy…', 'quick-copy-block' ) }
			aria-label={ __( 'Content to copy', 'quick-copy-block' ) }
		/>
	);

	/** Optional label shown above the block. */
	const LabelEl = showLabel && label && (
		<div className="clipt-block__label">{ label }</div>
	);

	switch ( theme ) {

		// ── Themes 1–3: existing layouts ─────────────────────────────────────

		case 'theme-1':
			return (
				<div className="clipt-theme clipt-theme--1">
					{ LabelEl }
					<div className="clipt-theme__box">
						{ ContentField }
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
						{ ContentField }
					</div>
				</div>
			);

		case 'theme-3':
			return (
				<div className="clipt-theme clipt-theme--3">
					{ LabelEl }
					<div className="clipt-theme__row">
						<div className="clipt-theme__box">{ ContentField }</div>
						<div className="clipt-theme__btn-wrap">{ CopyButton }</div>
					</div>
				</div>
			);

		// ── Theme 4: gradient pill ────────────────────────────────────────────
		case 'theme-4':
			return (
				<div className="clipt-theme clipt-theme--4">
					{ LabelEl }
					<PillEditor
						content={ content }
						setAttributes={ setAttributes }
						iconLeft={ showSymbolIcon ? <IconGift /> : null }
						iconRight={ showCopyIcon  ? <IconCopy /> : null }
					/>
				</div>
			);

		// ── Theme 5: stacked ──────────────────────────────────────────────────
		case 'theme-5':
			return (
				<div className="clipt-theme clipt-theme--5">
					{ LabelEl }
					<div className="clipt-theme__box clipt-theme__box--full">
						{ ContentField }
					</div>
					<div className="clipt-theme__btn-wrap clipt-theme__btn-wrap--center">
						{ CopyButton }
					</div>
				</div>
			);

		// ── Theme 6: blue solid pill — mail icon ─────────────────────────────
		case 'theme-6':
			return (
				<div className="clipt-theme clipt-theme--6">
					{ LabelEl }
					<PillEditor
						content={ content }
						setAttributes={ setAttributes }
						iconLeft={ showSymbolIcon ? <IconMail /> : null }
						iconRight={ showCopyIcon  ? <IconCopy /> : null }
					/>
				</div>
			);

		// ── Theme 7: light grey box — globe icon ─────────────────────────────
		case 'theme-7':
			return (
				<div className="clipt-theme clipt-theme--7">
					{ LabelEl }
					<PillEditor
						content={ content }
						setAttributes={ setAttributes }
						iconLeft={ showSymbolIcon ? <IconGlobe /> : null }
						iconRight={ showCopyIcon  ? <IconCopy /> : null }
					/>
				</div>
			);

		// ── Theme 8: dark navy pill — code icon ──────────────────────────────
		case 'theme-8':
			return (
				<div className="clipt-theme clipt-theme--8">
					{ LabelEl }
					<PillEditor
						content={ content }
						setAttributes={ setAttributes }
						iconLeft={ showSymbolIcon ? <IconCode /> : null }
						iconRight={ showCopyIcon  ? <IconCopy /> : null }
					/>
				</div>
			);

		// ── Theme 9: lavender pill — hash icon ───────────────────────────────
		case 'theme-9':
			return (
				<div className="clipt-theme clipt-theme--9">
					{ LabelEl }
					<PillEditor
						content={ content }
						setAttributes={ setAttributes }
						iconLeft={ showSymbolIcon ? <IconHash /> : null }
						iconRight={ showCopyIcon  ? <IconCopy /> : null }
					/>
				</div>
			);

		// ── Theme 10: light grey + blue border — key icon ────────────────────
		case 'theme-10':
			return (
				<div className="clipt-theme clipt-theme--10">
					{ LabelEl }
					<PillEditor
						content={ content }
						setAttributes={ setAttributes }
						iconLeft={ showSymbolIcon ? <IconKey /> : null }
						iconRight={ showCopyIcon  ? <IconCopy /> : null }
					/>
				</div>
			);

		default:
			return null;
	}
}

/**
 * Edit component for the Clipt block.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute updater.
 * @return {JSX.Element} Editor component.
 */
export default function Edit( { attributes, setAttributes } ) {
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

	const blockProps = useBlockProps( {
		className: `clipt-block clipt-block--${ theme }`,
	} );

	return (
		<>
			<InspectorControls>

				{ /* ── Theme ── */ }
				<PanelBody
					title={ __( 'Theme', 'quick-copy-block' ) }
					initialOpen={ true }
					className="quick-copy-block-panel"
				>
					<SelectControl
						label={ __( 'Select a theme', 'quick-copy-block' ) }
						value={ theme }
						options={ THEMES }
						onChange={ ( value ) => setAttributes( { theme: value } ) }
					/>
				</PanelBody>

				{ /* ── Elements ── */ }
				<PanelBody
					title={ __( 'Elements', 'quick-copy-block' ) }
					initialOpen={ true }
					className="quick-copy-block-panel"
				>
					<ToggleControl
						label={ __( 'Show label', 'quick-copy-block' ) }
						checked={ showLabel }
						onChange={ ( value ) => setAttributes( { showLabel: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show symbol icon', 'quick-copy-block' ) }
						checked={ showSymbolIcon }
						onChange={ ( value ) => setAttributes( { showSymbolIcon: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show copy icon', 'quick-copy-block' ) }
						checked={ showCopyIcon }
						onChange={ ( value ) => setAttributes( { showCopyIcon: value } ) }
					/>
					<ToggleControl
						label={ __( 'Click content to copy', 'quick-copy-block' ) }
						checked={ inputClickToCopy }
						onChange={ ( value ) => setAttributes( { inputClickToCopy: value } ) }
					/>
				</PanelBody>

				{ /* ── Label ── */ }
				{ showLabel && (
					<PanelBody
						title={ __( 'Label', 'quick-copy-block' ) }
						initialOpen={ true }
						className="quick-copy-block-panel"
					>
						<TextControl
							label={ __( 'Label', 'quick-copy-block' ) }
							placeholder={ __( 'Enter your label', 'quick-copy-block' ) }
							value={ label }
							onChange={ ( value ) => setAttributes( { label: value } ) }
						/>
					</PanelBody>
				) }

				{ /* ── Button Appearance ── */ }
				<PanelBody
					title={ __( 'Button Appearance', 'quick-copy-block' ) }
					initialOpen={ false }
				>
					<PanelRow>
						<fieldset className="clipt-block__color-fieldset">
							<legend className="clipt-block__color-legend">
								{ __( 'Background color', 'quick-copy-block' ) }
							</legend>
							<ColorPicker
								color={ buttonBgColor }
								onChange={ ( value ) => setAttributes( { buttonBgColor: value } ) }
								enableAlpha={ false }
								defaultValue="#6c8fff"
							/>
						</fieldset>
					</PanelRow>
					<Divider />
					<PanelRow>
						<fieldset className="clipt-block__color-fieldset">
							<legend className="clipt-block__color-legend">
								{ __( 'Text color', 'quick-copy-block' ) }
							</legend>
							<ColorPicker
								color={ buttonTextColor }
								onChange={ ( value ) => setAttributes( { buttonTextColor: value } ) }
								enableAlpha={ false }
								defaultValue="#ffffff"
							/>
						</fieldset>
					</PanelRow>
				</PanelBody>

				{ /* ── Copy Behaviour ── */ }
				<PanelBody
					title={ __( 'Copy Behaviour', 'quick-copy-block' ) }
					initialOpen={ false }
				>
					<TextControl
						label={ __( 'Button label', 'quick-copy-block' ) }
						value={ buttonLabel }
						onChange={ ( value ) => setAttributes( { buttonLabel: value } ) }
					/>
					<TextControl
						label={ __( 'Success message', 'quick-copy-block' ) }
						help={ __( 'Shown for 2 seconds after a successful copy.', 'quick-copy-block' ) }
						value={ successMessage }
						onChange={ ( value ) => setAttributes( { successMessage: value } ) }
					/>
				</PanelBody>

			</InspectorControls>

			<div { ...blockProps }>
				<ThemePreview
					theme={ theme }
					content={ content }
					buttonLabel={ buttonLabel }
					buttonBgColor={ buttonBgColor }
					buttonTextColor={ buttonTextColor }
					showSymbolIcon={ showSymbolIcon }
					showCopyIcon={ showCopyIcon }
					showLabel={ showLabel }
					label={ label }
					setAttributes={ setAttributes }
				/>
			</div>
		</>
	);
}
