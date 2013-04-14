/**
 * SETTINGS && TIMER
 * 
 * Settings Panel
 * just playing around - make it fit 
 * in a real environment, it would look different...
 * {ajax, and a library n such}
 * 
 * @version settings V1.0
 * @author Janina Imberg aka Jay
 * 
 * ---------------------------------------------------------------------------------*/ 
(function( $ ){
	
	var body =  $.byTag( 'body' );
	var settings = $.byId( 'settings' );
	var panel = $.byId( 'settings-panel' );
	var navElems = panel.childNodes;


	/**
	 * TIMER | CLOCK 
	 * how long you've been using the calculator
	 * ---------------------------------------------------------------------------------*/
	var timer = {
		isRunning: false,
		sec: 0,
		min: 0,
		
		startTimer: function( fn ) { // add click eventhandler to dom to start timer
			$.addEvent( 'click', document, fn );
		},
		
		clearEventListener: function( fn ) { // remove click event handler, it's only needed once
			$.removeEvent( 'click', document, fn );
		},
		
		init: function() { // start timer & call the timing fn every second
			var running = setInterval( timer.run, 1000 );
			timer.clearEventListener( timer.init );	
		},
		
		run: function() { // increase counters
			var allSecElems = $.byClass( 'second' );
			var elemSec = $.byId( 'sec_'+timer.sec );
			var elemMin = $.byId( 'min_'+timer.min );
			
			var dialogSec = $.byId( 'dialogSec' );
			var	dialogMin = $.byId( 'dialogMin' );
			var sec;
			var min;
		
			elemSec.style.opacity = 1;
			timer.sec++;
			
			// well i don't care about hours... no one will use this an hour...
			if( timer.sec == 60 ) {
				timer.min++;
				timer.sec = 0;
				elemMin.style.opacity = 1;
				
				for( var i = 0; i < 60; i++ ) {
					allSecElems[i].style.opacity = 0.1;
				}
			}
	
			if( timer.sec < 10 ) {
				sec = "0"+timer.sec;
			} else {
				sec = timer.sec;
			}
			
			if( timer.min < 10 ) {
				min = "0"+timer.min;
			} else {
				min = timer.min;
			}
			
			/** elem is created on runtime - error will occur, if we're trying to set it immediately **/	
			if( $.byId( 'dialogSec' ) !== undefined && $.byId( 'dialogSec' ) !== null &&
				$.byId( 'dialogMin' ) !== undefined && $.byId( 'dialogMin' ) !== null 
			) {
				$.setText( dialogSec, sec );
				$.setText( dialogMin, min );
			}
		},
	};
	
	
	var message = {
		cookies: {
			
		},
		showtime: {
			text: 
				"<div id='close-dialog'>X</div>"+ 
				"<h1>Nutzungsdauer.</h1>"+
				"<h2>Cool, du hast diesen Taschenrechner: </h2>"+
				"<div class='time'>00:<span id='dialogMin'>00</span>:<span id='dialogSec'>00</span></div>"+
				"<h2>Minuten/Sekunden benutzt.</h2>"
		},
		manual: {
			text:
				"<div id='close-dialog'>X</div>"+ 
				"<h1>The machine</h1>"+
				"<h2>Gebrauchsanweisung</h2>"+
				
				"<h3>Gültige Eingaben:</h3>"+
				"<ul>"+
					"<li>als erstes Zeichen darf nur eine Zahl oder eine mathematische Funktion eingegeben werden.</li>"+
					"<li>bei Eingabe eines Operators wird eine Fehlermeldung erzeugt.</li>"+
					"<li>folgt auf die Eingabe eines Operators ein weiterer Operator, werden alle weiteren ignoriert, bis die Eingabe einer Zahl oder einer math. Funktion erfolgte.</li>"+
					"<li>ist das erste Zeichen ein ',' wird eine 0 davor gehängt.</li>"+
					"<li>Zahlen nach dem Muster 00000000023423 sind nicht erlaubt.</li>"+
					"<li>folgt auf ',' in einer Dezimalzahl nur '0' werden diese entfernt.</li>"+
					"<li>möchte man eine Zahl invertieren (±) muss zunächst die Zahl eingegeben werden.</li>"+
					"<li>Timer wird bei 'clear' beabsichtigterweise nicht zurück gesetzt.</li>"+
				"</ul>"+
				
				"<h3>Nicht erwünschte Eingaben:</h3>"+
				"<ul>"+
					"<li>Teilen durch 0. Auch nicht 0.0 oder 0.000000</li>"+
					"<li>tan(90*n) mit n € Z</li>"+
					"<li>Wurzel einer negativen Zahl</li>"+
					"<li>n! mit n < 0</li>"+
					"<li>log(0) (zeigt noch ±infinity)</li>"+
				"</ul>"+
				
				"<h3>Mathematische Funktionen:</h3>"+
				"<ul>"+
					"<li>Es wird zunächst die Funktion aufgerufen, dann die Parameter übergeben. Der Ausduck wird direkt ausgewertet.</li>"+
					"<li>Potenzieren: hier wird zunächst die Funktion x<sup>y</sup> aufgerufen und es werden zwei Parameter für Basis und Exponent übergeben."+
					"Die Abtrennung der beiden Ziffern geschieht über ; <br />Beispiel: pow( 2; 3 ) = 2<sup>3</sup>"+
					"</li>"+
					"<li>Über die Taste 'mode' kann zwischen Grad- und Bogenmass gewechselt werden.</li>"+
				"</ul>"+
				
				"<h3>Nicht unterstützte Funktionen:</h3>"+
				"<ul>"+
					"<li>Funktionen als Argument an mathematische Funktionen übergeben</li>"+
					"<li>Ausdrücke zu klammern</li>"+
					"<li>Tastatureingaben</li>"+
				"</ul>"
		}
	}

	/**
	 * open and close settings panel
	 * animation done by css3 animations
	 */
	var togglePanel = function() {
		if( panel.className == 'close' ) {
			panel.style.height = 60+'px';	
			panel.className = 'open';
		} else {
			panel.style.height = 0+'px';
			panel.className = 'close';
		}
	}
	
	/**
	 * open dialogbox
	 * set text
	 * add eventhandler to close btn
	 */
	var openDialogbox = function( event ) {
		var callElem; // check who's called the fn, quick n dirty ;)
		var overlay = document.createElement( 'div' );
		var dialog = document.createElement( 'div' );
		var dialogText = document.createElement( 'div' );
		var closeBtn;
		
		if( event.srcElement != undefined ) { //chrome
			callElem = event.srcElement.id;
		} else { //ff
			callElem = event.target.id;
		}
		
		if( callElem == "manual" ) {
			dialogText.innerHTML = message.manual.text;
		} else {
			dialogText.innerHTML = message.showtime.text;
		}
		overlay.className = 'overlay';
		dialog.id = 'settings-dialog';
		
		body.appendChild( overlay );
		dialog.appendChild( dialogText );
		body.appendChild( dialog );
	
				
		closeBtn = $.byId( 'close-dialog' );
		$.addEvent( 'click', closeBtn, closeDialogbox );
	}
	
	/**
	 * close dialogbox
	 */
	var closeDialogbox = function() {
		var dialog = $.byId( 'settings-dialog' );
		var overlay = $.byClass( 'overlay' )[0];
		dialog.innerHTML = '';
		body.removeChild( dialog );
		body.removeChild( overlay );
	}
	
	/**
	 * same procedure as every... ehm click
	 * bind handler to each elem in settings panel
	 */
	var eventHandler = {
		clickEach: function( btns, fn ) {
			for ( var i in btns ) {
				if( btns[i].nodeName === 'A' ) {
					$.addEvent( 'click', btns[i], fn );
				}
			}
		},
		keyClose: function( event ) {
			if( event.keyCode == 27 ) { //escape
				if( $.byId( 'settings-dialog' ) !== undefined && $.byId( 'settings-dialog' ) !== null ) { //dialog is open
					closeDialogbox();
				}
			}
		}
	}
	
	
	/**
	 * call to action!
	 */
	eventHandler.clickEach( navElems, openDialogbox );
	$.addEvent( 'click', settings, togglePanel );
	$.addEvent( 'keydown', body, eventHandler.keyClose ); //close dialog on escape
			
	/* start timer if not already running */
	if( timer.isRunning === false ) {
		timer.startTimer( timer.init );
	}
	
})( jayQuery );
