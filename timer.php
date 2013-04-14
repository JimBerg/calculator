<!-- only "fun stuff" so I felt free to use php... because I didn't want to c&p 120 divs... -->
<div id="timer-container">
	<div id="timer">
		<?php for( $i = 0; $i < 60; $i++ ): ?>
			<?php 
			 	$r = 160 - $i;
				$g = 180 - $i;
				$b = 180 - $i;
				$rgb = "rgb( $r, $g, $b )";
			?>
			<div id="<?php echo "sec_".$i; ?>" class="second" style="background: <?php echo $rgb; ?>;"><?php //echo $i; ?></div>
		<?php endfor; ?>
		<br />
		<?php for( $i = 0; $i < 60; $i++ ): ?>
			<?php 
				$r = 160 - $i;
				$g = 180 - $i;
				$b = 180 - $i;
				$rgb = "rgb( $r, $g, $b )";
			?>
			<div id="<?php echo "min_".$i; ?>" class="minutes" style="background: <?php echo $rgb; ?>;"><?php //echo $i; ?></div>
		<?php endfor; ?>
	</div>
</div>