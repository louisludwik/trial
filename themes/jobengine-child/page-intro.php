<?php
/* 
 * Template Name: Intro Page 1
 */
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<!-- Use the .htaccess and remove these lines to avoid edge case issues.
				 More info: h5bp.com/i/378 -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<!-- 	<meta name="viewport" content="width=device-width, initial-scale=1"  /> -->
	<meta name="description" content="<?php echo get_bloginfo( 'description') ?>" />
	<meta name="keywords" content="Job, Jobs, company, employer, employee" />
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<title><?php 
		/*
		 * Print the <title> tag based on what is being viewed.
		 */
		global $page, $paged, $current_user, $user_ID;

		wp_title( ' ', true, 'right' );

		// Add the blog name.
		//bloginfo( 'name' );
		
		// Add the blog description for the home/front page.
		//$site_description = get_bloginfo( 'description', 'display' );
		//if ( $site_description && ( is_home() || is_front_page() ) )
		//	echo " | $site_description";

		// Add a page number if necessary:
		//if ( $paged >= 2 || $page >= 2 )
		//	echo ' | ' . sprintf( __( 'Page %s', ET_DOMAIN ), max( $paged, $page ) );

		

	?></title>
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
	<?php
		if ( is_singular() && get_option( 'thread_comments' ) )
			wp_enqueue_script( 'comment-reply' );

		$general_opts	= new ET_GeneralOptions();
		$favicon	= $general_opts->get_favicon();
		if($favicon){
		?>
			<link rel="shortcut icon" href="<?php echo $favicon[0];?>"/>
	<?php } ?>
	<!-- enqueue json library for ie 7 or below -->
	<!--[if LTE IE 7]>
		<?php wp_enqueue_script('et_json') ?>
	<![endif]-->
	<?php wp_head(); ?>
	
	<!--[if IE]>
		<link rel="stylesheet" type="text/css" href="<?php bloginfo('template_url')?>/css/custom-ie.css" charset="utf-8" /> 
	<![endif]-->

	<!--[if lte IE 8]> 
		<link rel="stylesheet" type="text/css" href="<?php bloginfo('template_url')?>/css/custom-ie8.css" charset="utf-8" /> 
		<script src="<?php bloginfo('template_url')?>/js/cufon-yui.js" type="text/javascript"></script>
		<script src="<?php bloginfo('template_url')?>/js/Pictos_RIP_400.font.js" type="text/javascript"></script>
	<![endif]-->
</head>
	<?php
			$general_opts	= new ET_GeneralOptions();
			$favicon	= $general_opts->get_favicon();
			$website_logo	= $general_opts->get_website_logo();
	 ?>
    <body id="intro" data-page="main" <?php body_class(); ?>>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
        <!-- Preloading -->
        
        <div class="mask-color">
            <div id="preview-area">
            	<div class="logo-image-preloading"><img src="<?php echo TEMPLATEURL; ?>/img/preloading-logo.png" alt="EngineTheme"></div>
                <div class="spinner">
                  <div class="bounce1"></div>
                  <div class="bounce2"></div>
                  <div class="bounce3"></div>
                </div>
            </div>
            <div class="page-main"></div>
            <div class="page-left"></div>
            <div class="page-right"></div>
        </div>
        <!-- Preloading / End -->
        
        
        <?php
		  $backgrounds = glob(get_template_directory().'/bgs/*.jpg');
		  shuffle($backgrounds);
		  $file_path=str_replace('\\','/',$backgrounds[0]);
		  $file_path=str_replace($_SERVER['DOCUMENT_ROOT'],'',$file_path);
		  $file_path='http://'.$_SERVER['HTTP_HOST'].$file_path;
		  
		?>
        <!-- Slider -->
        <div class="slider-wrapper" style="background: url(<?php echo $file_path; ?>) no-repeat center center;background-size:cover">
        	<div class="container">
                <div class="logo">
                    <a href="#" class="logo w500">
                        <img src="<?php echo $website_logo[0];?>" alt="<?php echo $general_opts->get_site_title();  ?>" />
                    </a>	
                </div>
               
                <div class="center">
                    <h1 class="top">
                    	<div id="intro-slogan">
                        	<?php echo $general_opts->get_site_demonstration (); ?>
                        </div>
                    </h1>
					
                    <div class="modal-form-intro">
					<?php wp_login_form(	array(
                                                'echo'           => true,
                                                'redirect'       =>  home_url(), 
                                                'form_id'        => 'loginform',
                                                'label_username' => __( 'Username' ),
                                                'label_password' => __( 'Password' ),
                                                'label_remember' => __( 'Remember Me' ),
                                                'label_log_in'   => __( 'Log In' ),
                                                'id_username'    => 'user_login',
                                                'id_password'    => 'user_pass',
                                                'id_remember'    => 'rememberme',
                                                'id_submit'      => 'wp-submit',
                                                'remember'       => true,
                                                'value_username' => NULL,
                                                'value_remember' => false
                                                )
                                        ); 
					?>
                    </div>
                    
                </div>
            </div>		
        </div>
        <!-- Slider / End -->
        
        <!-- Page content -->
        <?php 
        if(have_posts()) { the_post();
            global $post;
            if($post->post_content != ''){
                the_content ();  
            }  else {
            ?>
                <div class="wrapper">
                    <div class="container">
                    	<div id="boxes">
                            <div id="lbox">
                              <div class="inner-box">
                                    <h2 class="section-heading">Find Jobs!</h2>
                                    <p class="lead">
                                        <ul class="padleft20">
                                            <li>Apply to unlimited Jobs!</li>
                                            <li>Be found by Employers!</li> 
                                            <li>And much more…</li>
                                        </ul>
                                     </p>   
                                     <div class="center-btn">
                                        <a class="btn btn-red big-btn" href="<?php echo et_get_page_link('jobseeker-signup'); ?>" title="Create My Profile!"><?php echo  __('Create My Profile!', ET_DOMAIN); ?></a> 
                                     </div>
                                </div>
                            </div>
                            <div id="rbox">
                              <div class="inner-box">
                                <h2 class="section-heading">Hire Talent!</h2>
                                <p class="lead">
                                    <ul class="padleft20">
                                        <li>Access amazing profiles!</li>
                                        <li>Post unlimited Jobs!</li> 
                                        <li>And much more…</li>
                                    </ul>
                                </p>
                                <div class="center-btn">
                                	<a class="btn btn-blue big-btn" href="<?php echo et_get_page_link('post-a-job'); ?>" title="Register Now!"><?php echo __('Register Now!', ET_DOMAIN); ?></a>
                                </div>
                            </div>
                          </div>  
                        </div>
            		</div>
                    <!-- /.container -->
                    
                </div>
            <?php 
            }
        } 
        ?>
        
        <!-- Page content / End -->
         
        <script >
        	jQuery(document).ready(function($) {
				$('.mask-color').fadeOut(1700);
				var height = $('.slider-wrapper').height();
				$(window).scroll(function(){        
			        var st = $(this).scrollTop();
			        if ( st > height){

			                $('header').stop().css({'display':'block'});

			        }
			        else
			        {

			                $('header').stop().css({'display':'none'});

			        }
			    
			    });
				
			});

        </script>

<?php 
get_footer();