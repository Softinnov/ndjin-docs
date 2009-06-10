package net.ndjin.ecommerce.controller
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	
	import mx.collections.ArrayCollection;
	
	import net.ndjin.ecommerce.json.JSONService;
	import net.ndjin.ecommerce.model.Category;
	import net.ndjin.ecommerce.model.Product;
	
	import org.swizframework.Swiz;
	import org.swizframework.factory.IInitializingBean;
	
	public class CategoryController extends EventDispatcher implements IInitializingBean
	{
		public var jsonService:JSONService;
		
		[Bindable(name='categories')]
		public var categories:ArrayCollection;
		
		
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
				ownerFieldName: "categories",
				deepViewFieldNames: ["categories" ],
				start: 0,
				count: 100
			};

			jsonService.query("getInstances", data, function( result:Object, queryData:Object ):void
			{
				var array:Array = [];
				for each( var o:Object in result.instances )
				{
					var category:Category = new Category( o );
					array.push( category );
				}
				categories = new ArrayCollection( array );
				dispatchEvent( new Event( 'categories' )) ;
			});
		}
		
		public function createNew():void
		{
			
		}
		
		
		public function addProductToCategory( product:Product, category:Category ):void
		{
			var data:Object = {
				packagePath: "/eCommerce",
				sourceOwnerId: category._id,
				sourceOwnerFieldName: "products",
				appliedTransitionName: "Append",
				avoidDuplicate: true,
				instance: { _id: product._id }			
			}
			jsonService.query("applyTransitionsToInstance", data, function( result:Object, queryData:Object ):void
			{
				
			});

		}
		public function removeProductFromCategory( product:Product, category:Category ):void
		{
			var data:Object = {
				packagePath: "/eCommerce",
				sourceOwnerId: category._id,
				sourceOwnerFieldName: "products",
				appliedTransitionName: "Remove",
				instance: { _id: product._id }			
			}
			jsonService.query("applyTransitionsToInstance", data, function( result:Object, queryData:Object ):void
			{
				
			});
			
		}

	}
}