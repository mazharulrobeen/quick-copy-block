<?php
/**
 * Core block registration class for Quick Copy Block.
 *
 * Registers the block via block.json and enqueues the frontend
 * clipboard script only on pages where the block is used.
 *
 * @package Quick_Copy_Block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Quick_Copy_Block
 *
 * Singleton. Bootstrap via Quick_Copy_Block::get_instance().
 */
class Quick_Copy_Block {

	/**
	 * Plugin instance.
	 *
	 * @var Quick_Copy_Block|null
	 */
	private static $instance = null;

	/**
	 * Returns the single instance of this class.
	 *
	 * @return Quick_Copy_Block
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor. Hooks into WordPress.
	 */
	private function __construct() {
		add_action( 'init', array( $this, 'register_block' ) );
	}

	/**
	 * Registers the Gutenberg block using block.json as the manifest.
	 *
	 * The frontend script handle is declared in block.json viewScript.
	 * WordPress automatically enqueues it only on pages containing the block.
	 *
	 * @return void
	 */
	public function register_block() {
		register_block_type( QUICK_COPY_BLOCK_PLUGIN_DIR . 'block.json' );
	}
}
