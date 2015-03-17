<?php if( is_home() || is_singular('job') || is_page_template('page-dashboard.php') ||

		is_author() || is_post_type_archive( 'job' ) ||

		is_tax('job_type') || is_tax('job_category') || is_search() || apply_filters( 'je_footer_can_print_modal_template', false ) ){

	global $post, $user_ID;



	if ( current_user_can('edit_others_posts') || is_page_template('page-dashboard.php') || ( is_singular('job') && $post->post_author == $user_ID ) ) {

		//$job_categories = et_get_job_categories ();

		je_modal_edit_job_template ();

	}



	// insert modal reject job when logging in as administrators

	if( current_user_can('edit_others_posts') ){

		echo et_template_modal_reject();

	}

	?>



	<!-- move template of job list item here, used mostly in homepage & company page -->

	<script type="text/template" id="job_list_item">

		<?php  echo et_template_frontend_job() ?>

	</script>

	<!-- end template of job list item -->



	<?php

}



if( is_page_template( 'page-upgrade-account.php' ) ||  is_page_template( 'page-dashboard.php' ) ) {

	global $applicant_detail;

	echo '<div style="display:none" >' ;

	wp_editor( $applicant_detail, 'call-to-add-tinymce', je_editor_settings () ) ;

	echo '</div>';

}



if( !is_user_logged_in() || is_page_template('page-post-a-job.php') || is_page_template( 'page-upgrade-account.php' ) ){



	get_template_part( 'template/modal', 'login' );



	et_template_modal_register();



	et_template_modal_forgot_pass();

}



$general_opt	=	new ET_GeneralOptions();

$copyright		=	$general_opt->get_copyright();

$has_footer_nav	=	false;

if( has_nav_menu('et_footer') ) {

	$has_footer_nav	=	true;

}



?>



	<footer class="bg-footer">

		<div class="main-center">

			<div class="f-left <?php if($has_footer_nav) echo 'margin15'; ?>">



				<?php

				if(has_nav_menu('et_footer')) {

					wp_nav_menu(array (

							'theme_location' => 'et_footer',

							'container' => 'ul',

							'menu_class'	=> 'menu-bottom'

						));



				}



				do_action ('je_footer_bar');



				?>

				<div class="copyright"><?php echo $copyright; ?>.</div>

			</div>



				<?php

					et_follow_us();

					$http	=	et_get_http();



				 ?>



	</footer>

	<!--[if lt IE 9]>

		<script src="<?php echo $http; ?>://html5shim.googlecode.com/svn/trunk/html5.js"></script>

	<![endif]-->



	<!--[if lte IE 8]>

		<script type="text/javascript">

			Cufon.replace('.icon'); // Works without a selector engine

			Cufon.replace('.icon:before'); // Works without a selector engine

			jQuery(".icon").each( function(){

				var cthis = jQuery(this);

				cthis.append( cthis.attr("data-icon") );

			});



			Cufon.now();

		</script>

	<![endif]-->



	<?php wp_footer();?>

</body>

</html>