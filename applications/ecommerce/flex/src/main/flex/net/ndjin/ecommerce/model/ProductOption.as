package net.ndjin.ecommerce.model
{
	import mx.core.Application;
	
	import net.ndjin.ecommerce.ApplicationLanguage;
	
	public class ProductOption
	{
		private static var applicationLanguage:ApplicationLanguage = Application.application.applicationLanguage;
		
		public var _id:Number;
		public var productionOptionTypeId:Number;
		
		private var _value:Object;
		public function get value():String
		{
			return _value[applicationLanguage.dataLanguage];
		}
		public function set value(text:String):void
		{
			if( !_value ) _value = {};
			_value[applicationLanguage.dataLanguage] = text;	
		}

		public var productType:ProductType;

		public function ProductOption( jsonObject:Object )
		{
			_id = jsonObject._id;
			if( jsonObject.productOptionType ) productionOptionTypeId = jsonObject.productOptionType[0]._id;
			_value = jsonObject.value;
			productType = new ProductType( jsonObject.productType[0] );
		}

	}
}