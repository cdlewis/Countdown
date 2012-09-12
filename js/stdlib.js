/* Standard Library Functions aka A number of functions I use on a regular basis */

// String Functions
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

String.prototype.escape = function()
{
	return this.replace( /&/g, '&amp;' ).
	replace( /</g, '&lt;' ).
	replace( /"/g, '&quot;' ).
	replace( /'/g, '&#039;' );
}

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