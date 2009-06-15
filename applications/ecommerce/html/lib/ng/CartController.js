var ADD_TO_CART_EVENT = "ADD_TO_CART_EVENT";
var REMOVE_FROM_CART_EVENT = "REMOVE_FROM_CART_EVENT";

function CartController( view )
{
	this.cart;
	this.view = view;
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
			this.loadCart( productId, specificId );
		}
		else
		{
			this.addToCurrentCart( productId, specificId )
		}
	}
	
	
						



	this.addToCurrentCart = function( productId, specificId )
	{
		
		if( !this.cart.cartItems )
		{
			this.cart.cartItems = [];
		}
		
		var foundCartItem = false;
		$.each( this.cart.cartItems, function( i, item )
		{
			var itemSpecificId = item.productSpecific[0]._id;
			if( itemSpecificId == specificId )
			{
				foundCartItem = true;
				item._dirty = true;
				if( isNaN(item.quantity)  ) item.quantity = 1;
				else item.quantity ++;
			}
			item.productSpecific = { _id: itemSpecificId };		
			
		});
		
		if( !foundCartItem )
		{
			this.cart.cartItems.push( {
				quantity: 1,
				_dirty: true,
				productSpecific: 
				{
					_id: specificId
				}			
			} );
		}
	
		var data = 
		{
			packagePath: '/eCommerce',
			ownerFieldName: 'carts',
			deepUpdateFieldNames: ['cartItems', 'productSpecific' ],
			deepViewFieldNames: ['cartItems', 'productSpecific', 'product' ],
			instance: this.cart,
			appliedTransitionNames: [ 'Edit', 'Update' ]
		};
		
		var that = this;
		this.jsonService.query( 'applyTransitionToInstance', data, function( data )
		{
			that.cart = data.result.instance;
			that.view.displayCart( that.cart );

		});
			
	}
	
	
	
	this.removeFromCurrentCart = function(productId, specificId)
	{
		
		var cartItems = [];
		$.each( this.cart.cartItems, function( i, item )
		{
			var itemSpecificId = item.productSpecific[0]._id;
			if( itemSpecificId != specificId )
			{
				item.productSpecific = { _id: itemSpecificId };		
				cartItems.push( item );
			}
		});
		
		this.cart.cartItems = cartItems;
	
		var data = 
		{
			packagePath: '/eCommerce',
			ownerFieldName: 'carts',
			deepUpdateFieldNames: ['cartItems', 'productSpecific' ],
			deepViewFieldNames: ['cartItems', 'productSpecific', 'product' ],
			instance: this.cart,
			appliedTransitionNames: [ 'Edit', 'Update' ]
		};
		

		var that = this;
		this.jsonService.query( 'applyTransitionToInstance', data, function( data )
		{
			that.cart = data.result.instance;
			that.view.displayCart( that.cart );

		});

	}

	this.loadCart = function( productId, specificId ) 
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
				that.createCart( productId, specificId  );
			}
		});
	
	}


	this.createCart = function( productId, specificId )
	{
		var data = 
		{
			packagePath: '/eCommerce',
			ownerFieldName: 'carts',
			appliedTransitionNames: [ 'New', 'Store' ]
		};
		
		
		var that = this;
		this.jsonService.query( 'applyTransitionToInstance', data, function( data )
		{
			that.cart = data.result.instance;
			that.addToCurrentCart( productId, specificId );
		});
	
	}
	
}
