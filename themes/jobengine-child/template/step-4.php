<?php
	if ( !empty($payment_gateways) ) {
		<div class="step" id='step_payment'>
			<div class="toggle-content payment clearfix" style="display: none" id="payment_form">
							<li class="clearfix">
								<div class="f-left">
									<?php if(isset($payment['description'])) {?>
								</div>
								<div class="btn-select f-right">
							</li>
					<?php do_action ('after_je_payment_button', $payment_gateways); ?>
				</ul>
		</div>