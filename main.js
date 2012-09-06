// Define time in ms
aDay = 86400000;
aHour = 3600000;
aMinute = 60000;
aSecond = 1000;
	
// Pad the number with an extra zero and round down (lack of integer division fail!)
function format( number )
{
	number = Math.abs( number )
	
	if( number < 10 )
		return "0" + Math.floor( number );
	else
		return Math.floor( number );
}

// Calculate time remaining based on current time
function timeRemaining( target_date )
{
	// difference in time (ms)
	var now = new Date();
	var diff = now.getTime() - target_date.getTime();

	// Check if countdown should end
	if( diff >= 0 )
	{
		$( "#time" ).css( "color", "red" );
		clearInterval( interval_id );
		window.interval_id = setInterval( function() { toggle( 'time' ); }, 800 );
				
		var time_left = "00:00:00:00";
	}
	// Otherwise format normally
	else
	{
		var time_left = format( diff / aDay ) + ":" +
					format( ( diff % aDay ) / aHour ) + ":" +
					format( ( ( diff % aDay ) % aHour ) / aMinute ) + ":" +
					format( ( ( ( diff % aDay ) % aHour ) % aMinute ) / aSecond );
	}

	return time_left;
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
	$( "#activateModal" ).leanModal();

	try
	{
		var x = window.location.href.split( '#' )[ 1 ].split( '.' );
	
		var target_date = new Date( x[ 0 ], x[ 1 ] - 1, x[ 2 ], x[ 3 ], x[ 4 ], 0, 0 ); // year, month, day, hours, minutes, seconds, milliseconds
		
		if( x.length == 6 )
			$( "#title" ).html( x[ 5 ] );
	}
	catch( e )
	{
		var target_date = new Date();

		$( "#activateModal" ).trigger( "click" );
	}
	
	interval_id = setInterval( function ()
	{
		$( "#time" ).html( timeRemaining( target_date ) );
	}, 100 );
	
	$( "#saveCountdown" ).click( function( event )
	{
		event.preventDefault();
	} );
} );