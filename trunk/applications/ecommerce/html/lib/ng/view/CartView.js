function CartView( template, target )
{
	this.template = template;
	this.target = target;
	
	this.cartController;
	
	this.cart;
	
	
	
	dispatcher.addEventListener( LANGUAGE_CHANGED_EVENT, this, function( that, data )
	{
		if( that.cart )	that.displayCart( that.cart );
	});
	
	this.displayCart = function ( value )
	{
		this.cart = value;
		if (value != null)
		{
			var that = this;
		  	that.target.empty();
			
			if( value['cartItems'] )
			{
				var clone = that.template.clone();
				clone.empty();
				
				var subTemplate = that.template.find( '*[name=cartItem]' );
				
				$.each( value.cartItems, function( j, subInstance )
				{
					var productSpecific = subInstance.productSpecific[0];
					var product = productSpecific.product[0];
					var subClone = subTemplate.clone();
					subClone.find( '*[name=name]' ).text( product.name[lang] );
					subClone.find( '*[name=reference]' ).text( productSpecific.reference );
					subClone.find( '*[name=quantity]' ).text( subInstance.quantity );
					subClone.find( '*[name=tax]' ).text( product.tax );
					subClone.find( '*[name=price]' ).text( productSpecific.price );
					
					subClone.find( '*[name=removeFromCart]' ).click( function ()
					{ 
						dispatcher.dispatch( REMOVE_FROM_CART_EVENT, {
							product: product,
							productSpecific: productSpecific
						});
					});
					
					clone.append( subClone );
					
				});
				
			  	that.target.append( clone );
			}
			
			
		}
		
	}
	
	this.hide = function()
	{
		this.target.empty();
	}
	
}