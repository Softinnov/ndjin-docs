package net.ndjin.ecommerce.model
{
	import mx.core.Application;
	
	import net.ndjin.ecommerce.ApplicationLanguage;
	
	public class ProductOption
	{
		private static var applicationLanguage:ApplicationLanguage = Application.application.applicationLanguage;
		
		public var _id:Number;
		public var productionOptionTypeId:Number;
		
		public var value:ProductTypeValue;

		public var productType:ProductType;

		public function ProductOption( jsonObject:Object )
		{
			_id = jsonObject._id;
			if( jsonObject.productOptionType ) productionOptionTypeId = jsonObject.productOptionType[0]._id;
			if( jsonObject.value) value =  new ProductTypeValue( jsonObject.value[0] );
			if( jsonObject.productType) productType = new ProductType( jsonObject.productType[0] );
		}

	}
}