### Prerequisite ###

You need to register an [OpenID](http://openid.net/get/) and create an application site on [ndjin platform](http://ndjin.net).
Once your application site your have URL to refer to it such as: `http://[your application site name].ndjin.net/ng/`

We use [as3corelib](http://code.google.com/p/as3corelib/) to serialize/deserialize our objects to JSON strings.


### Flex JSON request sample ###


We define a `JSONService` class that will perform json serialization of data and call HTTP Request.

```
package net.ndjin.flex.json
{
	import com.adobe.serialization.json.JSON;
	
	import mx.controls.Alert;
	import mx.rpc.events.ResultEvent;
	import mx.rpc.http.mxml.HTTPService;
	
	public class JSONService
	extends HTTPService
	{
		[Bindable]
		public static var sessionId:String;

		private var callback:Function;
		private var queryData:Object;
		private var target:Object;

		public function JSONService()
		{
			super();
			this.resultFormat="text";
			this.method="POST";
			this.showBusyCursor= true;
		}


		public function query( url:String, data:Object = null, callback:Function = null, target:Object = null ):void
		{
			this.url = url; 
			var params:Object = new Object();
			params.requestDataType ="json";
			params.responseDataType = "json";
			
			if( data != null )
			{ 
				params.data = JSON.encode( data );
			}
			
			this.callback = callback;
			this.queryData = data;
			this.target = target;			
			
			addEventListener( ResultEvent.RESULT, handleRequest );
			send( params );
		}
		
		
		private function handleRequest( event:ResultEvent ):void
		{
			var response:Object = JSON.decode( String( event.result ) );
			sessionId = response.sessionId;
			var state:String = response.state;
			if( state == "OK" )
			{
				if( callback != null )
				{
					if( target == null )
					{
						callback( response.result, queryData );
					}
					else
					{
						callback( response.result, queryData, target );
					}
				}
			}
			else if( state )
			{
				Alert.show( response.error.cause + "\n" + response.error.message, state );
			}
			
		}

	}
}
```


And we perform the query using `JSONService` class.

```
var servicePath = "http://myapp.ndjin.net/ng/service";
var sessionId = null;

var data:Object = { apiKey: "myapikey" };
var service:JSONService = new JSONService();
service.query( servicePath+"/AuthenticationService/authenticate", data,
      function( result:Object, queryData:Object ):void
      {
      	 sessionId = result.sessionId;
      }
 ) ;
```