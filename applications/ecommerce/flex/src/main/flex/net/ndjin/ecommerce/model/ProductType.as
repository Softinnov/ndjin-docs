package net.ndjin.ecommerce.model
{
	import mx.collections.ArrayCollection;
	import mx.core.Application;
	
	import net.ndjin.ecommerce.ApplicationLanguage;
	
	public class ProductType
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

		public var values:ArrayCollection;

		public function ProductType( jsonObject:Object )
		{
			_id = jsonObject._id;
			_name = jsonObject.name;

			var array:Array = [];
			if( jsonObject.values ) for each( var o:Object in jsonObject.values )
			{
				array.push( new ProductTypeValue( o ) );
			}
			values = new ArrayCollection( array );
			
			
		}

		public function toString():String
		{
			return name;
		}

	}
}