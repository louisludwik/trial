<?php
global $post, $job;

$job_cat 	= isset($job['categories'][0]) ? $job['categories'][0] : '';
$job_type 	= isset($job['job_types'][0]) ? $job['job_types'][0] : '';

$company		= et_create_companies_response( $job['author_id'] );
$company_logo	= $company['user_logo'];

// add this company data to the array to pass to js
if(!isset($arrAuthors[$company['id']])){
	$arrAuthors[$company['id']]	= array(
		'display_name'	=> $company['display_name'],
		'user_url'		=> $company['user_url'],
		'user_logo'		=> $company_logo
	);
}
?>
<li class="job-item" itemscope itemtype="http://schema.org/JobPosting">
	<div class="thumb">
	<?php
		if (!empty($company_logo)){
			?>
			<a id="job_author_thumb-<?php echo $company['ID'];?>" data-id="<?php echo $company['ID'];?>" href="<?php echo $company['post_url'];?>" 
				title="<?php printf(__('View posted jobs by %s', ET_DOMAIN), $company['display_name']) ?>" class="thumb">
				<img src="<?php echo ( isset($company_logo['small_thumb']) && !empty($company_logo['small_thumb']) ) ? $company_logo['small_thumb'][0] : $company_logo['thumbnail'][0]; ?>" id="company_logo_thumb-<?php echo $company_logo['attach_id'];?>" data-attachid="<?php echo $company_logo['attach_id'];?>" />
			</a>
			<?php
		}
	?>
	</div>

	<div class="content">
		<h2 class="title-job"  itemprop="title">
		<a class="title-link title"  href="<?php the_permalink() ?>" title="<?php printf(__('View more details of %s', ET_DOMAIN), get_the_title())?>">
			<?php the_title();  ?>
		</a>
		</h2>
		<a target="_blank" class="title-link title new-tab-icon"  href="<?php the_permalink() ?>" title="<?php printf(__('View more details in new window tab', ET_DOMAIN), get_the_title())?>">
			<span class="icon" data-icon="R"></span>
		</a>

		<div class="desc f-left-all">
			<div class="cat company_name">
				<a data-id="<?php echo $company['ID'];?>" href="<?php echo $company['post_url'];?>" title="<?php printf(__('View posted jobs by %s', ET_DOMAIN), $company['display_name']) ?>">
					<?php echo $company['display_name'] ?>
				</a>
			</div>
			<?php if ($job_type != '') { ?>
				<div itemprop="employmentType" class="job-type <?php echo 'color-' . $job_type['color'] ?>">
					<span class="flag"></span>
					<a href="<?php echo $job_type['url']; ?>" title="<?php printf(__('View all posted jobs in %s', ET_DOMAIN), $job_type['name']);?>">
						<?php echo $job_type['name'] ?>
					</a>
				</div>
			<?php } ?>

			<?php if ($job['location'] != '') { ?>
				<div>
					<span class="icon" data-icon="@"></span>
					<span itemprop="jobLocation" itemscope itemtype="http://schema.org/Place" class="ob-location">
         				<span itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
         				<span itemprop="addressLocality"><?php echo $job['location'] ?></span>
          				</span>
        			</span>

				</div>
			<?php } ?>
		</div>

		<div class="tech f-right actions">
			<?php
				$feature 		 =	'';
				$set_feature =  __('Make this job featured', ET_DOMAIN) ;
				if( $job['featured']) {
					$feature = 'flag-feature';
					$set_feature = __('Unset featured status',ET_DOMAIN);
			?>
				<span class="feature font-quicksand"><?php _e('Featured', ET_DOMAIN) ?></span>
			<?php } ?>
			<?php global $disable_actions;
			// some pages don't need front end actions
			if (!isset($disable_actions) || !$disable_actions) { ?>
				<?php if( current_user_can('manage_options')) { ?>
					<a data-post-ID="<?php echo $post->ID ?>" title="<?php echo $set_feature ?>" class="action-featured flag <?php echo $feature ?> tooltip" href="#"><span class="icon" data-icon="^"></span></a>
					<a data-post-ID="<?php echo $post->ID ?>" class="action-edit tooltip" title="<?php _e('Edit',ET_DOMAIN) ?>" href="#"><span class="icon" data-icon="p"></span></a>
					<a data-post-ID="<?php echo $post->ID ?>" class="action-archive tooltip" title="<?php _e('Archive',ET_DOMAIN) ?>" href="#"><span class="icon" data-icon="#"></span></a>
				<?php } ?>
			<?php } ?>
		</div>

	</div>
</li>