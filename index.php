<!DOCTYPE html>
<html> 
    <head>
        <meta charset="utf-8">
        <title>Rechenmaschine</title>
        <meta name="description" content="taschenrechner">
        <meta name="author" content="janina imberg">
        <meta name="viewport" content="width=device-width">
		
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" /> 
        
        <link rel="stylesheet" href="css/styles.css">

    </head>
    
    <body class="init">
    	<div id="main-container">
    		
    		<div id="settings-panel" class="close">
    			<!-- 
    				sorry disabled... as a matter of time and a fucked up brain 
    				<a href="#" id="load-classic" data-href="classic" data-bind="oh please - just once in your life, do what you were told to do!">Classic Version!</a>
    			-->
    			<a href="#" id="manual">Gebrauchsanweisung</a>
    			<a href="#" id="timer-settings">Denn Zeit ist alles.</a>
    			<!-- 
    				<a href="#" id="cookies-settings" data-bind="It was written in the tasks... but, what for? I see no need in using them...">Kekse? Für wen?</a>
    			-->
    		</div>
    		<div id="settings"><img src="images/btn-settings.png" width="127" height="51" /></div>
			
  			<div id="calculator">
  				<span class="label">Rechenmaschine</span>

                <div id="display">
                	<span id="calculate-mode">rad</span>
                    <span id="display-content">0</span>
                </div>    
                
                <div id="special-operators">
					<div id="bracketLeft" class="btn disabled">
                        <span>(</span>
                    </div>
                    <div id="bracketRight" class="btn disabled">
                        <span>)</span>
                    </div>
                    <div id="sign" class="btn">
                    	<span class="hidden">sign</span>
                        <span>±</span>
                    </div>
                    <div id="pi" class="btn">
                    	<span class="hidden">PI</span>
                        <span>π</span>
                    </div>
                    
                   <div id="exponent" class="btn exp">
						<span class="hidden">pow</span>
                        <span>x<sup>y</sup></span>
                    </div>
                    <div id="seperator" class="btn">
                    	<span class="hidden">seperator</span>
                        <span>;</span>
                    </div>
                	
                	<div id="math-operators">     
	                    <div id="sqrt" class="btn sqrt">
	                    	<span class="hidden">sqrt</span>
	                        <span>√</span>
	                    </div>
	                    <div id="log" class="btn">
	                        <span>log</span>
	                    </div>
	                    <div id="sin" class="btn">
	                        <span>sin</span>
	                    </div>
	                    <div id="cos" class="btn">
	                        <span>cos</span>
	                    </div>
	                    <div id="tan" class="btn">
	                        <span>tan</span>
	                    </div>
	                    <div id="fac" class="btn">
	                    	<span class="hidden">fac</span>
	                        <span>x!</span>
	                    </div>
                    </div>
				</div>

				<div id="basic-operators">
					<div id="add" class="btn">
                        <span>+</span>
                    </div>
                    <div id="subtr" class="btn">
                        <span>-</span>
                    </div>
                    <div id="multiply" class="btn multiply">
                        <span>*</span>
                    </div>
                    <div id="divide" class="btn">
                    	<span class="hidden">/</span>
                        <span>÷</span>
                    </div>
				</div>	
				
				<!-- have to attach ids for keymap reference... -->
    			<div id="numblock">
    				<div id="7" class="btn">
                        <span>7</span>
                    </div>
                    <div id="8" class="btn">
                        <span>8</span>
                    </div>
                    <div id="9" class="btn">
                        <span>9</span>
                    </div>
                    <div id="4" class="btn">
                        <span>4</span>
                    </div>
                    <div id="5" class="btn">
                        <span>5</span>
                    </div>
                    <div id="6" class="btn">
                        <span>6</span>
                    </div>
                    <div id="1" class="btn">
                        <span>1</span>
                    </div>
                    <div id="2" class="btn">
                        <span>2</span>
                    </div>
                    <div id="3" class="btn">
                        <span>3</span>
                    </div>
                    <div id="zero" class="btn zero" >
                        <span>0</span>
                    </div>
                    <div id="dot" class="btn">
                        <span>.</span>
                    </div>
    			</div>
    			
    			<div id="evaluate-operators">
					<div id="clear" class="btn clear">
                        <span>C</span>
                    </div>
                    <div id="mode" class="btn mode">
                        <span>Mode</span>
                    </div>
                    <div id="result" class="btn result">
                        <span>=</span>
                    </div>
				</div>
    		</div>
			
			<?php include_once 'timer.php'; ?>
    	</div>
    <div id="test">click</div>
    	<!-- /* load after dom is ready ;) */-->
    	<script src="js/jayQuery.js" type="text/javascript"><!-- /* the future is here: jayQuery V0.1 */ --></script>
    	<script src="js/calculator.js" type="text/javascript"><!-- /* the machine */--></script>
    	<script src="js/settings.js" type="text/javascript"><!-- /* just playing around with settings n such */--></script>
    </body>
</html>