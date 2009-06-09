package net.ndjin.ecommerce.controller
{
	
	import flash.events.Event;
	import flash.events.EventDispatcher;
	
	import mx.collections.ArrayCollection;
	
	import net.ndjin.ecommerce.json.JSONService;
	
	import org.swizframework.Swiz;
	import org.swizframework.factory.IInitializingBean;
	
		
		
	public class SessionController extends EventDispatcher implements IInitializingBean
	{
		public static var HAS_MEMBER_LEVEL_EVENT:String = "SessionController.hasMemberLevel";
		public static var HAS_NOT_MEMBER_LEVEL_EVENT:String = "SessionController.hasNotMemberLevel";
	
		public var jsonService:JSONService;
	
		public function initialize():void
		{
		loadUserLevel();
		}
	
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
		


		public function loadUserLevel():void
		{
			jsonService.query("getSessionInfo", null, function( result:Object, queryData:Object ):void
			{
				if( result.member && result.member.level <= 10 )
				{
					Swiz.dispatchEvent( new Event( HAS_MEMBER_LEVEL_EVENT ) );
				}
				else
				{
					Swiz.dispatchEvent( new Event( HAS_NOT_MEMBER_LEVEL_EVENT ) );
				}
			});
			
		}

	}
}