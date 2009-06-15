document.write('<script type="text/javascript" src="./lib/jquery.jbind-1.5.8.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/json2.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/swfaddress.js"></script>'); 

document.write('<script type="text/javascript" src="./lib/ng/JSONService.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/Dispatcher.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/CategoryController.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/CategoryView.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/ProductView.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/ProductController.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/CartView.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/ng/CartController.js"></script>'); 



var baseURL = "http://localhost:8080/ng/ecom";
var ndjinURL = baseURL;
var ndjinServiceURL = ndjinURL+ "/service";

var lang = 'en';

var LANGUAGE_CHANGED_EVENT = "LANGUAGE_CHANGED_EVENT"


$(document).ready(function()
{
	globalAjaxCursorChange();
	
	var cartView = new CartView( $('#templates *[name=cart] *[name=cartItems]'), $('#content div[name=cart]') );
	var cartController = new CartController( cartView );

	var categoryView = new CategoryView( $('#templates div[name=categories] ul'), $('#content div[name=categories]'))
	var categoryController = new CategoryController( categoryView );
	
	var productView = new ProductView( $('#templates *[name=products] *[name=product]'), $('#content div[name=products]') );
	var productController = new ProductController( productView );
	
	categoryController.loadAll();
	
	
	
	
	
	$('#languageCombobox').change( function( e )
	{
		var l = $('#languageCombobox option:selected"').text();
		dispatcher.dispatch( LANGUAGE_CHANGED_EVENT, l );
	});



	SWFAddress.onChange = function() 
	{
		var cat = SWFAddress.getParameter( "cat" );		
		if( cat )
		{
			var categoryId = parseInt( cat );
			if( productController.currentCategoryId != categoryId )
			{
				dispatcher.dispatch( PRODUCT_CATEGORY_CHANGED_EVENT, categoryId );
			}
		}
		
		var l = SWFAddress.getParameter( "l" );
		if( l && lang != l ) 
		{
			$('#languageCombobox option:contains('+l+')').attr('selected', true );
			lang = l;
			dispatcher.dispatch( LANGUAGE_CHANGED_EVENT, l );
		}
	} 
	

	dispatcher.addEventListener( LANGUAGE_CHANGED_EVENT, this, function( that, data )
	{
		var cat = SWFAddress.getParameter( "cat" );	
		SWFAddress.setValue( getAddressValue( data, cat ) );
	});
	dispatcher.addEventListener( PRODUCT_CATEGORY_CHANGED_EVENT, this, function( that, data )
	{
		var l = SWFAddress.getParameter( "l" );
		SWFAddress.setValue( getAddressValue( l, data ) );
	});
	
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
