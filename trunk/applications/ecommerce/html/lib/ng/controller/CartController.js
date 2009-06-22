var ADD_TO_CART_EVENT = "ADD_TO_CART_EVENT";
var REMOVE_FROM_CART_EVENT = "REMOVE_FROM_CART_EVENT";

function CartController()
{
	this.views = [];
	
	
	this.cart;
	
	this.jsonService = new JSONService( baseURL+'/service/InstanceService' );
	
	
	dispatcher.addEventListener( REMOVE_FROM_CART_EVENT, this, function( that, data )
	{
		that.removeFromCurrentCart( data.product._id, data.productSpecific._id );
	});
	dispatcher.addEventListener( ADD_TO_CART_EVENT, this, function( that, data )
	{
		that.addToCart( data.product._id, data.productSpecific._id );
	});



	
	this.addToCart = function( productId, specificId )
	{
		if ( this.cart == null)
		{
			this.loadItemToCart( productId, specificId );
		}
		else
		{
			this.addToCurrentCart( productId, specificId )
		}
	}
	
	
						



	this.addToCurrentCart = function( productId, specificId )
	{
		
		var cart = {
			_applyTransitions: [{name:'Update'}],
			_id: this.cart._id,
			cartItems : [] 
		}

		
		if( this.cart.cartItems ) $.each( this.cart.cartItems, function( i, item )
		{
			var itemSpecificId = item.productSpecific[0]._id;
			if( itemSpecificId == specificId )
			{
				var quantity = 1;
				if( !isNaN(item.quantity)  ) quantity = item.quantity + 1;
				
				cart.cartItems.push( {
					_applyTransitions: [{name:'Update'}],
					_id: item._id,
					quantity: quantity							
				} );
			}
			
		});
		
		if( cart.cartItems.length == 0 )
		{
			cart.cartItems.push( {
				_applyTransitions: [{name:'New'},{name:'Store'}],
				quantity: 1,
				productSpecific: 
				{
					_applyTransitions: [{name:'Append'}],
					_id: specificId
				}			
			} );
		}
	

		var data = 
		{
			deepViewFieldNames: ['cartItems', 'productSpecific', 'product' ],
			instance: cart
		};
		
		var that = this;
		this.jsonService.query( 'applyTransitionToInstance', data, function( data )
		{
			that.cart = data.result.instance;
			$.each( that.views, function( i, view )
			{
				view.display(that.cart);
			});

		});
			
	}
	
	
	
	this.removeFromCurrentCart = function(productId, specificId)
	{
		var cart = {
			_applyTransitions: [{name:'Update'}],
			_id: this.cart._id,
			cartItems : [] 
		}
		
		if( this.cart.cartItems ) $.each( this.cart.cartItems, function( i, item )
		{
			var itemSpecificId = item.productSpecific[0]._id;
			if( itemSpecificId == specificId )
			{
				cart.cartItems.push( {
					_applyTransitions: [{name:'Delete'}],
					_id: item._id
				} );
			}
		});

		var data = 
		{
			deepViewFieldNames: ['cartItems', 'productSpecific', 'product' ],
			instance: cart,
		};
		

		var that = this;
		this.jsonService.query( 'applyTransitionToInstance', data, function( data )
		{
			that.cart = data.result.instance;
			$.each( that.views, function( i, view )
			{
				view.display(that.cart);
			});

		});

	}

	this.loadCart = function()
	{
		var data = 
		{
			packagePath: '/eCommerce',
			ownerFieldName: 'carts',
			filters: [{
				fieldName: 'linkedSessionId',
				operator: "=",
				value: currentSessionId
			}],
			deepViewFieldNames: ['cartItems', 'productSpecific', 'product' ]
		};
		
		
		var that = this;
		this.jsonService.query( 'getInstances', data, function( data )
		{
			if (data.result['instances']) 
			{
				that.cart = data.result.instances[0];
				$.each( that.views, function( i, view )
				{
					view.display(that.cart);
				});
			}
		});
	}


	this.loadItemToCart = function( productId, specificId ) 
	{
		var data = 
		{
			packagePath: '/eCommerce',
			ownerFieldName: 'carts',
			filters: [{
				fieldName: 'linkedSessionId',
				operator: "=",
				value: currentSessionId
			}],
			deepViewFieldNames: ['cartItems', 'productSpecific', 'product' ]
		};
		
		
		
		var that = this;
		this.jsonService.query( 'getInstances', data, function( data )
		{
			if( data.result['instances'] ) 
			{
				that.cart = data.result.instances[0];
				that.addToCurrentCart( productId, specificId );
			}
			else
			{
				that.createCartWithItem( productId, specificId  );
			}
		});
	
	}


	this.createCartWithItem = function( productId, specificId )
	{
		var data = {
			instance: {
				_applyTransitions: [{
					name: 'New',
					parameters: {
						packagePath: '/eCommerce',
						ownerFieldName: 'carts'
					}
				}, {
					name: 'Store',
					parameters: {
						packagePath: '/eCommerce',
						ownerFieldName: 'carts'
					}
				}]
			}
		};
		
		
		var that = this;
		this.jsonService.query( 'applyTransitionToInstance', data, function( data )
		{
			that.cart = data.result.instance;
			that.addToCurrentCart( productId, specificId );
		});
	
	}
	
}
