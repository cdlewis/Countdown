/* Standard Library Functions */

// String Format
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

// Date and Time Functions
DAY = 86400000;
HOUR = 3600000;
MINUTE = 60000;
SECOND = 1000;
Number.prototype.formatDay = function() {
	return ( this / DAY ).Clock();
}
Number.prototype.formatHour = function() {
	return ( this % DAY / HOUR ).Clock();
}
Number.prototype.formatMinute = function() {
	return ( this % DAY % HOUR / MINUTE ).Clock();
}
Number.prototype.formatSecond = function() {
	return ( this % DAY % HOUR % MINUTE / SECOND ).Clock();
}
Number.prototype.Clock = function()
{
	var i = Math.floor( Math.abs( this ) ).toString();
	if( i.length < 2 )
		return '0' + i;
	else
		return i;
}

// Calculate time remaining based on current time
function timeRemaining( target_date )
{
	// difference in time (ms)
	var now = new Date();
	var diff = now - target_date;

	// Check if countdown should end
	if( diff >= 0 )
	{
		$( "#time" ).css( "color", "red" );
		clearInterval( interval_id );
		window.interval_id = setInterval( function() { toggle( 'time' ); }, 800 );
				
		return "00:00:00:00";
	}
	// Otherwise format normally
	else
		return "{0}:{1}:{2}:{3}".format( diff.formatDay(), diff.formatHour(), diff.formatMinute(), diff.formatSecond() );
}

function toggle( time_element )
{
	if( typeof window[ 'toggle_switch' ] === 'undefined' )
		window[ 'toggle_switch' ] = false;
	
	if( window[ 'toggle_switch' ] == 1 )
		$( '#' + time_element ).fadeTo( 'slow', 0 );
	else
		$( '#' + time_element ).fadeTo( 'slow', 1 );
	
	window[ 'toggle_switch' ] = !window[ 'toggle_switch' ];
}

$( document ).ready( function()
{
	$( "#activateModal" ).leanModal( { closeButton: '.modal_close' } );

	var current_date = new Date();

	try
	{
		var y = $( location ).attr( 'href' ).split( '#' );
		var x = y[ 1 ].split( '.' );

		$.each( x, function( index, value ) 
		{
			if( isNaN( value ) || value == "" )
				throw value;
		} );

		var target_date = new Date( x[ 0 ], x[ 1 ] - 1, x[ 2 ], x[ 3 ], x[ 4 ], 0, 0 ); // year, month, day, hours, minutes, seconds, milliseconds

		if( y.length == 3 && y[ 2 ].length > 0 )
			$( '#title' ).html( decodeURI( y[ 2 ] ) ); // not safe
		else
			$( '#title' ).css( 'display', 'none' );
	}
	catch( e )
	{
		var target_date = current_date;

		$( '#activateModal' ).trigger( 'click' );
	}
	
	interval_id = setInterval( function ()
	{
		$( "#time" ).html( timeRemaining( target_date ) );
	}, 100 );
	
	// Populate Day, Year, Hour and Minute fields (month done by hand)
	var current_year = current_date.getFullYear();
	for( var i = current_year; i < current_year + 50; i++ )
		$( "#year" ).append( "<option value='{0}'>{1}</option>".format( i, i ) )
	
	for( var i = 1; i <= 31; i++ )
		$( "#day" ).append( "<option value='{0}'>{1}</option>".format( i, i ) );
	
	for( var i = 1; i <= 12; i++ )
		$( "#hour" ).append( "<option value='{0}'>{1}</option>".format( i, i ) );
	
	for( var i = 0; i <= 60; i++ )
		$( "#minute" ).append( "<option value='{0}'>{1}</option>".format( i, i ) );
	
	// Setup save handler
	$( "#saveCountdown" ).click( function( event )
	{
		event.preventDefault();
		
		// If any field is blank then set it to the current date/time
		var current_date = new Date();
		if( $( "#year" ).val() == "" )
			$( "#year > option[value={0}]".format( current_date.getFullYear() ) ).attr( 'selected', 'selected' )
		if( $( "#month" ).val() == "" )
			$( "#month > option[value={0}]".format( parseInt( current_date.getMonth() ) + 1 ) ).attr( 'selected', 'selected' );
		if( $( "#day" ).val() == "" )
			$( "#day > option[value={0}]".format( current_date.getDate() ) ).attr( 'selected', 'selected' );
		if( $( "#hour" ).val() == "" )
		{
			// In order for hours to be set accurately, the meridiem has to be correct
			$( "#meridiem > option[value={0}]".format( current_date.getHours() <= 12 ? 0 : 12 ) ).attr( 'selected', 'selected' );
			
			$( "#hour > option[value={0}]".format( current_date.getHours() - parseInt( $( "#meridiem" ).val() ) ) ).attr( 'selected', 'selected' );
		}
		if( $( "#minute" ).val() == "" )
			$( "#minute > option[value={0}]".format( current_date.getMinutes() ) ).attr( 'selected', 'selected' );
		
		$( location ).attr( 'href', '{0}#{1}.{2}.{3}.{4}.{5}#{6}'.format(
			$( location ).attr( 'href' ).split( '#' )[ 0 ],
			$( "#year" ).val(),
			$( "#month" ).val(),
			$( "#day" ).val(),
			parseInt( $( "#hour" ).val() ) + parseInt( $( "#meridiem" ).val() ),
			$( "#minute" ).val(),
			encodeURI( $( "#input_title" ).val() )
		) );
		location.reload();
	} );
} );