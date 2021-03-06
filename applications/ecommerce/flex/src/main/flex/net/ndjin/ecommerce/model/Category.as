package net.ndjin.ecommerce.model
{
	import mx.core.Application;
	import net.ndjin.ecommerce.ApplicationLanguage;
	
	
	public class Category
	{
		private static var applicationLanguage:ApplicationLanguage = Application.application.applicationLanguage;
		
		public var _id:Number;

		private var _name:Object;
		
		public function get name():String
		{
			return _name[applicationLanguage.dataLanguage];
		}
		public function set name(value:String):void
		{
			if( !_name ) _name = {};
			_name[applicationLanguage.dataLanguage] = value;	
		}

		
		public function Category( jsonObject:Object )
		{
			_id = jsonObject._id;
			_name = jsonObject.name;
		}
		
		
		public function toJSONObject():Object
		{
			return { 
				_id: _id, 
				name: _name
				};
		}
	}
}