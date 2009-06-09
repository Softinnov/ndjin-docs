document.write('<script type="text/javascript" src="./lib/json2.js"></script>'); 
document.write('<script type="text/javascript" src="./lib/swfaddress.js"></script>'); 
//document.write('<script type="text/javascript"  src="http://api.recaptcha.net/js/recaptcha_ajax.js"></script>' );


var ndjinURL = "http://localhost:8080/ng/ecom";
var ndjinServiceURL = ndjinURL+ "/service";

var lang = 'en';
var currentCategoryId;

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
		viewFieldNames: ["name" ]
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
				var template = $('#templates div[name=products] p');
				
				$.each( data.result.instances, function( i, instance )
	          	{
					var clone = template.clone();
					clone.find( 'b[name=name]' ).text( instance.name[lang] );
					targetElement.append( clone );
				});
				
			}
			
		} // success
	}); // ajax
}





