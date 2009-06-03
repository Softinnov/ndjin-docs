package net.ndjin.ecommerce.model
{
	import mx.collections.ArrayCollection;
	import mx.core.Application;
	
	import net.ndjin.ecommerce.ApplicationLanguage;
	
	[Bindable]
	public class Product
	{
		private static var applicationLanguage:ApplicationLanguage = Application.application.applicationLanguage;

		public var _id:Number;

		public var state:String;

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
		
		
		public var _description:Object;
		public function get description():String
		{
			return _description[applicationLanguage.dataLanguage];
		}
		public function set description(value:String):void
		{
			if( !_description ) _description = {};
			_description[applicationLanguage.dataLanguage] = value;	
		}
		
		
		public var productSpecifics:ArrayCollection;
		
		public var pictures:Array;
		public var tax:Number;
		
		public var categories:ArrayCollection;
		
		public function Product( jsonObject:Object )
		{
			_id = jsonObject._id;
			_name = jsonObject.name;
			_description = jsonObject.description;
			
			pictures = jsonObject.pictures;
			if( jsonObject.tax ) tax = jsonObject.tax;
			else tax = 0;
			
				
			var array:Array = [];
			for each( var o:Object in jsonObject.productSpecifics )
			{
				array.push( new ProductSpecific( o ) );
			}
			productSpecifics = new ArrayCollection( array );
		}
		
		

	}
}