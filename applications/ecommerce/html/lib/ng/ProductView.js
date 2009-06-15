function ProductView( template, target )
{
	this.template = template;
	this.target = target;
	
	this.cartController;

	this.products;
	
	
	
	dispatcher.addEventListener( LANGUAGE_CHANGED_EVENT, this, function( that, data )
	{
		that.displayProducts( that.products );
	});
	
	
	this.displayProducts = function ( value )
	{
		this.products = value;

      	this.target.empty();
		
		var that = this;
		$.each( value, function( i, instance )
      	{
			var clone = that.template.clone();
			clone.find( '*[name=name]' ).text( instance.name[lang] );
			if( instance.description ) clone.find( '*[name=description]' ).text( instance.description[lang] );
			clone.find( '*[name=tax]' ).text( instance.tax );
			that.target.append( clone );
			
			if( instance['productSpecifics'] )
			{
				var subTargetElement = clone.find( '*[name=productSpecifics]' );
      			subTargetElement.empty();
				
				var subTemplate = template.find( '*[name=productSpecifics] *[name=productSpecific]' );
				
				$.each( instance.productSpecifics, function( j, subInstance )
				{
					var subClone = subTemplate.clone();
					subClone.find( '*[name=reference]' ).text( subInstance.reference );
					if( subInstance.description ) subClone.find( '*[name=description]' ).text( subInstance.description[lang] );
					subClone.find( '*[name=price]' ).text( subInstance.price );
					
					subClone.find( '*[name=addToCart]' ).click( function ()
					{ 
						dispatcher.dispatch( ADD_TO_CART_EVENT, {
							product: instance,
							productSpecific: subInstance
						});
					});
					
					subTargetElement.append( subClone );
					
				});
			}
			
		});


	}
	
	
	
}