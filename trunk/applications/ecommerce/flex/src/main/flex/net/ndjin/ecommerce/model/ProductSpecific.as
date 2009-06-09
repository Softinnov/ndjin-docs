package net.ndjin.ecommerce.model
{
	import mx.collections.ArrayCollection;
	import mx.core.Application;
	
	import net.ndjin.ecommerce.ApplicationLanguage;
	
	[Bindable]
	public class ProductSpecific
	{
		private static var applicationLanguage:ApplicationLanguage = Application.application.applicationLanguage;
		
		public var _id:Number;
		public var reference:String;
		
		
		public var _description:Object;
		public function get description():String
		{
			if( !_description ) _description = {};
			return _description[applicationLanguage.dataLanguage];
		}
		public function set description(value:String):void
		{
			if( !_description ) _description = {};
			_description[applicationLanguage.dataLanguage] = value;	
		}

		public var price:Number;
		public var productOptions:ArrayCollection;

		public function ProductSpecific( jsonObject:Object )
		{
			_id = jsonObject._id;
			reference = jsonObject.reference;
			_description = jsonObject.description;
			price = jsonObject.price;
			
			var array:Array = [];
			if( jsonObject.productOptions ) for each( var o:Object in jsonObject.productOptions )
			{
				array.push( new ProductOption( o ) );
			}
			productOptions = new ArrayCollection( array );
		}
		
		
		public function toJSONObject():Object
		{
			var productOptionsArray:Array = [];
			for each( var productOption:ProductOption in productOptions )
			{
				productOptionsArray.push( { _id: productOption._id, 
					productType: { _id: productOption.productType._id, name: productOption.productType.name },
					value: { _id: productOption.value._id, name: productOption.value.name } 
					} );
			}

			
			var obj:Object = {
				_id : _id,
				reference: reference,
				description: _description,
				price: price,
				productOptions: productOptionsArray
			}
			if( _id )
			{
				obj._dirty = true;
			}
			return obj;
		}

	}
}