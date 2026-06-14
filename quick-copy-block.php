<?php
/**
 * Plugin Name:       Quick Copy Block
 * Plugin URI:        https://wordpress.org/plugins/quick-copy-block/
 * Description:       A Gutenberg block that adds a one-click copy-to-clipboard button to any text content — quotes, code snippets, and more.
 * Version:           1.2.1
 * Requires at least: 6.6
 * Requires PHP:      7.4
 * Author:            Robeen
 * Author URI:        https://mazharulrobeen.wordpress.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       quick-copy-block
 *
 * @package Quick_Copy_Block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'QUICK_COPY_BLOCK_VERSION', '1.2.1' );
define( 'QUICK_COPY_BLOCK_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'QUICK_COPY_BLOCK_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Load plugin classes.
 */
require_once QUICK_COPY_BLOCK_PLUGIN_DIR . 'includes/class-quick-copy-block.php';

/**
 * Initialise the plugin.
 *
 * @return void
 */
function quick_copy_block_init() {
	Quick_Copy_Block::get_instance();
}
add_action( 'plugins_loaded', 'quick_copy_block_init' );
