<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class YANXINNA_Headless_Content {
	const POST_TYPE = 'yx_product';
	const TAXONOMY  = 'yx_product_category';
	const ROLE      = 'yx_product_manager';

	public static function register() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels'              => array(
					'name'          => '产品',
					'singular_name' => '产品',
					'menu_name'     => '产品',
					'all_items'     => '所有产品',
					'add_new'       => '添加产品',
					'add_new_item'  => '添加产品',
					'edit_item'     => '编辑产品',
					'new_item'      => '新产品',
					'view_item'     => '查看产品',
					'search_items'  => '搜索产品',
					'not_found'     => '没有找到产品。',
					'not_found_in_trash' => '回收站里没有产品。',
				),
				'public'              => true,
				'publicly_queryable'  => false,
				'show_ui'             => true,
				'show_in_rest'        => true,
				'rest_base'           => 'yx-products-admin',
				'supports'            => array( 'title', 'thumbnail' ),
				'menu_icon'           => 'dashicons-products',
				'has_archive'         => false,
				'rewrite'             => false,
				'exclude_from_search' => true,
				'capability_type'     => array( 'yx_product', 'yx_products' ),
				'map_meta_cap'        => true,
			)
		);

		register_taxonomy(
			self::TAXONOMY,
			array( self::POST_TYPE ),
			array(
				'labels'            => array(
					'name'          => '产品分类',
					'singular_name' => '产品分类',
					'menu_name'     => '产品分类',
					'all_items'     => '所有分类',
					'edit_item'     => '编辑分类',
					'add_new_item'  => '添加分类',
					'new_item_name' => '新分类名称',
					'parent_item'   => '父级分类',
					'search_items'  => '搜索分类',
				),
				'public'            => true,
				'publicly_queryable' => false,
				'hierarchical'      => true,
				'show_ui'           => true,
				'show_admin_column' => true,
				'show_in_rest'      => true,
				'rest_base'         => 'yx-product-categories-admin',
				'rewrite'           => false,
				'capabilities'      => array(
					'manage_terms' => 'manage_yx_product_terms',
					'edit_terms'   => 'edit_yx_product_terms',
					'delete_terms' => 'delete_yx_product_terms',
					'assign_terms' => 'assign_yx_product_terms',
				),
			)
		);
	}

	public static function install_roles() {
		$capabilities = self::product_capabilities();
		$role         = get_role( self::ROLE );

		if ( ! $role ) {
			$role = add_role(
				self::ROLE,
				__( 'YANXINNA Product Manager', 'yanxinna-headless-products' ),
				array( 'read' => true )
			);
		}

		if ( $role ) {
			foreach ( $capabilities as $capability ) {
				$role->add_cap( $capability );
			}
		}

		$administrator = get_role( 'administrator' );
		if ( $administrator ) {
			foreach ( $capabilities as $capability ) {
				$administrator->add_cap( $capability );
			}
		}
	}

	private static function product_capabilities() {
		return array(
			'read',
			'upload_files',
			'edit_yx_product',
			'read_yx_product',
			'delete_yx_product',
			'edit_yx_products',
			'edit_others_yx_products',
			'publish_yx_products',
			'read_private_yx_products',
			'delete_yx_products',
			'delete_private_yx_products',
			'delete_published_yx_products',
			'delete_others_yx_products',
			'edit_private_yx_products',
			'edit_published_yx_products',
			'manage_yx_product_terms',
			'edit_yx_product_terms',
			'delete_yx_product_terms',
			'assign_yx_product_terms',
		);
	}
}
