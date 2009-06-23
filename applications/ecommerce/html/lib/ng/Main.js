document.write('<script type="text/javascript" src="./lib/jquery.jbind-1.5.8.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/json2.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/swfaddress.js"></script>'); 

document.write('<script type="text/javascript" src="./lib/ng/JSONService.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/Dispatcher.js"></script>'); 

document.write('<script type="text/javascript" src="./lib/ng/controller/SessionController.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/controller/CategoryController.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/controller/ProductController.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/controller/CartController.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/controller/CustomerController.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/controller/OrderController.js"></script>'); 

document.write('<script type="text/javascript" src="./lib/ng/view/LanguageView.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/view/CategoryView.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/view/ProductView.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/view/CartView.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/view/CustomerView.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/view/OrderView.js"></script>'); 



var baseURL = "http://localhost:8080/ng/ecom";
var ndjinURL = baseURL;
var ndjinServiceURL = ndjinURL+ "/service";


var CHECKOUT_PAGE = 'co';

$(document).ready(function()
{
	globalAjaxCursorChange();
	
	function gotoOpenID( openId )
	{
		var url = ndjinURL+"/auth?returnURL="+escape( location.href )+"&openID=" + openId;
		window.location = url;
	}
	$('#loginButton').click( function (){ 
			gotoOpenID( $('#loginOpenID').val() );		
	});
	$('#loginOpenID').keypress(function (e){
		if( e.which == 13 )
		{
			gotoOpenID( $('#loginOpenID').val() );
		}
	});
	$('#googleOpenIDButton').click( function (){ 
		gotoOpenID( "https://www.google.com/accounts/o8/id" );
	});
	$('#yahooOpenIDButton').click( function (){ 
		gotoOpenID( "https://me.yahoo.com/" );
	});
	
	
	$('#logoutButton').click( function (){ 
		logout();		
	});


	
	var languageView = new LanguageView( $('#languageCombobox' ) );
	
	
	
	var cartController = new CartController();
	var categoryController = new CategoryController();
	var productController = new ProductController();
		
	
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


			var sessionController = new SessionController();

			var customerController = new CustomerController();
			var customerView = new CustomerView( $('#customer') );			
			customerController.views.push( customerView );

			var orderController = new OrderController();
			var orderView = new OrderView( $('#templates *[name=order] *[name=orderItems]'), $('#checkout div[name=order]')  );			
			orderController.views.push( orderView );


			if( !sessionController.getOpenId() )
			{
				$('#signIn').show();
				customerView.hide();
			}
			else
			{
				$('#signIn').hide();
				customerView.show();
				customerController.loadCustomer();
				orderController.createOrder( cartController.cart._id );
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
