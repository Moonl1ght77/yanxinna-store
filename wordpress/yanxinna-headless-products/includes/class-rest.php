<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class YANXINNA_Headless_REST {
	const NAMESPACE = 'yanxinna/v1';

	private static $locales = array( 'ru-RU', 'en-US', 'en-GB', 'fr-FR', 'de-DE' );

	public static function register_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/products',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_products' ),
				'permission_callback' => '__return_true',
				'args'                => self::product_query_args(),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/products/(?P<slug>[a-zA-Z0-9-]+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_product' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'slug' => array(
						'required'          => true,
						'sanitize_callback' => 'sanitize_title',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/categories',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_categories' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	public static function get_products( WP_REST_Request $request ) {
		if ( ! function_exists( 'get_field' ) ) {
			return new WP_Error(
				'yanxinna_acf_unavailable',
				__( 'Product content is temporarily unavailable.', 'yanxinna-headless-products' ),
				array( 'status' => 503 )
			);
		}

		$query_args = array(
			'post_type'      => YANXINNA_Headless_Content::POST_TYPE,
			'post_status'    => 'publish',
			'posts_per_page' => (int) $request->get_param( 'per_page' ),
			'paged'          => (int) $request->get_param( 'page' ),
			'meta_key'       => 'sort_order',
			'orderby'        => array(
				'meta_value_num' => 'ASC',
				'date'           => 'DESC',
			),
			'order'          => 'ASC',
			'no_found_rows'  => false,
		);

		$tax_query = self::build_tax_query( $request );
		if ( $tax_query ) {
			$query_args['tax_query'] = $tax_query;
		}

		$meta_query = self::build_meta_query( $request );
		if ( $meta_query ) {
			$query_args['meta_query'] = $meta_query;
		}

		$query    = new WP_Query( $query_args );
		$products = array();

		foreach ( $query->posts as $post ) {
			$product = self::map_product( $post );
			if ( $product ) {
				$products[] = $product;
			}
		}

		$response = rest_ensure_response( $products );
		$response->header( 'X-WP-Total', (string) (int) $query->found_posts );
		$response->header( 'X-WP-TotalPages', (string) max( 1, (int) $query->max_num_pages ) );

		return $response;
	}

	public static function get_product( WP_REST_Request $request ) {
		if ( ! function_exists( 'get_field' ) ) {
			return new WP_Error(
				'yanxinna_acf_unavailable',
				__( 'Product content is temporarily unavailable.', 'yanxinna-headless-products' ),
				array( 'status' => 503 )
			);
		}

		$post = get_page_by_path(
			$request->get_param( 'slug' ),
			OBJECT,
			YANXINNA_Headless_Content::POST_TYPE
		);

		if ( ! $post || 'publish' !== $post->post_status ) {
			return new WP_Error(
				'yanxinna_product_not_found',
				__( 'Product not found.', 'yanxinna-headless-products' ),
				array( 'status' => 404 )
			);
		}

		$product = self::map_product( $post );
		if ( ! $product ) {
			return new WP_Error(
				'yanxinna_product_not_found',
				__( 'Product not found.', 'yanxinna-headless-products' ),
				array( 'status' => 404 )
			);
		}

		return rest_ensure_response( $product );
	}

	public static function get_categories() {
		$terms = get_terms(
			array(
				'taxonomy'   => YANXINNA_Headless_Content::TAXONOMY,
				'hide_empty' => false,
				'orderby'    => 'name',
				'order'      => 'ASC',
			)
		);

		if ( is_wp_error( $terms ) ) {
			return new WP_Error(
				'yanxinna_categories_unavailable',
				__( 'Product categories are temporarily unavailable.', 'yanxinna-headless-products' ),
				array( 'status' => 500 )
			);
		}

		return rest_ensure_response(
			array_map(
				function ( $term ) {
					return array(
						'id'     => (int) $term->term_id,
						'slug'   => sanitize_title( $term->slug ),
						'name'   => sanitize_text_field( $term->name ),
						'parent' => (int) $term->parent,
					);
				},
				$terms
			)
		);
	}

	private static function product_query_args() {
		$boolean_validator = function ( $value ) {
			return in_array( strtolower( (string) $value ), array( 'true', 'false', '1', '0' ), true );
		};

		return array(
			'category'    => array(
				'sanitize_callback' => 'sanitize_title',
			),
			'subcategory' => array(
				'sanitize_callback' => 'sanitize_title',
			),
			'featured'    => array(
				'sanitize_callback' => 'sanitize_text_field',
				'validate_callback' => $boolean_validator,
			),
			'best_seller' => array(
				'sanitize_callback' => 'sanitize_text_field',
				'validate_callback' => $boolean_validator,
			),
			'search'      => array(
				'sanitize_callback' => 'sanitize_text_field',
			),
			'page'        => array(
				'default'           => 1,
				'sanitize_callback' => 'absint',
				'validate_callback' => function ( $value ) {
					return (int) $value >= 1;
				},
			),
			'per_page'    => array(
				'default'           => 20,
				'sanitize_callback' => 'absint',
				'validate_callback' => function ( $value ) {
					return (int) $value >= 1 && (int) $value <= 100;
				},
			),
		);
	}

	private static function build_tax_query( WP_REST_Request $request ) {
		$clauses = array();

		foreach ( array( 'category', 'subcategory' ) as $parameter ) {
			$slug = $request->get_param( $parameter );
			if ( $slug ) {
				$clauses[] = array(
					'taxonomy' => YANXINNA_Headless_Content::TAXONOMY,
					'field'    => 'slug',
					'terms'    => array( sanitize_title( $slug ) ),
				);
			}
		}

		if ( ! $clauses ) {
			return array();
		}

		return array_merge( array( 'relation' => 'AND' ), $clauses );
	}

	private static function build_meta_query( WP_REST_Request $request ) {
		$clauses = array( 'relation' => 'AND' );

		foreach (
			array(
				'featured'    => 'featured',
				'best_seller' => 'best_seller',
			) as $parameter => $meta_key
		) {
			$value = $request->get_param( $parameter );
			if ( null !== $value && '' !== $value ) {
				$clauses[] = array(
					'key'     => $meta_key,
					'value'   => self::is_truthy( $value ) ? '1' : '0',
					'compare' => '=',
				);
			}
		}

		$search = $request->get_param( 'search' );
		if ( $search ) {
			$search_clauses = array(
				'relation' => 'OR',
				array(
					'key'     => 'product_number',
					'value'   => sanitize_text_field( $search ),
					'compare' => 'LIKE',
				),
			);

			foreach ( self::$locales as $locale ) {
				$search_clauses[] = array(
					'key'     => 'translations_' . $locale . '_name',
					'value'   => sanitize_text_field( $search ),
					'compare' => 'LIKE',
				);
			}

			$clauses[] = $search_clauses;
		}

		return count( $clauses ) > 1 ? $clauses : array();
	}

	private static function is_truthy( $value ) {
		return in_array( strtolower( (string) $value ), array( 'true', '1' ), true );
	}

	private static function map_product( WP_Post $post ) {
		$product_number = sanitize_text_field( (string) get_field( 'product_number', $post->ID ) );
		$taxonomy       = self::product_taxonomy( $post->ID );
		$main_image     = self::image_value( get_post_thumbnail_id( $post->ID ) );
		$hover_image    = self::image_value( get_field( 'hover_image', $post->ID ) );
		$gallery        = self::image_list( get_field( 'gallery', $post->ID ) );
		$sizes          = self::sizes( get_field( 'sizes', $post->ID ) );
		$colors         = self::colors( get_field( 'colors', $post->ID ) );
		$parameters     = self::parameters( get_field( 'parameters', $post->ID ) );
		$attachments    = self::attachments( get_field( 'attachments', $post->ID ) );
		$translations   = self::translations( get_field( 'translations', $post->ID ) );
		$missing        = array();

		if ( ! $product_number ) {
			$missing[] = 'product_number';
		}
		if ( ! $post->post_name ) {
			$missing[] = 'slug';
		}
		if ( ! $taxonomy['category'] ) {
			$missing[] = 'category';
		}
		if ( ! $main_image ) {
			$missing[] = 'main_image';
		}
		if ( ! $sizes ) {
			$missing[] = 'sizes';
		}
		if ( ! $colors ) {
			$missing[] = 'colors';
		}
		if ( count( $translations ) !== count( self::$locales ) ) {
			$missing[] = 'translations';
		}

		if ( $missing ) {
			error_log(
				sprintf(
					'[YANXINNA Headless Products] Product %d excluded from public API: %s',
					(int) $post->ID,
					implode( ', ', $missing )
				)
			);
			return null;
		}

		$compression_level = get_field( 'compression_level', $post->ID );

		return array(
			'id'                 => (int) $post->ID,
			'slug'               => sanitize_title( $post->post_name ),
			'product_number'     => $product_number,
			'category'           => $taxonomy['category'],
			'subcategory'        => $taxonomy['subcategory'],
			'main_image'         => $main_image,
			'hover_image'        => $hover_image,
			'gallery'            => $gallery,
			'sizes'              => $sizes,
			'colors'             => $colors,
			'parameters'         => $parameters,
			'attachments'        => $attachments,
			'compression_level'  => in_array( $compression_level, array( 'Light', 'Medium', 'Firm' ), true )
				? $compression_level
				: null,
			'featured'           => (bool) get_field( 'featured', $post->ID ),
			'best_seller'        => (bool) get_field( 'best_seller', $post->ID ),
			'sort_order'         => (int) get_field( 'sort_order', $post->ID ),
			'complete_the_look'  => self::related_product_numbers(
				get_field( 'complete_the_look', $post->ID )
			),
			'translations'       => $translations,
		);
	}

	private static function product_taxonomy( $post_id ) {
		$terms = wp_get_post_terms(
			$post_id,
			YANXINNA_Headless_Content::TAXONOMY,
			array( 'orderby' => 'term_id' )
		);
		$result = array(
			'category'    => null,
			'subcategory' => null,
		);

		if ( is_wp_error( $terms ) ) {
			return $result;
		}

		foreach ( $terms as $term ) {
			if ( 0 === (int) $term->parent && ! $result['category'] ) {
				$result['category'] = self::term_value( $term );
			}
			if ( 0 !== (int) $term->parent && ! $result['subcategory'] ) {
				$result['subcategory'] = self::term_value( $term );
				if ( ! $result['category'] ) {
					$parent = get_term( $term->parent, YANXINNA_Headless_Content::TAXONOMY );
					if ( $parent && ! is_wp_error( $parent ) ) {
						$result['category'] = self::term_value( $parent );
					}
				}
			}
		}

		return $result;
	}

	private static function term_value( WP_Term $term ) {
		return array(
			'id'   => (int) $term->term_id,
			'slug' => sanitize_title( $term->slug ),
			'name' => sanitize_text_field( $term->name ),
		);
	}

	private static function image_value( $value ) {
		if ( ! $value ) {
			return null;
		}

		$attachment_id = is_array( $value ) ? (int) ( $value['ID'] ?? $value['id'] ?? 0 ) : (int) $value;
		$url           = is_array( $value ) && ! empty( $value['url'] )
			? $value['url']
			: wp_get_attachment_url( $attachment_id );

		if ( ! $attachment_id || ! $url ) {
			return null;
		}

		$alt = is_array( $value ) && isset( $value['alt'] )
			? $value['alt']
			: get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );

		return array(
			'id'  => $attachment_id,
			'url' => esc_url_raw( $url ),
			'alt' => sanitize_text_field( (string) $alt ),
		);
	}

	private static function image_list( $rows ) {
		$images = array();
		foreach ( is_array( $rows ) ? $rows : array() as $row ) {
			$image = self::image_value( $row );
			if ( $image ) {
				$images[] = $image;
			}
		}
		return $images;
	}

	private static function sizes( $rows ) {
		$sizes = array();
		foreach ( is_array( $rows ) ? $rows : array() as $row ) {
			$value = sanitize_text_field( (string) ( $row['value'] ?? '' ) );
			if ( $value ) {
				$sizes[] = array( 'value' => $value );
			}
		}
		return $sizes;
	}

	private static function colors( $rows ) {
		$colors = array();
		foreach ( is_array( $rows ) ? $rows : array() as $row ) {
			$names       = self::localized_values( $row['names'] ?? array() );
			$image       = self::image_value( $row['image'] ?? null );
			$hover_image = self::image_value( $row['hover_image'] ?? null );
			$hex         = sanitize_hex_color( $row['hex'] ?? '' );

			if ( ! $names || ! $image || ! $hover_image || ! $hex ) {
				continue;
			}

			$colors[] = array(
				'names'       => $names,
				'hex'         => $hex,
				'image'       => $image,
				'hover_image' => $hover_image,
			);
		}
		return $colors;
	}

	private static function parameters( $rows ) {
		$parameters = array();
		foreach ( is_array( $rows ) ? $rows : array() as $row ) {
			$labels = self::localized_values( $row['labels'] ?? array() );
			$values = self::localized_values( $row['values'] ?? array() );
			if ( $labels && $values ) {
				$parameters[] = array(
					'labels' => $labels,
					'values' => $values,
				);
			}
		}
		return $parameters;
	}

	private static function attachments( $rows ) {
		$attachments = array();
		foreach ( is_array( $rows ) ? $rows : array() as $row ) {
			$file   = $row['file'] ?? null;
			$labels = self::localized_values( $row['labels'] ?? array() );
			$id     = is_array( $file ) ? (int) ( $file['ID'] ?? $file['id'] ?? 0 ) : (int) $file;
			$url    = is_array( $file ) && ! empty( $file['url'] )
				? $file['url']
				: wp_get_attachment_url( $id );
			$mime   = is_array( $file ) && ! empty( $file['mime_type'] )
				? $file['mime_type']
				: get_post_mime_type( $id );

			if ( $id && $url && $mime && $labels ) {
				$attachments[] = array(
					'id'        => $id,
					'url'       => esc_url_raw( $url ),
					'mime_type' => sanitize_mime_type( $mime ),
					'labels'    => $labels,
				);
			}
		}
		return $attachments;
	}

	private static function translations( $rows ) {
		$translations = array();
		$rows         = is_array( $rows ) ? $rows : array();

		foreach ( self::$locales as $locale ) {
			$row = isset( $rows[ $locale ] ) && is_array( $rows[ $locale ] )
				? $rows[ $locale ]
				: array();

			$name            = sanitize_text_field( (string) ( $row['name'] ?? '' ) );
			$short           = sanitize_textarea_field( (string) ( $row['short_description'] ?? '' ) );
			$description     = wp_kses_post( (string) ( $row['description'] ?? '' ) );
			$fabric          = sanitize_text_field( (string) ( $row['fabric'] ?? '' ) );
			$care            = sanitize_text_field( (string) ( $row['care'] ?? '' ) );
			$benefits        = self::benefits( $row['benefits'] ?? array() );
			$seo_title       = sanitize_text_field( (string) ( $row['seo_title'] ?? '' ) );
			$seo_description = sanitize_textarea_field( (string) ( $row['seo_description'] ?? '' ) );

			if ( ! $name || ! $short || ! $description || ! $fabric || ! $care || ! $benefits || ! $seo_title || ! $seo_description ) {
				continue;
			}

			$translations[ $locale ] = array(
				'name'             => $name,
				'short_description' => $short,
				'description'       => $description,
				'badge'             => sanitize_text_field( (string) ( $row['badge'] ?? '' ) ),
				'fabric'            => $fabric,
				'care'              => $care,
				'benefits'          => $benefits,
				'seo_title'         => $seo_title,
				'seo_description'   => $seo_description,
			);
		}

		return self::fill_locale_fallback( $translations );
	}

	/**
	 * 补齐没有内容的语言，避免只翻译了部分语言的产品从公开 API 整条消失。
	 * 回退优先级：ru-RU（站点默认语言）> en-US > 第一个有内容的语言。
	 * 传入为空（一种语言都没填）时返回空数组，由 map_product 判定为不完整产品。
	 */
	private static function fill_locale_fallback( array $values ) {
		if ( ! $values ) {
			return array();
		}

		$fallback = null;
		foreach ( array_merge( array( 'ru-RU', 'en-US' ), self::$locales ) as $locale ) {
			if ( isset( $values[ $locale ] ) ) {
				$fallback = $values[ $locale ];
				break;
			}
		}

		$filled = array();
		foreach ( self::$locales as $locale ) {
			$filled[ $locale ] = isset( $values[ $locale ] ) ? $values[ $locale ] : $fallback;
		}

		return $filled;
	}

	private static function benefits( $rows ) {
		$benefits = array();
		foreach ( is_array( $rows ) ? $rows : array() as $row ) {
			$value = is_array( $row ) ? ( $row['value'] ?? '' ) : $row;
			$value = sanitize_text_field( (string) $value );
			if ( $value ) {
				$benefits[] = $value;
			}
		}
		return $benefits;
	}

	private static function localized_values( $rows ) {
		$values = array();
		$rows   = is_array( $rows ) ? $rows : array();

		foreach ( self::$locales as $locale ) {
			$value = sanitize_text_field( (string) ( $rows[ $locale ] ?? '' ) );
			if ( $value ) {
				$values[ $locale ] = $value;
			}
		}

		return self::fill_locale_fallback( $values );
	}

	private static function related_product_numbers( $rows ) {
		$numbers = array();
		foreach ( is_array( $rows ) ? $rows : array() as $row ) {
			$post_id = is_object( $row ) ? (int) $row->ID : (int) $row;
			if ( ! $post_id || 'publish' !== get_post_status( $post_id ) ) {
				continue;
			}
			$number = sanitize_text_field( (string) get_field( 'product_number', $post_id ) );
			if ( $number ) {
				$numbers[] = $number;
			}
		}
		return array_values( array_unique( $numbers ) );
	}
}
