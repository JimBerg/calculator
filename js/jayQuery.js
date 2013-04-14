/**
 * JAYQUERY
 * 
 * I may not use a real library as jquery, 
 * but for convenience I'd like to have some helper for dom manipulation
 * and by the way, it just makes me feel so cool :)
 * 
 * @version jayQuery V1.0
 * @author Janina Imberg aka Jay
 * 
 * ---------------------------------------------------------------------------------*/ 
var jayQuery = {
	
	/**
	* DOM ELEMENT SELECTORS
	* 
	* abbreviations - one somehow I just thought it would be a nice to have feature
	* @param elem = nodename
	* ---------------------------------------------------------------------------------*/
	byId: function( elem ) {
		return document.getElementById( elem );	
	}, 
	
	byTag: function( elem ) {
		return document.getElementsByTagName( elem )[0];
	},
	
	byClass: function( className ) {
		if( !document.getElementsByClassName ) {
       		return document.querySelectorAll('.' + className );
	    } else {
	    	return document.getElementsByClassName( className );
	    }
	},
	
	childById: function( elem ) {
		if ( typeof elem === 'string' ) { //id is passed
			return this.byId( elem ).childNodes[1];
		} else if ( typeof elem === 'object' ) { //node is passed
			return elem.childNodes[1];
		}
	},
	
	
	
	/**
	* EVENT HANDLING
	* 
	* create eventHandler / remove EventHandler for different browsers and bind to elements
	* binding: event, elements, function
	* @param string action => eventtype click, keypress etc.
	* @param string elem to bind
	* @param string fn, function to call on event
	* ---------------------------------------------------------------------------------*/
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
	},
	
	
	
	/**
	* UTILITIES
	* 
	* some helper methods
	* for different browsers
	* ---------------------------------------------------------------------------------*/
	isValidKey: function() {
		return Array.prototype.isValidKey = function( element ) {
		    for ( var i = 0; i < this.length; ++i ) {
		        if( this[i].keyCode == element ) {
		            return this[i];
		        }
		    }
		    return false;
		}
	},
	
	getText: function( node ) {
		if( document.getElementsByTagName( 'body' )[0].innerText === 'undefined' ) {
			return node.textContent; //FF
		} else {
			return node.innerText; //Chrome, IE
		}
	},
	
	setText: function( node, content ) {
		if( document.getElementsByTagName( 'body' )[0].innerText === 'undefined' ) {
			return node.textContent = content; //FF
		} else {
			return node.innerText = content; //Chrome, IE
		}
	}
} 