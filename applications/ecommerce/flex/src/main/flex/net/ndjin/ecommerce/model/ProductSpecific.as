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
			var obj:Object = {
				_id : _id,
				reference: reference,
				description: _description,
				price: price
			}
			if( _id )
			{
				obj._dirty = true;
			}
			return obj;
		}

	}
}