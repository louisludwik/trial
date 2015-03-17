<?php
		<div class="tab-title f-left-all clearfix">
			<div class="bg-tab"><span><?php _e('Already have an account?', ET_DOMAIN );?></span> <?php _e('Login', ET_DOMAIN );?></div>
		<div class="tab-content">
				<form id="register" novalidate="novalidate" autocomplete="on">
						<div class="label">
								<h6 class="font-quicksand"><?php _e('USER NAME', ET_DOMAIN );?></h6>
							</label>
						<div>
						</div>
					<div class="form-item">
							<label for="reg_email">
								<?php _e('Please enter your email address', ET_DOMAIN );?>
						</div>
							<input class="bg-default-input is_email" tabindex="1" name="reg_email" id="reg_email" type="email" onblur="$('#reg_user_name').val($(this).val())"/>
					</div>
					<?php do_action('je_after_register_form'); ?>
					<div class="form-item">
							<label for="reg_pass">
								<?php _e('Enter your password', ET_DOMAIN );?>
						</div>
							<input class="bg-default-input is_pass" tabindex="2" name="reg_pass" id="reg_pass" type="password" />
					</div>
						<div class="label">
								<h6 class="font-quicksand repeat_pass "><?php _e('RETYPE YOUR PASSWORD', ET_DOMAIN );?></h6>
							</label>
						<div>
						</div>


					<?php if($term_of_use){ ?>
						<div class="label">&nbsp;</div>
					  	<div class="fld-wrap" id="">
							<label for="term_of"><?php printf(__("I agree with <a href='%s' > the Terms of use </a>", ET_DOMAIN), et_get_page_link('terms-of-use') ); ?> </label>
					</div>

						<div class="label">&nbsp;</div>
							<button class="bg-btn-action border-radius" tabindex="4" type="submit" id="submit_register"><?php _e('CONTINUE', ET_DOMAIN );?></button>
						</div>
							<?php _e('Please enter your email', ET_DOMAIN );?>
						<div>
						</div>
					<div class="form-item">
							<h6 class="font-quicksand"><?php _e('PASSWORD', ET_DOMAIN );?></h6>
						</div>
							<input class="bg-default-input is_pass" tabindex="2" name="log_pass" id="log_pass" type="password" />
					</div>
						<div class="label">&nbsp;</div>
							<button class="bg-btn-action border-radius" tabindex="3" type="submit" id="submit_login"><?php _e('LOGIN', ET_DOMAIN );?></button>
						<a href="#" class="forgot-pass-link"><?php _e('FORGOT PASSWORD', ET_DOMAIN)?></a>
				</form>
		</div>