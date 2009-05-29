package net.ndjin.ecommerce.controller
{
	import com.adobe.utils.ArrayUtil;
	
	import flash.events.EventDispatcher;
	
	import mx.collections.ArrayCollection;
	
	import net.ndjin.ecommerce.json.JSONService;
	
	public class AuthenticationController extends EventDispatcher
	{
		public var jsonService:JSONService;
		[Bindable]
		public var uploadedFilesURL:ArrayCollection;
	
		public function getUploadedFilesURL( fileNames:Array ):void
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
						if( ArrayUtil.arrayContainsValue( fileNames, name ) )
						{
							array.push( { name: name, url: o[name] } );
						}
					}
					uploadedFilesURL = new ArrayCollection( array );
				}
			});
		}

	}
}