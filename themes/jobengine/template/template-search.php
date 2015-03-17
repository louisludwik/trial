<div class="header-filter" id="header-filter">
	<div class="main-center f-left-all">
		<div class="keyword">
			<input type="text" name="s" class="search-box job-searchbox input-search-box border-radius" placeholder="<?php _e('Enter a keyword', ET_DOMAIN) ?> ..." value="<?php echo get_query_var( 's' ) ?>" />
			<span class="icon" data-icon="s"></span>
		</div>
		<div class="location">
			<input type="text" name="job_location" class="search-box job-searchbox input-search-box border-radius" placeholder="<?php _e('Enter a location', ET_DOMAIN) ?> ..." value="<?php echo get_query_var( 'location' ) ?>" />
			<span class="icon" data-icon="@"></span>
		</div>
	</div>
</div>