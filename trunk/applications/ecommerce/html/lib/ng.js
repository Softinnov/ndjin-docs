document.write('<script type="text/javascript" src="./lib/json2.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/swfaddress.js"></script>'); 
//document.write('<script type="text/javascript"  src="http://api.recaptcha.net/js/recaptcha_ajax.js"></script>' );


var ndjinURL = "http://localhost:8080/ng/ecom";
var ndjinServiceURL = ndjinURL+ "/service";

var lang = 'en';
var currentCategoryId;
var cart;

$(document).ready(function()
{
	globalAjaxCursorChange();
	
	SWFAddress.onChange = function() 
	{
		var cat = SWFAddress.getParameter( "cat" );		
		if( cat )
		{
			currentCategoryId = parseInt( cat );
			loadProductFromCategoryId( currentCategoryId );
		}
		
		var l = SWFAddress.getParameter( "l" );
		if( l && lang != l ) 
		{
			$('#languageCombobox option:contains('+l+')').attr('selected', true );
			lang = l;
			loadCategories();
		}
	} 
	
	
	$('#languageCombobox').change( function( e )
	{
		var l = $('#languageCombobox option:selected"').text();
		SWFAddress.setValue( getAddressValue( l, currentCategoryId) );
	});


	loadCategories();


}); // document


function getAddressValue( l, cat )
{
	var value = '?';
	if( l ) value += 'l='+l;
	if( cat ) value+='&cat='+cat;
	return value;
}

function globalAjaxCursorChange()   
{  
	$("html").bind("ajaxSend", function()
	{ 
		$(this).addClass('busy');  
	}).bind("ajaxComplete", function()
	{  
		$(this).removeClass('busy');  
	});  
}  


function loadCategories()
{
	var data = 
	{
		packagePath: '/eCommerce',
		ownerFieldName: 'categories',
		viewFieldNames: ["name" ]
	};
	$.ajax({
        url: ndjinServiceURL+"/InstanceService/getInstances",
        dataType: "jsonp",
        data: { requestDataType:'json', responseDataType:'jsonp', data: JSON.stringify( data ) },
        success: function (data, textStatus)
        {
			var targetElement = $('#content div[name=categories]');
          	targetElement.empty();
			if (data.result['instances'] ) 
			{
				var template = $('#templates div[name=categories] ul');
				var clone = template.clone();
				clone.empty();
				targetElement.append( clone );
				
				var itemTemplate = template.find( 'li' );
				
				
				$.each( data.result.instances, function( i, instance )
	          	{
					var itemClone = itemTemplate.clone();
					itemClone.click( function ()
					{ 
						SWFAddress.setValue( getAddressValue( lang, instance._id ) );
					});

					itemClone.text( instance.name[lang] );
					clone.append( itemClone );
				});
				
			}
			
		} // success
	}); // ajax
}

function loadProductFromCategoryId( id )
{
	var data = 
	{
		packagePath: '/eCommerce',
		ownerId: id,
		ownerFieldName: 'products',
		deepViewFieldNames: ['productSpecifics', 'productOptions'],
		viewFieldNames: ['name', 'description', 'tax', 'reference', 'price' ]
	};
	$.ajax({
        url: ndjinServiceURL+"/InstanceService/getInstances",
        dataType: "jsonp",
        data: { requestDataType:'json', responseDataType:'jsonp', data: JSON.stringify( data ) },
        success: function (data, textStatus)
        {
			if (data.result['instances'] ) 
			{
				var targetElement = $('#content div[name=products]');
	          	targetElement.empty();
				var template = $('#templates *[name=products] *[name=product]');
				
				$.each( data.result.instances, function( i, instance )
	          	{
					var clone = template.clone();
					clone.find( '*[name=name]' ).text( instance.name[lang] );
					if( instance.description ) clone.find( '*[name=description]' ).text( instance.description[lang] );
					clone.find( '*[name=tax]' ).text( instance.tax );
					targetElement.append( clone );
					
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
								addToCart( instance._id, subInstance._id );
							});
							
							subTargetElement.append( subClone );
							
						});
					}
					
				});
				
			}
			
		} // success
	}); // ajax
}


function displayCart()
{
	if (cart != null)
	{
		var targetElement = $('#content div[name=cart]');
	  	targetElement.empty();
		
		if( cart['cartItems'] )
		{
			var template = $('#templates *[name=cart] *[name=cartItems]');
			var clone = template.clone();
			clone.empty();
			
			var subTemplate = template.find( '*[name=cartItem]' );
			
			$.each( cart.cartItems, function( j, subInstance )
			{
				var subClone = subTemplate.clone();
				subClone.find( '*[name=name]' ).text( subInstance.productSpecific[0].product[0].name[lang] );
				subClone.find( '*[name=reference]' ).text( subInstance.productSpecific[0].reference );
				subClone.find( '*[name=quantity]' ).text( subInstance.quantity );
				
				subClone.find( '*[name=removeFromCart]' ).click( function ()
				{ 
					removeFromCurrentCart( subInstance.productSpecific[0].product[0]._id, subInstance.productSpecific[0]._id )
				});
				
				clone.append( subClone );
				
			});
			
			targetElement.append( clone );
		}
		
		
	}
	
}

function addToCart(productId, specificId)
{
	if (cart == null)
	{
		loadCart(productId, specificId);
	}
	else
	{
		addToCurrentCart(productId, specificId)
	}
}

function addToCurrentCart(productId, specificId)
{
	
	if( !cart.cartItems )
	{
		cart.cartItems = [];
	}
	
	var foundCartItem = false;
	$.each( cart.cartItems, function( i, item )
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
		cart.cartItems.push( {
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
		deepViewFieldNames: ['cartItems', 'productSpecific' ],
		instance: cart,
		appliedTransitionNames: [ 'Edit', 'Update' ]
	};
	
	$.ajax({
        url: ndjinServiceURL+"/InstanceService/applyTransitionToInstance",
        dataType: "jsonp",
        data: { requestDataType:'json', responseDataType:'jsonp', data: JSON.stringify( data ) },
        success: function (data, textStatus)
        {
			cart = data.result.instance;
			displayCart();
		}
	});	
		
}
function removeFromCurrentCart(productId, specificId)
{
	
	var cartItems = [];
	$.each( cart.cartItems, function( i, item )
	{
		var itemSpecificId = item.productSpecific[0]._id;
		if( itemSpecificId != specificId )
		{
			item.productSpecific = { _id: itemSpecificId };		
			cartItems.push( item );
		}
	});
	
	cart.cartItems = cartItems;

	var data = 
	{
		packagePath: '/eCommerce',
		ownerFieldName: 'carts',
		deepUpdateFieldNames: ['cartItems', 'productSpecific' ],
		deepViewFieldNames: ['cartItems', 'productSpecific' ],
		instance: cart,
		appliedTransitionNames: [ 'Edit', 'Update' ]
	};
	
	$.ajax({
        url: ndjinServiceURL+"/InstanceService/applyTransitionToInstance",
        dataType: "jsonp",
        data: { requestDataType:'json', responseDataType:'jsonp', data: JSON.stringify( data ) },
        success: function (data, textStatus)
        {
			cart = data.result.instance;
			displayCart();
		}
	});	

}

function loadCart( productId, specificId ) 
{
	var data = 
	{
		packagePath: '/eCommerce',
		ownerFieldName: 'carts',
		deepViewFieldNames: ['cartItems', 'productSpecific' ]
	};
	$.ajax({
        url: ndjinServiceURL+"/InstanceService/getInstances",
        dataType: "jsonp",
        data: { requestDataType:'json', responseDataType:'jsonp', data: JSON.stringify( data ) },
        success: function (data, textStatus)
        {
			if (data.result['instances']) 
			{
				cart = data.result.instances[0];
				//displayCart();
				addToCurrentCart( productId, specificId );
			}
			else
			{
				createCart( productId, specificId  );
			}
		}
	});

}


function createCart( productId, specificId )
{
	var data = 
	{
		packagePath: '/eCommerce',
		ownerFieldName: 'carts',
		appliedTransitionNames: [ 'New', 'Store' ]
	};
	
	$.ajax({
        url: ndjinServiceURL+"/InstanceService/applyTransitionToInstance",
        dataType: "jsonp",
        data: { requestDataType:'json', responseDataType:'jsonp', data: JSON.stringify( data ) },
        success: function (data, textStatus)
        {
			cart = data.result.instance;
			addToCurrentCart( productId, specificId );
		}
	});

}

