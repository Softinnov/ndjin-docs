function CategoryController()
{
	this.categories;
	this.views = [];
	this.jsonService = new JSONService( baseURL+'/service/InstanceService' );
	
	this.loadAll = function ()
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
			that.categories = data.result.instances;
			if( that.categories )
			{
				$.each( that.views, function( i, view )
				{
					view.displayCategories(that.categories);
				});
			}
		});
		
	}
	
	
}
