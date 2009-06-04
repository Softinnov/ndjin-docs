package net.ndjin.ecommerce.controller
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	
	import mx.collections.ArrayCollection;
	
	import net.ndjin.ecommerce.json.JSONService;
	import net.ndjin.ecommerce.model.Product;
	
	import org.swizframework.Swiz;
	import org.swizframework.factory.IInitializingBean;
	
	public class ProductController extends EventDispatcher implements IInitializingBean
	{
		
		public static var SELECTED_PRODUCT_EVENT:String = "Product.selectedProduct";

		public var jsonService:JSONService;
		
		[Bindable(name='products')]
		public var products:ArrayCollection;
		
		private var _selectedProduct:Product = null;
		public function set selectedProduct( product:Product ):void
		{
			_selectedProduct = product;
			Swiz.dispatchEvent( new Event( SELECTED_PRODUCT_EVENT ) );	
		}
		public function get selectedProduct():Product
		{
			return _selectedProduct;
		}
		
		public function initialize():void
		{
			load();
		}




		public function load():void
		{	
			var data:Object = {
				packagePath: "/eCommerce",
				ownerFieldName: "products",
				viewFieldNames: ["name"],
				viewStateNames: true,
				start: 0,
				count: 50
			};

			jsonService.query("getInstances", data, function( result:Object, queryData:Object ):void
			{
				var stateMap:Object = {};
				for each( var stateName:Object in result.stateNames )
				{
					stateMap[ stateName.id ] = stateName.name; 		
				}
				
				var array:Array = [];
				for each( var o:Object in result.instances )
				{
					var product:Product = new Product( o );
					product.state = stateMap[ o._stateId ];
					array.push( product );
				}
				products = new ArrayCollection( array );
				dispatchEvent( new Event( 'products' )) ;
			});
		}
		
		public function createNew():void
		{
			var data:Object = {
				packagePath: "/eCommerce",
				ownerFieldName: "products",
				appliedTransitionName: "New"
			};
			
			
			jsonService.query("applyTransitionToInstance", data, function( result:Object, queryData:Object ):void
			{
				var product:Product = new Product( { name: {}, description: {}, tax: 0, productSpecifics: [ {reference:"", descripton: {}, price: 0 } ] } )
				product._id = result.instance._id;
				selectedProduct = product; 
			});
			
		}

		public function edit( sourceProduct:Product ):void
		{
			if( sourceProduct == null ) sourceProduct = selectedProduct;
			
			var data:Object = {
				packagePath: "/eCommerce",
				ownerFieldName: "products",
				deepFieldNames: ["productSpecifics", "productOptions"],
				appliedTransitionName: "Edit",
				instance: { _id: sourceProduct._id }
			};
			
			
			jsonService.query("applyTransitionToInstance", data, function( result:Object, queryData:Object ):void
			{
				var product:Product = new Product( result.instance )
				selectedProduct = product; 
				sourceProduct.state = "Edited";
			});
			
		}
		
		public function cancel( sourceProduct:Product ):void
		{
			if( sourceProduct == null ) sourceProduct = selectedProduct;
			var data:Object = {
				packagePath: "/eCommerce",
				ownerFieldName: "products",
				appliedTransitionName: "Cancel",
				instance: { _id: sourceProduct._id }
			};
			
			
			jsonService.query("applyTransitionToInstance", data, function( result:Object, queryData:Object ):void
			{
				selectedProduct = null;
				sourceProduct.state = "Stored";
			});
			
		}

	}
}