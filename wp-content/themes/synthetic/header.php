<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>" />
  <meta name="viewport" content="width=device-width" />
  <?php wp_head(); ?>
  <link rel="stylesheet" href="<?php echo get_theme_file_uri(); ?>/css/main.css">
</head>
<body <?php body_class(); ?>>
<div class="hidden"></div>
<a class="visually-hidden-focusable" href="#main">Skip to main content</a>
<header>
  <div class="container-fluid">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_html( get_bloginfo( 'name' ) ); ?>" rel="home">
      <?php if ( is_front_page() || is_home() || is_front_page() && is_home() ) { echo '<h1>'; }  echo esc_html( get_bloginfo( 'name' ) ); if ( is_front_page() || is_home() || is_front_page() && is_home() ) { echo '</h1>'; } ?>
    </a>
    <div><?php bloginfo( 'description' ); ?></div>
    <nav>
      <?php wp_nav_menu( array( 'theme_location' => 'main-menu' ) ); ?>
    </nav>
  </div>
</header>
<div class="container">
