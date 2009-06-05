package net.ndjin.ecommerce.controller
{
	
	import flash.events.EventDispatcher;
	
	import mx.collections.ArrayCollection;
	
	import net.ndjin.ecommerce.json.JSONService;
	
	public class SessionController extends EventDispatcher
	{
		public var jsonService:JSONService;
		[Bindable]
		public var uploadedFilesURL:ArrayCollection;
	
		public function getUploadedFilesURL( files:ArrayCollection ):void
		{	
			jsonService.query("getSessionInfo", null, function( result:Object, queryData:Object ):void
			{
				var sessionInstance:Object = result.sessionInstance;
				if( sessionInstance.hasOwnProperty("uploadFolder") )
				{
					
					var o:Object = sessionInstance["uploadFolder"];
					var array:Array = [];
					for( var key:Object in o )
					{
						var name:String = key.toString();
						for each( var fileObject:Object in files )
						{
							if( fileObject.name == name )
							{
								array.push( o[name] );
								fileObject.url = o[name];
							}
						}
					}
					uploadedFilesURL = new ArrayCollection( array );
				}
			});
		}
		

	}
}