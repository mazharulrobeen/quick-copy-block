/**
 * Custom webpack config for Clipt.
 *
 * Extends the default @wordpress/scripts config to add a second
 * entry point: src/frontend.js → build/frontend.js
 *
 * This keeps the clipboard logic out of the editor bundle entirely.
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry(),
		frontend: './src/frontend.js',
	},
};
