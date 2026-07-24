<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class YANXINNA_Headless_Fields {
	const GROUP_KEY = 'group_yanxinna_products_v1';

	/** 站点默认语言，只有这一种语言的文案是必填，其余语言留空时由 API 回退。 */
	const DEFAULT_LOCALE = 'ru-RU';

	private static $locales = array(
		'ru-RU' => 'Russian',
		'en-US' => 'English (United States)',
		'en-GB' => 'English (United Kingdom)',
		'fr-FR' => 'French',
		'de-DE' => 'German',
	);

	public static function register() {
		if ( ! function_exists( 'acf_add_local_field_group' ) ) {
			return;
		}

		acf_add_local_field_group(
			array(
				'key'                   => self::GROUP_KEY,
				'title'                 => 'YANXINNA Product Data v1',
				'fields'                => self::fields(),
				'location'              => array(
					array(
						array(
							'param'    => 'post_type',
							'operator' => '==',
							'value'    => YANXINNA_Headless_Content::POST_TYPE,
						),
					),
				),
				'menu_order'            => 0,
				'position'              => 'normal',
				'style'                 => 'default',
				'label_placement'       => 'top',
				'instruction_placement' => 'label',
				'active'                => true,
				'show_in_rest'          => false,
			)
		);
	}

	public static function validate_product_number( $valid, $value, $field, $input ) {
		unset( $field, $input );

		if ( true !== $valid || ! $value ) {
			return $valid;
		}

		$post_id = isset( $_POST['post_ID'] ) ? absint( wp_unslash( $_POST['post_ID'] ) ) : 0;
		$matches = get_posts(
			array(
				'post_type'      => YANXINNA_Headless_Content::POST_TYPE,
				'post_status'    => 'any',
				'posts_per_page' => 1,
				'post__not_in'   => $post_id ? array( $post_id ) : array(),
				'meta_query'     => array(
					array(
						'key'     => 'product_number',
						'value'   => sanitize_text_field( $value ),
						'compare' => '=',
					),
				),
				'fields'         => 'ids',
			)
		);

		return $matches
			? __( 'Product number must be unique.', 'yanxinna-headless-products' )
			: $valid;
	}

	private static function fields() {
		return array(
			self::text_field( 'product_number', 'Product number', true ),
			self::image_field( 'hover_image', 'Hover image', false ),
			array(
				'key'           => 'field_yx_v1_gallery',
				'label'         => 'Product gallery',
				'name'          => 'gallery',
				'type'          => 'gallery',
				'return_format' => 'array',
				'preview_size'  => 'medium',
				'library'       => 'all',
			),
			self::sizes_field(),
			self::colors_field(),
			self::parameters_field(),
			self::attachments_field(),
			array(
				'key'           => 'field_yx_v1_compression_level',
				'label'         => 'Compression level',
				'name'          => 'compression_level',
				'type'          => 'select',
				'choices'       => array(
					'Light'  => 'Light',
					'Medium' => 'Medium',
					'Firm'   => 'Firm',
				),
				'allow_null'    => true,
				'return_format' => 'value',
				'ui'            => true,
			),
			self::boolean_field( 'featured', 'Featured on homepage' ),
			self::boolean_field( 'best_seller', 'Best seller' ),
			array(
				'key'           => 'field_yx_v1_sort_order',
				'label'         => 'Display order',
				'name'          => 'sort_order',
				'type'          => 'number',
				'default_value' => 0,
				'step'          => 1,
			),
			array(
				'key'           => 'field_yx_v1_complete_the_look',
				'label'         => 'Related products',
				'name'          => 'complete_the_look',
				'type'          => 'relationship',
				'post_type'     => array( YANXINNA_Headless_Content::POST_TYPE ),
				'filters'       => array( 'search', 'taxonomy' ),
				'return_format' => 'id',
			),
			self::translations_field(),
		);
	}

	private static function sizes_field() {
		return array(
			'key'          => 'field_yx_v1_sizes',
			'label'        => 'Available specifications / sizes',
			'name'         => 'sizes',
			'type'         => 'repeater',
			'required'     => true,
			'min'          => 1,
			'layout'       => 'table',
			'button_label' => 'Add size',
			'sub_fields'   => array(
				self::text_field( 'size_value', 'Value', true, 'value' ),
			),
		);
	}

	private static function colors_field() {
		$sub_fields = array(
			array(
				'key'      => 'field_yx_v1_color_hex',
				'label'    => 'Colour',
				'name'     => 'hex',
				'type'     => 'color_picker',
				'required' => true,
			),
			self::image_field( 'color_image', 'Product image', true, 'image' ),
			self::image_field( 'color_hover_image', 'Model / hover image', true, 'hover_image' ),
			self::localized_group( 'color_names', 'Colour names', 'names', true ),
		);

		return array(
			'key'          => 'field_yx_v1_colors',
			'label'        => 'Available colours',
			'name'         => 'colors',
			'type'         => 'repeater',
			'required'     => true,
			'min'          => 1,
			'layout'       => 'block',
			'button_label' => 'Add colour',
			'sub_fields'   => $sub_fields,
		);
	}

	private static function parameters_field() {
		return array(
			'key'          => 'field_yx_v1_parameters',
			'label'        => 'Product parameters',
			'name'         => 'parameters',
			'type'         => 'repeater',
			'layout'       => 'block',
			'button_label' => 'Add parameter',
			'sub_fields'   => array(
				self::localized_group( 'parameter_labels', 'Labels', 'labels', true ),
				self::localized_group( 'parameter_values', 'Values', 'values', true ),
			),
		);
	}

	private static function attachments_field() {
		return array(
			'key'          => 'field_yx_v1_attachments',
			'label'        => 'PDF / document attachments',
			'name'         => 'attachments',
			'type'         => 'repeater',
			'layout'       => 'block',
			'button_label' => 'Add attachment',
			'sub_fields'   => array(
				array(
					'key'           => 'field_yx_v1_attachment_file',
					'label'         => 'File',
					'name'          => 'file',
					'type'          => 'file',
					'required'      => true,
					'return_format' => 'array',
					'library'       => 'all',
					'mime_types'    => 'pdf,doc,docx,xls,xlsx,zip',
				),
				self::localized_group( 'attachment_labels', 'Display labels', 'labels', true ),
			),
		);
	}

	private static function translations_field() {
		$locale_groups = array();

		foreach ( self::$locales as $locale => $label ) {
			$key_suffix      = strtolower( str_replace( '-', '_', $locale ) );
			$is_default      = self::DEFAULT_LOCALE === $locale;
			$locale_groups[] = array(
				'key'          => 'field_yx_v1_translation_' . $key_suffix,
				'label'        => $is_default ? $label : $label . '（可留空，留空时回退到俄语）',
				'name'         => $locale,
				'type'         => 'group',
				'layout'       => 'block',
				'sub_fields'   => self::translation_fields( $key_suffix, $is_default ),
			);
		}

		return array(
			'key'        => 'field_yx_v1_translations',
			'label'      => 'Translations',
			'name'       => 'translations',
			'type'       => 'group',
			'layout'     => 'block',
			'sub_fields' => $locale_groups,
		);
	}

	private static function translation_fields( $key_suffix, $required ) {
		return array(
			self::text_field( 'translation_' . $key_suffix . '_name', 'Product name', $required, 'name' ),
			array(
				'key'       => 'field_yx_v1_translation_' . $key_suffix . '_short_description',
				'label'     => 'Short description',
				'name'      => 'short_description',
				'type'      => 'textarea',
				'required'  => $required,
				'rows'      => 3,
				'new_lines' => 'br',
			),
			array(
				'key'          => 'field_yx_v1_translation_' . $key_suffix . '_description',
				'label'        => 'Full description',
				'name'         => 'description',
				'type'         => 'wysiwyg',
				'required'     => $required,
				'tabs'         => 'all',
				'toolbar'      => 'basic',
				'media_upload' => false,
			),
			self::text_field( 'translation_' . $key_suffix . '_badge', 'Badge', false, 'badge' ),
			self::text_field( 'translation_' . $key_suffix . '_fabric', 'Fabric', $required, 'fabric' ),
			self::text_field( 'translation_' . $key_suffix . '_care', 'Care', $required, 'care' ),
			array(
				'key'          => 'field_yx_v1_translation_' . $key_suffix . '_benefits',
				'label'        => 'Benefits',
				'name'         => 'benefits',
				'type'         => 'repeater',
				'required'     => $required,
				'min'          => $required ? 1 : 0,
				'layout'       => 'table',
				'button_label' => 'Add benefit',
				'sub_fields'   => array(
					self::text_field(
						'translation_' . $key_suffix . '_benefit_value',
						'Benefit',
						$required,
						'value'
					),
				),
			),
			self::text_field( 'translation_' . $key_suffix . '_seo_title', 'SEO title', $required, 'seo_title' ),
			array(
				'key'       => 'field_yx_v1_translation_' . $key_suffix . '_seo_description',
				'label'     => 'SEO description',
				'name'      => 'seo_description',
				'type'      => 'textarea',
				'required'  => $required,
				'rows'      => 3,
				'maxlength' => 320,
			),
		);
	}

	private static function localized_group( $key_name, $label, $name, $required ) {
		$sub_fields = array();

		foreach ( self::$locales as $locale => $locale_label ) {
			$key_suffix   = strtolower( str_replace( '-', '_', $locale ) );
			$sub_fields[] = self::text_field(
				$key_name . '_' . $key_suffix,
				$locale_label,
				$required && self::DEFAULT_LOCALE === $locale,
				$locale
			);
		}

		return array(
			'key'        => 'field_yx_v1_' . $key_name,
			'label'      => $label,
			'name'       => $name,
			'type'       => 'group',
			'layout'     => 'block',
			'sub_fields' => $sub_fields,
		);
	}

	private static function text_field( $key_name, $label, $required, $name = null ) {
		return array(
			'key'      => 'field_yx_v1_' . $key_name,
			'label'    => $label,
			'name'     => $name ? $name : $key_name,
			'type'     => 'text',
			'required' => $required,
		);
	}

	private static function image_field( $key_name, $label, $required, $name = null ) {
		return array(
			'key'           => 'field_yx_v1_' . $key_name,
			'label'         => $label,
			'name'          => $name ? $name : $key_name,
			'type'          => 'image',
			'required'      => $required,
			'return_format' => 'array',
			'preview_size'  => 'medium',
			'library'       => 'all',
		);
	}

	private static function boolean_field( $name, $label ) {
		return array(
			'key'           => 'field_yx_v1_' . $name,
			'label'         => $label,
			'name'          => $name,
			'type'          => 'true_false',
			'default_value' => false,
			'ui'            => true,
		);
	}
}
