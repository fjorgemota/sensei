<?php
/**
 * File containing the Sensei_Course_Video_Blocks_Youtube_Extension class.
 *
 * @package sensei-lms
 * @since 3.15.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Extends standard Embed block with YouTube specific functionality for video course progression
 *
 * @since 3.15.0
 *
 * @deprecated $$next-version$$
 */
class Sensei_Course_Video_Blocks_Youtube_Extension extends Sensei_Course_Video_Blocks_Embed_Extension {
	/**
	 * Instance of class.
	 *
	 * @var self
	 */
	private static $instance;

	/**
	 * Returns an instance of the class.
	 *
	 * @deprecated $$next-version$$
	 *
	 * @return static
	 */
	public static function instance() {
		_deprecated_function( __METHOD__, '$$next-version$$' );

		if ( self::$instance ) {
			return self::$instance;
		}

		self::$instance = new self();
		return self::$instance;
	}

	/**
	 * Sensei_Course_Video_Blocks_Youtube_Extension constructor.
	 *
	 * @deprecated $$next-version$$
	 */
	private function __construct() {
		_deprecated_function( __METHOD__, '$$next-version$$' );
	}
	/**
	 * Initialize the class and hooks.
	 */
	public function init() {
		_deprecated_function( __METHOD__, '$$next-version$$' );

		parent::init();
		add_filter( 'embed_oembed_html', [ $this, 'replace_iframe_url' ], 11, 2 );
	}

	/**
	 * Replace the iframe URL enabling JS API and providing origin.
	 *
	 * @deprecated $$next-version$$
	 *
	 * @param string $html
	 * @param string $url
	 *
	 * @return string
	 */
	public function replace_iframe_url( $html, $url ): string {
		_deprecated_function( __METHOD__, '$$next-version$$' );

		if ( ! $this->is_supported( $url ) ) {
			return $html;
		}

		return preg_replace_callback(
			'/src="(.*?)"/',
			function ( $matches ) {
				$modified_url = add_query_arg(
					array(
						'enablejsapi' => 1,
						'origin'      => esc_url( home_url() ),
					),
					$matches[1]
				);

				return 'src="' . $modified_url . '"';
			},
			$html
		);
	}

	/**
	 * Check if the URL is a YouTube URL.
	 *
	 * @deprecated $$next-version$$
	 *
	 * @param string $url
	 *
	 * @return bool
	 */
	protected function is_supported( string $url ): bool {
		_deprecated_function( __METHOD__, '$$next-version$$' );

		$host = wp_parse_url( $url, PHP_URL_HOST );

		return strpos( $host, 'youtu.be' ) !== false || strpos( $host, 'youtube.com' ) !== false;
	}

	/**
	 * Returns the class name for the extension.
	 *
	 * @deprecated $$next-version$$
	 *
	 * @return string
	 */
	protected function get_extension_class_name(): string {
		_deprecated_function( __METHOD__, '$$next-version$$' );

		return 'youtube-extension';
	}
}
