var currentSessionId;

function JSONService( url )
{
	this.serviceURL = url;
	
	this.query = function( methodName, data,  callback )
	{
		this._query( methodName, data, callback, true );
	}
	
	this.querySync = function( methodName, data,  callback )
	{
		this._query( methodName, data, callback, false );
	}


	this._query = function( methodName, data, callback, async )
	{
		
		var queryData = {
				requestDataType: 'json',
				responseDataType: 'jsonp'			
		};
		if( data ) queryData.data = JSON.stringify(data);
		
		$.ajax({
			async: async,
			url: this.serviceURL + '/' + methodName,
			dataType: "jsonp",
			data: queryData,
			success: function( data, text )
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
			}
		}); // ajax
				
	}
}