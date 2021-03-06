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
		
		[Bindable]
		[Autowire(bean="productController")]
		public var productController:ProductController;

		
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
			Swiz.addEventListener( SessionController.HAS_MEMBER_LEVEL_EVENT, function( event:Event ):void {
				 load(); 
			 });

		}

		private function replaceProduct( product:Product ):void
		{
			var i:int = 0;
			for each( var productItem:Product in products )
			{
				if( product._id == productItem._id )
				{
				 	products.setItemAt( product, i );
				 	break;
				}
				i++;
			}
		}


		public function load():void
		{	
			var data:Object = {
				packagePath: "/eCommerce",
				ownerFieldName: "products",
				viewFieldNames: [ "name" ],
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
				instance: { 
					_applyTransitions: [{
						name:  "New", 
						parameters: { 
							packagePath: "/eCommerce", 
							ownerFieldName: "products"
						} 
					}] 
				},
				viewStateName: true
			};
			
			
			jsonService.query("applyTransitionToInstance", data, function( result:Object, queryData:Object ):void
			{
				var product:Product = new Product( { name: {}, description: {}, tax: 0, productSpecifics: [ {reference:"", descripton: {}, price: 0 } ] } )
				product._id = result.instance._id;
				product.state = result.instance._stateName;
				selectedProduct = product;
			});
			
		}

		public function edit( sourceProduct:Product ):void
		{
			if( sourceProduct == null ) sourceProduct = selectedProduct;
			
			
			var data:Object = {
				instance: { 
					_id: sourceProduct._id,
					_applyTransitions: [{name:  "Edit"}] 
				},
				viewFieldNames: [ "name", "reference", "description", "pictures", "tax",  "price", "weight", "categories", 
					"productSpecifics", "productOptions","productType", "value", "values" ],
				deepViewFieldNames: ["productSpecifics", "productOptions", "productType", "value", "values" ],
				viewStateName: true
			};

			jsonService.query("applyTransitionToInstance", data, function( result:Object, queryData:Object ):void
			{
				var product:Product = new Product( result.instance );
				replaceProduct( product );
				selectedProduct = product;
			});
			
		}
		public function view( sourceProduct:Product ):void
		{
			if( sourceProduct == null ) sourceProduct = selectedProduct;
			
			var data:Object = {
				instance: { 
					_id: sourceProduct._id,
					_applyTransitions: [{name:  "View"}] 
				},
				viewFieldNames: [ "name", "reference", "description", "pictures", "tax",  "price", "weight", "categories", 
					"productSpecifics", "productOptions","productType", "value", "values" ],
				deepViewFieldNames: ["productSpecifics", "productOptions", "productType", "value", "values" ],
				viewStateName: true
			};
			
			jsonService.query("applyTransitionToInstance", data, function( result:Object, queryData:Object ):void
			{
				var product:Product = new Product( result.instance );
				replaceProduct( product );
				selectedProduct = product; 
			});
			
		}
		
		public function cancel( sourceProduct:Product ):void
		{
			var data:Object = {
				instance: { 
					_id: sourceProduct._id,
					_applyTransitions: [{name:  "Cancel"}] 
				},
				viewFieldNames: [ "name", "description", "pictures", "tax", "weight", "categories", "productSpecifics", "productOptions"],
				deepViewFieldNames: ["productSpecifics", "productOptions"],
				viewStateName: true
			};
			
			
			jsonService.query("applyTransitionToInstance", data, function( result:Object, queryData:Object ):void
			{
				var product:Product = new Product( result.instance );
				selectedProduct = null;
				replaceProduct( product );
			});
			
		}

		public function remove( sourceProduct:Product ):void
		{
			if( sourceProduct == null ) sourceProduct = selectedProduct;

			var applyTransition:String;
			if( sourceProduct.state == "Created" )
			{
				applyTransition = "Cancel";	
			}
			else
			{
				applyTransition = "Delete";
			}

			var data:Object = {
				instance: { 
					_id: sourceProduct._id,
					_applyTransitions: [{name:  applyTransition }] 
				}
			};


			jsonService.query("applyTransitionToInstance", data, function( result:Object, queryData:Object ):void
			{
				selectedProduct = null;
				load();
			});
		}
		
	
		public function update( sourceProduct:Product ):void
		{
			if( sourceProduct == null ) sourceProduct = selectedProduct;
			
			var data:Object = {
				viewStateName: true,
				instance: sourceProduct.toJSONObject()
			};
			
			if( sourceProduct.state == "Created" )
			{
				data.instance._applyTransitions = [{
						name:  "Store", 
						parameters: { 
							packagePath: "/eCommerce", 
							ownerFieldName: "products"
						} 
					}]; 
			}
			else
			{
				data.instance._applyTransitions = [{
						name:  "Update", 
						parameters: { 
							packagePath: "/eCommerce", 
							ownerFieldName: "products"
						} 
					}]; 
			}
			
			jsonService.query("applyTransitionToInstance", data, function( result:Object, queryData:Object ):void
			{
				var product:Product = new Product( result.instance );
				selectedProduct = null;
				replaceProduct( product );
				if( data.appliedTransitionName == "Store" ) load();
			});
			
		}


	}
}