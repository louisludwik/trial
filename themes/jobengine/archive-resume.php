<?php



global $current_user, $user_ID, $wp_query;

get_header(); ?>



<div class="heading">

	<div class="main-center">

		<h1 class="title"><?php _e("Resumes",ET_DOMAIN);?></h1>

	</div>

</div>



<div class="wrapper jobseeker">

	<div class="header-content">

		<div class="main-center">

			<div class="desc headline">

				<?php

				$option	=	JE_Resume_Options::get_instance ();

				printf( apply_filters('je_resume_headline', $option->et_jobseeker_headline ) ); ?>

			</div>

		</div>

	</div>

	<div id="archive_resumes" class="main-center clearfix padding-top30">



		<div class="main-column resume-page">

		<!-- Pending Resumes -->

			<?php

			if(current_user_can( 'manage_options' )) {

				$pending_resume	=	JE_Resume::query_resumes( array('post_status' => array('pending'), 'showposts' => -1));



				if(!empty($pending_resume)) { ?>

				<h3 class="main-title"><?php _e("PENDING RESUMES", ET_DOMAIN); ?></h3>

				<div id="pending_resumes">

				<ul class="list-jobs job-account-list pending-resumes">

					<?php

					$pending_data	=	array();

					foreach ($pending_resume as $key => $res) {

						$resume 						= 	JE_Resume::convert_from_post($res);

						$jobseeker 						= 	get_userdata($res->post_author);

						$jobseeker 						=	JE_Job_Seeker::convert_from_user($jobseeker);

						if(!$jobseeker)	continue;

						$resume->author					=	($jobseeker->display_name ? $jobseeker->display_name : $jobseeker->user_login);

						$pending_data[]					=	$resume;
					
					?>

						<li id= "<?php echo strtotime($res->post_date);?>">

							<div class="thumb">

								<a class="resume-title" href="<?php echo get_permalink($res->ID); ?>" title="<?php echo ($jobseeker->display_name ? $jobseeker->display_name : $jobseeker->user_login );  ?>">

									<?php echo et_get_resume_avatar($resume->post_author, 28); ?>

								</a>

							</div>

							<div class="content">

								<h6 class="title">

									<a href="<?php echo get_permalink($res->ID); ?>" class="title resume-title" title="<?php echo ($jobseeker->display_name ? $jobseeker->display_name : $jobseeker->user_login );  ?> ">

										<?php echo ($jobseeker->display_name ? $jobseeker->display_name : $jobseeker->user_login );  ?>

									</a>

                                </h6>
                                
                                <div class="js_location">

                                    <span class="icon" data-icon="@"></span>

                                    <?php echo !empty($resume->et_location) ? $resume->et_location : __('No location', ET_DOMAIN); ?>

                                </div>
                                
                                

								<div class="desc f-left-all">

									<a href="#" class="professtional"><?php echo $jobseeker->et_profession_title; ?></a>

								</div>

								<div class="tech f-right actions">

									<a class="color-active action-approve tooltip" title="<?php  _e("Approve", ET_DOMAIN); ?>" href="#"><span class="icon" data-icon="3"></span></a>

									<a class="color-pending action-reject tooltip" title="<?php _e("Reject", ET_DOMAIN); ?>" href="#"><span class="icon" data-icon="*"></span></a>

								</div>

							</div>

						</li>



					<?php } ?>



				</ul>

				</div>

					<script	type="application/json" id="pending_resume_data">

						<?php echo json_encode($pending_data); ?>

					</script>

				<?php



				}

				wp_reset_query();

			}



			?>

				<?php if(current_user_can( 'manage_options' )) { ?>

					<h3 class="main-title"><?php _e("LATEST RESUMES", ET_DOMAIN); ?></h3>

				<?php } ?>

					<div id="resumes">

					<ul class="list-jobs job-account-list list-job-resume ">

						<?php

						global $post, $wp_query;

						$latest_resume 	=	array();

						if (have_posts()){



						while(have_posts()){

							the_post();

							$resume 			= JE_Resume::convert_from_post($post);
							
							//print_r ($resume);

							$jobseeker 			= get_userdata($post->post_author);

							$jobseeker 			= JE_Job_Seeker::convert_from_user($jobseeker);
							
							//print_r ($jobseeker);

							if(!$jobseeker) continue;

							$resume->author		= ($jobseeker->display_name ? $jobseeker->display_name : $jobseeker->user_login )	;

							$latest_resume[]	= $resume;
							
							$date =  $post->post_date;
							
							$user_plan_status = get_user_meta( $user_ID, 'je_resume_view_order_status', true );
													
							$hide = false;
							
							if(!current_user_can( 'manage_options' )) { //not admin
								/*if ( $resume->anonymous[0]->name == 'Active') { //Anonymous
									$hide = true;
								} else*/ if ( $user_plan_status != 'publish') { //No premium plan selected
									$hide = true;
								}
							}
							
							//Apply initials filter and default gravatar
							if ($hide == true) {
								$jobseeker->display_name = initials($jobseeker->display_name);
								$resume->post_author = 1;
							}
							?>

						<li class="resume-item" id ="<?php echo strtotime($date);?>" >



							<div class="thumb">

								<a class="resume-title" href="<?php the_permalink() ?>" title="<?php echo ($jobseeker->display_name ? $jobseeker->display_name : $jobseeker->user_login );  ?>">

									<?php echo et_get_resume_avatar($resume->post_author, 28); ?>

								</a>

							</div>

							<div class="content">

								<h6 class="title">

									<a href="<?php the_permalink() ?>" class="title resume-title" title="<?php echo ($jobseeker->display_name ? $jobseeker->display_name : $jobseeker->user_login );  ?> ">

										<?php echo ($jobseeker->display_name ? $jobseeker->display_name : $jobseeker->user_login );  ?>

									</a>
								</h6>
                                
                                <div class="js_location">

                                    <span class="icon" data-icon="@"></span>

                                    <?php echo !empty($jobseeker->et_location) ? $jobseeker->et_location : __('No location', ET_DOMAIN); ?>

                               
                                
                                 <?php 
									  if (!empty($resume->age))         {echo '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'.$resume->age. ' years old';} 
									  if (!empty($resume->nationality)) {echo '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'.$resume->nationality[0]->name; }
									  if (!empty($resume->gender))      {echo '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'.$resume->gender[0]->name; }
								  ?>

								 </div>

								<div class="desc f-left-all">

									<a href="#" class="professtional"><?php echo $jobseeker->et_profession_title ?></a> 
                                    
                                    <a href="#" class="professtional">
                                    <?php if (!empty($resume->school_type)) {echo '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'.$resume->school_type[0]->name;}
								  ?> </a> 

								</div>

								<?php /* if(current_user_can('manage_options')) { ?>

								<div class="tech f-right actions">

									<a class="color-pending action-trash tooltip" title="<?php _e("Reject", ET_DOMAIN); ?>" href="#"><span class="icon" data-icon="*"></span></a>

								</div>

								<?php } */ ?>

							</div>

						</li>



						<?php } 

					} else {

						?>

						<li class="no-job-found"><?php _e("Oops! Sorry, no resumes found.", ET_DOMAIN); ?></li>

						<?php

					}// end while have posts ?>



					</ul>

					</div>

				<?php if ($wp_query->max_num_pages > 1){ ?>

				<div class="button-more">

			 		 <button class="btn-background border-radius"><?php _e('Load more resumes', ET_DOMAIN); ?></button>

				</div>



				<?php } ?>

				<script	type="application/json" id="latest_resume_data">

					<?php echo json_encode($latest_resume); ?>

				</script>

			</div>



			<div class="widget-area second-column">

				<div id="sidebar-resume" class="widget <?php if(current_user_can('manage_options') ) echo 'sortable ui-sortable'; ?>">

					<?php

						if(is_active_sidebar('sidebar-resume')) {

							dynamic_sidebar('sidebar-resume');

						}

					?>

				</div>



			</div>



	  	</div>



	</div>

</div>



<?php get_footer(); ?>