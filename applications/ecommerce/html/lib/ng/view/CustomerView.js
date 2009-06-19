function CustomerView( target )
{
	this.target = target;
	
	
	this.customer;
	
	dispatcher.addEventListener( CUSTOMER_UPDATE_COMPLETE_EVENT, this, function( that, data )
	{
		alert( "Customer Update Done" );
	});
	
	
	this.display = function ( value )
	{
		this.customer = value;
		if (value != null)
		{
			this.target.find( 'input[name=firstname]' ).val( this.customer.firstname );
			this.target.find( 'input[name=lastname]' ).val( this.customer.lastname );
			this.target.find( 'input[name=email]' ).val( this.customer.email );
			
			var sa;
			var saEl = this.target.find( '*[name=shippingAddress]' );
			if( this.customer.shippingAddress )
			{
				sa = this.customer.shippingAddress[0];
				
				saEl.find( 'input[name=street1]' ).val( sa.street1 );
				saEl.find( 'input[name=street2]' ).val( sa.street2 );
				saEl.find( 'input[name=city]' ).val( sa.city );
				saEl.find( 'input[name=zipCode]' ).val( sa.zipCode );
				saEl.find( 'input[name=phone]' ).val( sa.phone );
			}

			var ba;
			var baEl = this.target.find( '*[name=billingAddress]' );
			if( this.customer.billingAddress )
			{
				ba = this.customer.billingAddress[0];
				
				baEl.find( 'input[name=street1]' ).val( ba.street1 );
				baEl.find( 'input[name=street2]' ).val( ba.street2 );
				baEl.find( 'input[name=city]' ).val( ba.city );
				baEl.find( 'input[name=zipCode]' ).val( ba.zipCode );
				baEl.find( 'input[name=phone]' ).val( ba.phone );
			}
			
			var that = this;
			
			var customerForm = this.target.find( '#customerForm' );
			customerForm.unbind();
			customerForm.submit( function(){
				var data = {
					_applyTransitions: [{name:'Update', parameters: { packagePath: '/eCommerce', ownerFieldName: 'customers' } } ],
					_id: that.customer._id,
					firstname: that.target.find( 'input[name=firstname]' ).val(),
					lastname: that.target.find( 'input[name=lastname]' ).val(),
					email: that.target.find( 'input[name=email]' ).val(),
					shippingAddress: {
						street1: saEl.find( 'input[name=street1]' ).val(),
						street2: saEl.find( 'input[name=street2]' ).val(),
						city: saEl.find( 'input[name=city]' ).val(),
						zipCode: saEl.find( 'input[name=zipCode]' ).val(),
						phone: saEl.find( 'input[name=phone]' ).val()					
					},
					billingAddress: {
						street1: baEl.find( 'input[name=street1]' ).val(),
						street2: baEl.find( 'input[name=street2]' ).val(),
						city: baEl.find( 'input[name=city]' ).val(),
						zipCode: baEl.find( 'input[name=zipCode]' ).val(),
						phone: baEl.find( 'input[name=phone]' ).val()					
					}
				}
				
				if( sa )
				{
					data.shippingAddress._applyTransitions = [ {name:'Update', parameters: { ownerId: that.customer._id, ownerFieldName: 'billingAddress' }} ];
					data.shippingAddress._id = sa._id;
				}
				else
				{
					data.shippingAddress._applyTransitions = [
							{name:'New', parameters: { ownerId: that.customer._id, ownerFieldName: 'billingAddress' } },
							{name:'Store', parameters: { ownerId: that.customer._id, ownerFieldName: 'billingAddress' } }  
						];
				}
				if( ba )
				{
					data.billingAddress._applyTransitions = [ {name:'Update', parameters: { ownerId: that.customer._id, ownerFieldName: 'billingAddress' } } ];
					data.billingAddress._id = ba._id;
				}
				else
				{
					data.billingAddress._applyTransitions = [
						{name:'New', parameters: { ownerId: that.customer._id, ownerFieldName: 'billingAddress' } },
						{name:'Store', parameters: { ownerId: that.customer._id, ownerFieldName: 'billingAddress' } }  
						];
				}
				
				dispatcher.dispatch( CUSTOMER_UPDATE_EVENT, data );
				return false;
			});
			
		}
		
	}
	
	this.hide = function()
	{
		this.target.hide();
	}

	this.show = function()
	{
		this.target.show();
	}
	
}