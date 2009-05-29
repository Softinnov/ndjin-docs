package net.ndjin.ecommerce.controller
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	
	import mx.collections.ArrayCollection;
	
	import net.ndjin.ecommerce.json.JSONService;
	import net.ndjin.ecommerce.model.Product;
	
	public class ProductController extends EventDispatcher
	{
		public var jsonService:JSONService;
		
		[Bindable(name='products')]
		public var products:ArrayCollection;
		
		public function ProductController()
		{
		}
		
		public function load():void
		{	
			var data:Object = {
				packagePath: "/eCommerce",
				ownerFieldName: "products",
				deepFieldNames: ["productSpecifics", "productOptions"],
				start: 0,
				count: 50
			};

			jsonService.query("getInstances", data, function( result:Object, queryData:Object ):void
			{
				var array:Array = [];
				for each( var o:Object in result.instances )
				{
					var product:Product = new Product( o );
					array.push( product );
				}
				products = new ArrayCollection( array );
				dispatchEvent( new Event( 'products' )) ;
			});
		}

	}
}