package net.ndjin.ecommerce.model
{
	import mx.core.Application;
	
	import net.ndjin.ecommerce.ApplicationLanguage;
	
	public class ProductOption
	{
		private static var applicationLanguage:ApplicationLanguage = Application.application.applicationLanguage;
		
		public var _id:Number;
		
		public var value:ProductTypeValue;

		public var productType:ProductType;

		public function ProductOption( jsonObject:Object )
		{
			_id = jsonObject._id;
			if( jsonObject.value) value =  new ProductTypeValue( jsonObject.value[0] );
			if( jsonObject.productType) productType = new ProductType( jsonObject.productType[0] );
		}
		
		
		public function toJSONObject():Object
		{
			
			var obj:Object = {
				_id : _id,
				value : { _id: value._id, _applyTransitions: [ {name:  "Append" }] },
				productType: { _id: productType._id,  _applyTransitions: [ {name:  "Append" }] }
			}
			
			if( _id )
			{
				obj._applyTransitions = [ {name:  "Update" }]
			}
			else
			{
				obj._applyTransitions = [ {name:  "New" }, {name:  "Store" }]
			}
			
			return obj;
		}

	}
}