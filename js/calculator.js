/**
 * THE MACHINE :)
 * 
 * optimized for Chrome, working on Safari, Firefox
 * neglected: IE all versions...
 * 
 * @version calculator V1.0
 * @author Janina Imberg aka Jay
 * 
 * ---------------------------------------------------------------------------------*/ 

(function( $ ) {

	/**
	 * PLAYING AROUND
	 * 
	 * everything's ready ! so let's remove the init class
	 * just that the css3 transforms aren't fired at page load
	 * ---------------------------------------------------------------------------------*/ 
	var body =  $.byTag( 'body' );
	body.className = "";
	
	
	/** 
	 * Notice for IE User ;) - sorry but in this case I felt like being ignorant...
	 * well, honestly - I'm one of those weepy persons, who cries n cries and cries
	 * n never stop complaining about IE - maybe just because I'm too lazy ?
	 * in a real life environment, with real customers I WOULD care... of course
	 */
	if ( navigator.userAgent.search( 'MSIE' ) >= 0 ) {	
		var hint = document.createElement( 'div' );
		var overlay = document.createElement( 'div' );
		var hintText = document.createTextNode( 'Dieser Browser wurde leider nicht berücksichtigt.' );
		overlay.className = 'overlay';
		hint.className = 'hint';
		body.appendChild( overlay );
		hint.appendChild( hintText );
		body.appendChild( hint );
	}
	
	
	/**
	* GLOBALS n NAMESPACES
	* 
	* fetch some dom elements first and cache them
	* and bundle them to objects - simply because I like object literals :)
	* well and it's a way of reducing evil globals and such...
	* ---------------------------------------------------------------------------------*/
	
	/**
	 * Buttons
	 */
	var btns = {
		numbers: $.byId( 'numblock' ).childNodes,
		operators: $.byId( 'basic-operators' ).childNodes,
		mathFunctions: $.byId( 'math-operators' ).childNodes,
		pow: $.byId( 'exponent' ),
		seperator: $.byId( 'seperator' ),
		sign: $.byId( 'sign' ),
		pi: $.byId( 'pi' ),
		bracketLeft: $.byId( 'bracketLeft' ),
		bracketRight: $.byId( 'bracketRight' ),
		clear: $.byId( 'clear' ),
		result: $.byId( 'result' ),
		mode: $.byId( 'mode' ),
	};
	
	/**
	 * Display
	 */
	var display = {
		box: $.byId( 'display' ), // fun stuff...
		text: $.byId( 'display-content' ),
		modeText: $.byId( 'calculate-mode' ),
	};
	
	/*
	 * Keymap
	 */
	var keyMap = [
		{ 'keyCode':  48, 'key': 0, 'btn': 'zero' },
		{ 'keyCode':  49, 'key': 1, 'btn': '1' },
		{ 'keyCode':  50, 'key': 2, 'btn': '2' },
		{ 'keyCode':  51, 'key': 3, 'btn': '3' },
		{ 'keyCode':  52, 'key': 4, 'btn': '4' },
		{ 'keyCode':  53, 'key': 5, 'btn': '5' },
		{ 'keyCode':  54, 'key': 6, 'btn': '6' },
		{ 'keyCode':  55, 'key': 7, 'btn': '7' },
		{ 'keyCode':  56, 'key': 8, 'btn': '8' },
		{ 'keyCode':  57, 'key': 9, 'btn': '9' },
		{ 'keyCode':  107, 'key': '+', 'btn': 'add' },
		{ 'keyCode':  187, 'key': '+', 'btn': 'add' },
		{ 'keyCode':  109, 'key': '-', 'btn': 'subtr' },
		{ 'keyCode':  189, 'key': '-', 'btn': 'subtr' },
		{ 'keyCode':  106, 'key': '*', 'btn': 'multiply' },
		{ 'keyCode':  51, 'key': '*', 'btn': 'multiply' },
		{ 'keyCode':  111, 'key': '/', 'btn': 'divide' },
		{ 'keyCode':  191, 'key': '/', 'btn': 'divide' },
	];
	
	
	/**
	 * MATH FUNCTIONS 
	 * no black magic here
	 * creating some custom functions and put them into Math namespace
	 * ---------------------------------------------------------------------------------*/
	
	/**
	 * convert degrees to radians
	 * @param string degrees
	 * @return string radians
	 */
	Math.degreeToRad = function( degrees ) {
		var radians = parseInt( degrees ) * ( Math.PI / 180 );
		return radians.toString(); //for the eval expr. we need a string
	}
	
	/**
	 * the other way round
	 * @param string radians
	 * @return string degrees
	 */
	Math.radToDegree = function( radians ) {
		var degrees = parseInt( radians ) * ( 180 / Math.PI );
		return degrees.toString();
	}
	
	/**
	 * faculty
	 * @param int n
	 * @return int result
	 */
	Math.fac = function( n ) {
		if( n < 0 ) {
			//calc.evilThings();
			return;
		}
		var result;
		if ( n == 1 ||  n == 0 ) {
			result = 1;
		} else {
			result = n * Math.fac( n - 1 );
		}
		return result;
	}
	
	
	/**
	 * HELPER FUNCTIONS
	 * validation
	 * syntax check
	 * ---------------------------------------------------------------------------------*/
	var helper = {
		firstInput: true,
		
		/** 
		* get last inserted element
		* @return char lastInsert
		*/
		getLastInsert: function() {
			var latestInsert = calc.expression.substr( expression.length - 1 , 1 );
			return lastInsert;
		},
		
		/**
	 	* get last inserted element
	 	* @return boolean true if digit or decimal seperator | false if math fn or operator
	 	*/
	 	checkLastInsert: function() {
			var latestInsert = helper.getLastInsert();
			var pattern = /[\d|\.]/gi; 
			var match = pattern.test( latestInsert );
			
			return match ? true : false; //last insert == digit everythings fine
		},
	
		/**
		 * check number of decimal seperators
		 * never start with one
		 * not more than one in one expression
		 * @return boolean
		 */
		checkDecimalSeperator: function() {
			var expressionToTest = calc.partExpression;
			var pattern = /[[\+|\-|\*|\/]{1}[\d+]*[\.]+[\d|\.]+$]|^\d+\.+/gi; // operator followed by digit followed by dot -> no more . allowed
			var match = pattern.test( expressionToTest );
			
			return match ? true : false; 
		},

		/**
		 * evil things! 
		 * 0.0000 and 00000.000 etc. is also zero...so don't even try it!  
		 * @return boolean
		 */
		checkDivison: function() {
			var expressionToTest = calc.expression;
			var pattern = /\/0+\.*0*[\+|\-|\*|\/]+|\/0+\.*0*$/gi;
			var match = pattern.test( expressionToTest );
			
			return match ? true : false; 
		},

		/**
		 * be sure, we can evaluate the expression
		 * cut operators and . at the end
		 */
		validate: function() {
			if (typeof calc.expression == 'number' ) {
				calc.expression = calc.expression.toString(); //replace will only work with strings
			}
			var expressionToTest = calc.expression;
			var pattern = /\/0+\.*0*[\+|\-|\*|\/]+|\/0+\.*0*$/gi;
			var replace = pattern.test( expressionToTest );
			var regEx = new RegExp( "["+calc.partExpression+"]$", 'gi');
			var replace = calc.expression.replace( /([\+|\-|\*|\/|\.])+$/gi, "" ); 
			calc.expression = replace;
		}
	};
	
	 /**
	 * helper for keymap
	 * check if passed key is in array of keymap
	 * @param keyCode of pressed button
	 * @return mapped keyCode or false
	 */
	Array.prototype.isValidKey = function( element ) {
	    for ( var i = 0; i < this.length; ++i ) {
	        if( this[i].keyCode == element ) {
	            return this[i];
	        }
	    }
	    return false;
	}
		
		
	/**
	 * CALCULATOR FUNCTIONS
	 * ---------------------------------------------------------------------------------*/
	var calc = {
		expression: '', 
		partExpression: '', //current sub expression
		mode: 'rad',
		inputType: 1,
		fnName: '',
		fnParams: '',
		powFlag: false,
		bracketFlag: false,
		
		fn: function() { 
			var mathExpression = "Math." + this.fnName + "(" + this.fnParams + ")";
			if( typeof( eval( mathExpression ) ) == 'undefined' ) { // always be careful with eval
				return 0; //calc.evilThings();
			}
			return eval( mathExpression ).toFixed(14).toString(); // cool stuff here :)
		},
		
		/**
		 * a number key was pressed
		 * inputtype 1
		 * @return void
		 */
		setNumbers: function() {
			var that = this;
			var value = $.getText( $.childById( that ) ); 
			
			//AND ONCE AGAIN REFACTORING REQUIRED	
			if ( value === '.' ) { // decimal sep. needs some special check
				if ( helper.firstInput === true || calc.partExpression === '' ) {
					calc.expression += '0';
					calc.partExpression += '0';
				} else if ( helper.checkDecimalSeperator() ) {
					return;
				}
			}
			if ( calc.partExpression === '0' ) { // no 000000000372834 allowed
				if ( value === '0' ) {
					return;
				} else if ( value !== '.' && value !== '0' ) { // bel. zahl
					calc.partExpression = value;
				} 
			} 
			if ( helper.firstInput === true ) {
				helper.firstInput = false;
			} 
			if( calc.inputType == 3 ) {
				calc.setMathFunctions.call( { 'value': value, 'type': 1 } ); // delegate to setMathFn
				return;
			}
			
			calc.inputType = 1;
			calc.expression += value;
			calc.partExpression += value;
			
			if( calc.partExpression.length <= 14 ) { 
				$.setText( display.text, calc.partExpression );
			} else {
				$.setText( display.text, calc.partExpression.substring( 0, 13 )+".." ); //only for display
			}
		},
		
		/**
		 * an operator key was pressed
		 * inputtype 2 
		 * @return void
		 */
		setOperators: function() {
			var that = this;
			var value = $.getText( $.childById( that ) ); 
			
			if ( helper.firstInput === true ) { // operator may never be the first
				$.setText( display.text, 'huch!' );
				return;
			}
			
			if ( calc.inputType == 2 ) { //there was an operator already set
				return; // or replace the last one ( ? )
			}
			
			if ( calc.inputType == 3 ) { //a math fn is set
				calc.calculate();
			}
			
			if( helper.checkDivison() ) {
				calc.evilThings();
				return;		
			}
			
			calc.inputType = 2;
			calc.expression += value;
			calc.partExpression = '';
			$.setText( display.text, value );
		},
		
		/**
		 * a math fn key was pressed
		 * input type 3
		 * YOU COULD NOT PASS A FN TO FN -> not implemented yet
		 * @return void
		 */
		setMathFunctions: function() {
			var that = this;
			var value;
			
			if ( that.type !== 'undefined' && that.type === 1 ) { //called after number was pressed
				calc.fnParams += that.value;
				$.setText( display.text, calc.fnName + "(" + calc.fnParams + ")" );
				return;	
			} else if ( calc.inputType === 2 || helper.firstInput === true ) { //called if fn key was pressed
				value = $.getText( $.childById( that ) );
				calc.fnName = value;
				calc.fnParams = ''; //reset them, in case someone press a mathfn twice
				$.setText( display.text, calc.fnName + "()" );
			} else {
				return;
			}		
			
			calc.inputType = 3;
		},
		
		/**
		 * sign a number | number within a fn
		 * uhhhh no once again funny replacements
		 * @return void
		 */
		setSign: function() {
			var that = this;
			var value = $.getText( $.childById( that ) ); 
			
			if ( calc.inputType == 1 ) { //num
				var num = parseFloat( $.getText( display.text ) );
				var temp = ( -1 ) * parseFloat( $.getText( display.text ) ); 
				var regEx = new RegExp( ""+num+"$", 'gi'); // replace only the current part not whole calculation
				var replace = calc.expression.replace( regEx, "(" + temp.toString() + ")" ); // replace match with inverted string and add brackets
				$.setText( display.text, temp.toString() ); 
				calc.expression = replace;
		 	} else if ( calc.inputType == 3 ) { //fn
		 		var temp = ( -1 ) * parseFloat( calc.fnParams );
		 		calc.fnParams = temp;
		 		$.setText( display.text, calc.fnName + "(" + calc.fnParams + ")" );
		 	}
		},
		
		/**
		 * Pi
		 * 3.1415... for you may need it anywhere
		 * @return void
		 */
		setPi: function() {
			if ( helper.firstInput === true ) { 
				helper.firstInput = false;
			}

			if ( calc.inputType == 1 || calc.inputType == 2 ) { //num
				calc.expression += ( Math.PI ).toPrecision( 12 );
				$.setText( display.text, ( Math.PI ).toPrecision( 12 ) );
			} else if ( calc.inputType == 3 ) { //fn
		 		calc.fnParams += ( Math.PI ).toPrecision( 9 ); // if longer not fitting to display anymore ;) and its only cut for display not calculation...
		 		$.setText( display.text, calc.fnName + "(" + calc.fnParams + ")" );
			}
			calc.inputType = 1; 
		},
		
		/**
		 * Pow
		 * now it's getting ugly...redundancy n such...
		 * but well, it's javascript - it's always some kind of "make it fit, no matter how :)"
		 */
		setPow: function() {
			var that = this;
			var value;
			
			if ( that.type !== 'undefined' && that.type === 1 ) { //called after number was pressed
				calc.fnParams += that.value;
				$.setText( display.text, calc.fnName + "(" + calc.fnParams + ")" );
				return;	
			} else if( calc.inputType === 3 && that.value === '(' ) { // brackets! 
			// enable to pass a fn to a function...
			
			} else if ( calc.inputType === 2 || helper.firstInput === true ) { //called if fn key was pressed
				value = 'pow';
				calc.fnName = value;
				calc.fnParams = ''; //reset them, in case someone press a mathfn twice
				$.setText( display.text, calc.fnName + "()" );
			} else {
				return;
			}	
		 	
		 	calc.powFlag = true;
			calc.inputType = 3;
		},
		
		/** 
		 * need for Math.pow - because I could not find any more reasonable solution
		 * maybe I'm just kind of brainfucked today...
		 */
		setSeperator: function() {
			if( calc.powFlag == false || calc.fnParams == '' ) { //only allowed for pow
				return;
			} else {
				var expressionToTest = calc.fnParams;
				var pattern = /\;+/gi; // if there's already one, return
				var match = pattern.test( expressionToTest );
				if ( match ) {
					return;
				} else {
					calc.fnParams += ";";
					$.setText( display.text, calc.fnName + "(" + calc.fnParams + ")" );
				}
			} 
		},
		
		/**
		 * set brackets
		 * I'm joking, not working yet...
		 */
		setBracketLeft: function() {
			calc.bracketFlag = true;
			$.setText( display.text, calc.fnName + "(" + calc.bracketExpression + ")" );
		},
		
		/** 
		 * actually we won't need it..
		 */
		setBracketRight: function() {
			calc.bracketFlag = false;
		},
		
		/**
		 * set calculator mode to degrees or radians
		 * @return void
		 */
		changeMode: function() {
			if( calc.mode === 'deg' ) {
				calc.mode = 'rad';
			} else {
				calc.mode = 'deg';
			}
			$.setText( display.modeText, calc.mode );	
		},
		
		/**
		 * clear display
		 * @return void
		 */
		clear: function() {
			display.box.className = '';
			calc.expression = '';
			calc.partExpression = '';
			calc.fnName = '';
			calc.fnParams = '';
			calc.inputType = 1;
			helper.firstInput = true;
			$.setText( display.text, '0' );
		},
		
		/**
		 * evaluate expression
		 * @return void
		 */
		calculate: function() {
			var result;
			var fnResult;
			var convert;
			var temp; 
			var param1;
			var param2;
			
			if( calc.bracketFlag == true ) { // you obviously forget to close the bracket
				calc.expression += ")";
			};
			
			if( calc.fnName !== '' ) {
				if( calc.fnParams === '' ) {
					return; // no fn without param
				}

				if( calc.powFlag == true ) { //special treatment for math.pow
					temp = calc.fnParams.split(';');
					param1 = temp[0];
					param2 = temp[1];
					
					fnResult = Math.pow( param1, param2 );
					calc.powFlag = false;
					
				} else {
					if( calc.mode === 'deg' && ( calc.fnName === 'sin' || calc.fnName === 'cos' || calc.fnName === 'tan' ) ) { 
						if( calc.fnName === 'tan' && Math.abs( parseInt( calc.fnParams ) ) % 90 == 0 ) { 
							calc.evilThings();
							return;
						}  
						convert =  Math.degreeToRad( calc.fnParams );
						calc.fnParams = convert; // COSINE HATES ME - rounding errors n such... 
					}
					
					if( calc.fnName === 'sqrt' && parseInt( calc.fnParams ) < 0 ) {
						calc.evilThings();
						return;
					} 
		
					fnResult = calc.fn();
					if( fnResult < 0 ) {
						var temp = fnResult;
						fnResult = "(" + temp + ")";	
					}
				}
				
				if ( calc.expression != 0 ) {
					calc.expression += fnResult;
				} else {
					calc.expression = fnResult;	
				}
 
				calc.fnName = '';
				calc.fnParams = '';
				//return;
			}
			
			if( calc.expression !== '' ) {
				if( helper.checkDivison() ) {
					calc.evilThings();
					return;		
				}
				helper.validate();
				result = eval( calc.expression ); // syntax check - otherwise eval won't like us ;)
				calc.expression = result.toString(); // we need it as string to concatenate
			} else {
				return;
			}
	
			/// HATE!!!! ///
			if( calc.expression.length <= 14 ) {
				$.setText( display.text, calc.expression );
			} else {
				var cutExpr = parseFloat( calc.expression ).toPrecision( 12 ); 
				$.setText( display.text, cutExpr );
			}
			
			calc.inputType = 1;
		},
		
		
		/**
		 * DON'T TAKE IT TO SERIOUS...
		 * 
		 * thou shalt not:
		 * - divide by zero
		 * - extract a root of a negative number
		 * - try to get tan(90deg)
		 * - log(0) // ln(0) unless you want to discover infinity, but the negative one
		 * - get fac(-n)
		 */
		evilThings: function() {
			$.setText( display.text, 'evil!' );
			display.box.className = 'evil';
			window.setTimeout( calc.clear, 1200 );
		}
	};
	
	
	/**
	 * ATTACH EVENT HANDLER FOR EACH BTN
	 * ---------------------------------------------------------------------------------*/
	var eventHandler = { 
		click: function( btn, fn ) {
			$.addEvent( 'click', btn, fn );
		},
		
		clickEach: function( btns, fn ) {
			for ( var i in btns ) {
				if( btns[i].nodeName === 'DIV' ) {
					$.addEvent( 'click', btns[i], fn );
				}
			}
		},
		
		// TODO REFACTORING => set utility methods
		keyDown: function( event ) {
			var key = keyMap.isValidKey( event.keyCode );
			var activeBtn;
			var btnClass;
			
			if( key ) {
				var btns = $.byClass( 'btn' ); // well let's do it a dirty way...
				for( var i = 0; i <= btns.length - 1; i++ ) { 
					btnClass = btns[i].className.toString();
					btns[i].className = btnClass.replace( 'active', '' ) ;
				}
				activeBtn = $.byId( key.btn );
				btnClass = activeBtn.className;
				activeBtn.className = btnClass + ' active';	
				calc.expression += key.key;
				$.setText( display.text, key.key );
				return;	
			} else {
				return;
			}
		},
		keyUp: function( event ) {
			var key = keyMap.isValidKey( event.keyCode );
			var activeBtn;
			var btnClass;
			
			if( key ) {
				activeBtn = $.byId( key.btn );
				btnClass = activeBtn.className;
				activeBtn.className = btnClass.replace( 'active', '' ) ;
				return;	
			} else {
				return;
			}
		}	
	}

	/* standard ops */
	eventHandler.clickEach( btns.numbers, calc.setNumbers );
	eventHandler.clickEach( btns.operators, calc.setOperators );
	eventHandler.clickEach( btns.mathFunctions, calc.setMathFunctions );		
	
	/* calc n clear	*/
	eventHandler.click( btns.clear, calc.clear );
	eventHandler.click( btns.result, calc.calculate );
	
	/* special fns */
	eventHandler.click( btns.mode, calc.changeMode );
	eventHandler.click( btns.pow, calc.setPow );
	eventHandler.click( btns.seperator, calc.setSeperator );
	eventHandler.click( btns.sign, calc.setSign );
	eventHandler.click( btns.pi, calc.setPi );
	//eventHandler.click( btns.bracketLeft, calc.setBracketLeft );
	//eventHandler.click( btns.bracketRight, calc.setBracketRight );
	
	/* keypress events */
	$.addEvent( 'keydown', body, eventHandler.keyDown );
	$.addEvent( 'keyup', body, eventHandler.keyUp );

})( jayQuery ); /* passing the one and only jayQuery :) */


