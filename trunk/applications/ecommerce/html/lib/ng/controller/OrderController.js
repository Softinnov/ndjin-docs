
function OrderController()
{
	this.views = [];
	
	
	this.currentOrder;
	
	this.jsonService = new JSONService( baseURL+'/service/InstanceService' );
	
	

	this.createOrder = function( cartId )
	{
		var data = {
			deepViewFieldNames: ['orderItems' ],
			instance: {
				_applyTransitions: [{
					name: 'NewFromCart',
					parameters: {
						cartId: cartId,
						packagePath: '/eCommerce',
						ownerFieldName: 'orders'
					}
				}]
			}
		};
		
		
		var that = this;
		this.jsonService.query( 'applyTransitionToInstance', data, function( data )
		{
			if (data.result['instance']) 
			{
				that.order = data.result.instance;
				$.each(that.views, function(i, view)
				{
					view.display(that.order);
				});
			}
		});
	
	}
	
}
