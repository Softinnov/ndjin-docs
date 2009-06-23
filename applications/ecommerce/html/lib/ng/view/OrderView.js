function OrderView( template, target )
{
	this.template = template;
	this.target = target;
	
	this.order;
	
	
	
	dispatcher.addEventListener( LANGUAGE_CHANGED_EVENT, this, function( that, data )
	{
		if( that.order ) that.display( that.order );
	});
	
	this.display = function ( value )
	{
		this.order = value;
		if (value != null)
		{
			var that = this;
		  	that.target.empty();
			
			if( value['orderItems'] )
			{
				var clone = that.template.clone();
				clone.empty();
				
				var subTemplate = that.template.find( '*[name=orderItem]' );
				
				$.each( value.orderItems, function( j, subInstance )
				{
					var subClone = subTemplate.clone();
					subClone.find( '*[name=name]' ).text( subInstance.productName[lang] );
					subClone.find( '*[name=reference]' ).text( subInstance.productSpecificReference );
					subClone.find( '*[name=quantity]' ).text( subInstance.quantity );
					subClone.find( '*[name=tax]' ).text( subInstance.tax );
					subClone.find( '*[name=price]' ).text( subInstance.price );
					
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