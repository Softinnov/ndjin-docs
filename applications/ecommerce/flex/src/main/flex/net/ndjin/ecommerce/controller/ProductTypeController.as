package net.ndjin.ecommerce.controller
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	
	import mx.collections.ArrayCollection;
	
	import net.ndjin.ecommerce.json.JSONService;
	import net.ndjin.ecommerce.model.ProductType;
	
	import org.swizframework.Swiz;
	import org.swizframework.factory.IInitializingBean;
	
	public class ProductTypeController extends EventDispatcher implements IInitializingBean
	{
		

		public var jsonService:JSONService;
		
		[Bindable(name='productTypes')]
		public var productTypes:ArrayCollection;
		
		public function initialize():void
		{
			Swiz.addEventListener( SessionController.HAS_MEMBER_LEVEL_EVENT, function( event:Event ):void {
				 load(); 
			 });

		}




		public function load():void
		{	
			var data:Object = {
				packagePath: "/eCommerce",
				ownerFieldName: "productTypes",
				deepFieldNames: ["values"],
				start: 0,
				count: 50
			};

			jsonService.query("getInstances", data, function( result:Object, queryData:Object ):void
			{
				var array:Array = [];
				for each( var o:Object in result.instances )
				{
					var productType:ProductType = new ProductType( o );
					array.push( productType );
				}
				productTypes = new ArrayCollection( array );
				dispatchEvent( new Event( 'productTypes' )) ;
			});
		}
		

	}
}