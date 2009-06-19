var CUSTOMER_UPDATE_EVENT = "CUSTOMER_UPDATE_EVENT";
var CUSTOMER_UPDATE_COMPLETE_EVENT = "CUSTOMER_UPDATE_COMPLETE_EVENT";


function CustomerController()
{
	this.customer;
	this.views = [];
	this.jsonService = new JSONService( baseURL+'/service/InstanceService' );
	
	dispatcher.addEventListener( CUSTOMER_UPDATE_EVENT, this, function( that, data )
	{
		that.updateCustomer( data );
	});
	
	
	this.loadCustomer = function ()
	{
		var data = 
		{
			packagePath: '/eCommerce',
			ownerFieldName: 'customers',
			selectOperationName: "selectCustomer",
			deepViewFieldNames: [ 'shippingAddress', 'billingAddress']
		};
		
		
		var that = this;
		this.jsonService.query( 'getInstances', data, function( data )
		{
			if( data.result.instances )
			{
				that.customer = data.result.instances[0];
				$.each( that.views, function( i, view )
				{
					view.display( that.customer );
				});
			}
			else
			{			
				that.createCustomer();
			}
		});
		
	}
	
	
	this.createCustomer = function()
	{
		var data = 
		{
			deepViewFieldNames: [ 'shippingAddress', 'billingAddress'],
			instance: {
				_applyTransitions: [{
					name: 'New',
					parameters: {
						packagePath: '/eCommerce',
						ownerFieldName: 'customers'
					}
				}, {
					name: 'Store',
					parameters: {
						packagePath: '/eCommerce',
						ownerFieldName: 'customers'
					}
				}]
			}				
		};
		
		
		var that = this;
		this.jsonService.query( 'applyTransitionToInstance', data, function( data )
		{
			that.customer = data.result.instance;
			$.each( that.views, function( i, view )
			{
				view.display( that.customer );
			});
		});
	

	}
	
	this.updateCustomer = function( customer )
	{
		var data = 
		{
			instance: customer,
			deepViewFieldNames: [ 'shippingAddress', 'billingAddress'],
			deepUpdateFieldNames: [ 'shippingAddress', 'billingAddress', 'customerCredential'],

		};
		
		var that = this;
		this.jsonService.query( 'applyTransitionToInstance', data, function( data )
		{
			that.customer = data.result.instance;
			$.each( that.views, function( i, view )
			{
				view.display( that.customer );
				dispatcher.dispatch( CUSTOMER_UPDATE_COMPLETE_EVENT, null );
			});

		});

	}
	
}
