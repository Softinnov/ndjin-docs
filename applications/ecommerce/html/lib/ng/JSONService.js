var currentSessionId;

function JSONService( url )
{
	this.serviceURL = url;
	
	this.query = function( methodName, data,  callback )
	{
		$.ajax({
        url: this.serviceURL+'/'+methodName,
        dataType: "jsonp",
        data: { requestDataType:'json', responseDataType:'jsonp', data: JSON.stringify( data ) },
        success: function (data, textStatus)
        {
			currentSessionId = data.sessionId;

			if( data.state == "OK" )
			{
				if (callback != null) 
				{
					callback( data );
				}
			}
			else
			{
				alert( data.error.cause + "\n" + data.error.message );
			}
			
		} // success
	}); // ajax
	}
}