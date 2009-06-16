var PRODUCT_CATEGORY_CHANGED_EVENT = "PRODUCT_CATEGORY_CHANGED_EVENT";


function ProductController()
{
	this.products;
	this.views = [];
	this.jsonService = new JSONService( baseURL+'/service/InstanceService' );
	
	this.currentCategoryId;
	
	
	dispatcher.addEventListener( PRODUCT_CATEGORY_CHANGED_EVENT, this, function( that, data )
	{
		this.currentCategoryId = data;
		that.getProductsFromCategoryId( data );
	});
	
	
	
	this.load = function ()
	{
		var data = 
		{
			packagePath: '/eCommerce',
			ownerFieldName: 'categories',
			viewFieldNames: ["name" ]
		};
		
		
		var that = this;
		this.jsonService.query( 'getInstances', data, function( data )
		{
			if( data.result['instances'] )
			{
				that.setCategories( data.result.instances );
			}
		});
		
	}
	
	
	
	this.getProductsFromCategoryId = function( id )
	{
		var data = 
		{
			packagePath: '/eCommerce',
			ownerId: id,
			ownerFieldName: 'products',
			deepViewFieldNames: ['productSpecifics', 'productOptions'],
			viewFieldNames: ['name', 'description', 'tax', 'reference', 'price' ]
		};
		
		
		var that = this;
		this.jsonService.query( 'getInstances', data, function( data )
		{
			that.products = data.result.instances;
			if( that.products )
			{
				$.each( that.views, function( i, view )
				{
					view.display(that.products);
				});
			}
		});
		
	}

	
	
	
}
