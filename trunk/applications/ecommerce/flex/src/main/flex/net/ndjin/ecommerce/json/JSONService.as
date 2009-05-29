package net.ndjin.ecommerce.json
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

		public var serviceURL:String;

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


		public function query( methodName:String, data:Object = null, callback:Function = null, target:Object = null ):void
		{
			this.url = serviceURL+'/'+methodName; 
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