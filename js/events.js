/**
 * EVENT HANDLING
 * 
 * create eventHandler for different browsers and bind to elements
 * binding: event, elements, function
 * @param string action => eventtype click, keypress etc.
 * @param string elem to bind
 * @param string fn, function to call on event
 * ---------------------------------------------------------------------------------*/

var events = {
	
	addEvent: function( action, elem, fn ) {
		if( window.addEventListener && window.addEventListener !== 'undefined' ) {
            elem.addEventListener( action, fn, false );  
        } else if( document.attachEvent ) {
            elem.attachEvent( 'on' + action, fn ); //IE 
        } else {
        	elem[ 'on' + action ] = fn;
        }
	},

	removeEvent: function( action, elem, fn ) {
		if( window.removeEventListener && window.removeEventListener !== 'undefined' ) {
            document.removeEventListener( action, fn, false );  
        } else if( document.detachEvent ) {
            document.detachEvent( 'on' + action, fn ); //IE 
        } else {
        	elem[ 'on' + action ] = null;
        }
	} 
}