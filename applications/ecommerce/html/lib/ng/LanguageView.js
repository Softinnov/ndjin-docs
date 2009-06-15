var lang = 'en';
var LANGUAGE_CHANGED_EVENT = "LANGUAGE_CHANGED_EVENT";

function LanguageView(target)
{
	this.target = target;
	var that = this;	

	dispatcher.addEventListener( LANGUAGE_CHANGED_EVENT, this, function( that, data )
	{
		lang = data;
		that.target.find( 'option:contains('+data+')').attr('selected', true );
	});



	target.change( function( e )
	{
		var l = that.target.find('option:selected"').text();
		if( lang != l )
		{
			lang = l;
			dispatcher.dispatch( LANGUAGE_CHANGED_EVENT, l );
		}
	});


}