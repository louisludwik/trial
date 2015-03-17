<?php



add_filter('et_registered_styles', 'je_child_register_styles', 20);

function je_child_register_styles($styles){

	$styles['child_style'] = array(

		'src'	=> get_bloginfo('stylesheet_directory') . '/css/style.css',

		'deps'	=> array('stylesheet','custom','customization')

		);

	return $styles;

}

add_action( 'wp_print_scripts', 'de_script', 100 );

function de_script() {
    // wp_dequeue_script( 'et_editor' );
    // wp_deregister_script( 'et_editor' );
}


/*add_filter( 'default_menu_items','default_menu_items_customize');
function default_menu_items_customize($args){
	global $current_user;
	$roles		= $current_user->roles;
	$user_role	= $roles[0];
	
	if ($user_role == 'company') {
		 $args = array(
			array(
				'id' 				=> 'resume-menu',
				'href' 				=> get_post_type_archive_link( 'resume' ),
				'checking_callback'	=> 'et_is_employer_menu',
				'label' 			=> __('CV SEARCH', ET_DOMAIN),
				'link_attr' 		=> array('title' => __('CV SEARCH', ET_DOMAIN)),
			),
			array(
				'id' 				=> 'training-center-menu',
				'href' 				=> get_page_link( 1008 ),
				'checking_callback'	=> 'et_is_employer_menu',
				'label' 			=> __('TRAINING CENTER', ET_DOMAIN),
				'link_attr' 		=> array('title' => __('Training center', ET_DOMAIN)),)
			);
	
	} elseif ($user_role == 'jobseeker') {
		
	 //jobseeker
	  $args = array(
		array(
			'id' 				=> 'job-menu',
			'href' 				=> get_post_type_archive_link( 'job' ),
			'checking_callback'	=> 'et_is_jobseeker_menu',
			'label' 			=> __('FIND A JOB', ET_DOMAIN),
			'link_attr' 		=> array('title' => __('FIND A JOB', ET_DOMAIN)),
		), 
		
		array(
			'id' 				=> 'career-services-menu',
			'href' 				=> get_page_link(1005),
			'checking_callback'	=> 'et_is_jobseeker_menu',
			'label' 			=> __('CAREER SERVICES', ET_DOMAIN),
			'link_attr' 		=> array('title' => __('Careeer sevies', ET_DOMAIN)),)
		);
	}
	
    return $args;
}*/

function initials($full_name) {
	
	$words = explode(" ", $full_name);
	$acronyms = "";
	
	foreach ($words as $w) {
	  $acronyms .= $w[0].'. ';
	}
	
	return $acronyms; 
}

add_action( 'login_form_middle', 'add_lost_password_link' );
	function add_lost_password_link() {
		return '<a href="'.wp_lostpassword_url().'">Lost Password?</a>';
}

function my_login_logo() { ?>
    <style type="text/css">
        body.login div#login h1 a {
            background-image: url(http://teacherjobs.ae/wp-content/uploads/2014/12/logo.png);
            width: 100%;
			background-size: contain;
        }
    </style>
<?php }
add_action( 'login_enqueue_scripts', 'my_login_logo' );