document.write('<script type="text/javascript" src="./lib/jquery.jbind-1.5.8.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/json2.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/swfaddress.js"></script>'); 

document.write('<script type="text/javascript" src="./lib/ng/JSONService.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/Dispatcher.js"></script>'); 

document.write('<script type="text/javascript" src="./lib/ng/LanguageView.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/SessionController.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/CategoryController.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/CategoryView.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/ProductView.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/ProductController.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/CartView.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/CartController.js"></script>'); 



var baseURL = "http://localhost:8080/ng/ecom";
var ndjinURL = baseURL;
var ndjinServiceURL = ndjinURL+ "/service";

var CHECKOUT_PAGE = 'co';

$(document).ready(function()
{
	globalAjaxCursorChange();
	
	var languageView = new LanguageView( $('#languageCombobox' ) );
	
	
	
	var cartController = new CartController();
	var categoryController = new CategoryController();
	var productController = new ProductController();
	var sessionController = new SessionController();
		
	
	SWFAddress.onChange = function() 
	{
		
		var l = SWFAddress.getParameter( "l" );
		if( l && lang != l ) 
		{
			lang = l;
			dispatcher.dispatch( LANGUAGE_CHANGED_EVENT, l );
		}
		
		
		var p = SWFAddress.getParameter( "p" );
		if( p && p == CHECKOUT_PAGE )
		{
			$('#content').hide();
			$('#checkout').show();

			if( !sessionController.getOpenId() )
			{
				$('#signInForm').show();
			}
			else
			{
				$('#signInForm').hide();
			}

		}
		else
		{
			$('#content').show();
			$('#checkout').hide();
			
			var cartView = new CartView( $('#templates *[name=cart] *[name=cartItems]'), $('#content div[name=cart]') );
			cartController.views.push( cartView );
		
			var categoryView = new CategoryView( $('#templates div[name=categories] ul'), $('#content div[name=categories]'))
			categoryController.views.push( categoryView );

			var productView = new ProductView( $('#templates *[name=products] *[name=product]'), $('#content div[name=products]') );
			productController.views.push( productView );
			
			categoryController.loadAll();
			
			$('#viewCartButton').click( function ()
			{ 
				cartController.loadCart();
			});
			$('#hideCartButton').click( function ()
			{ 
				cartView.hide();
			});
			$('#checkoutButton').click( function ()
			{ 
				SWFAddress.setValue( getAddressValue( null, null, CHECKOUT_PAGE ) );
			});


			var c = SWFAddress.getParameter( "c" );		
			if( c )
			{
				var categoryId = parseInt( c );
				if( productController.currentCategoryId != categoryId )
				{
					dispatcher.dispatch( PRODUCT_CATEGORY_CHANGED_EVENT, categoryId );
				}
			}
			

		}
	} 
	
	


	dispatcher.addEventListener( LANGUAGE_CHANGED_EVENT, this, function( that, data )
	{
		SWFAddress.setValue( getAddressValue( data, null, null ) );
	});
	dispatcher.addEventListener( PRODUCT_CATEGORY_CHANGED_EVENT, this, function( that, data )
	{
		SWFAddress.setValue( getAddressValue( null, data, null ) );
	});
	
	
	
}); // document


function getAddressValue( l, cat, page )
{
	var value = '?';
	if( l == null ) l = SWFAddress.getParameter( "l" );
	if( l ) value += 'l='+l;
	
	if( cat == null ) cat = SWFAddress.getParameter( "c" );
	if( cat ) value+='&c='+cat;

	if( page == null ) page = SWFAddress.getParameter( "p" );
	if( page ) value+='&p='+page;
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
