var json2Loaded; if (!json2Loaded) {	json2Loaded = true;	document.write('<script type="text/javascript" src="http://www.json.org/json2.js"></script>'); }
var jqueryLoaded; if (!jqueryLoaded) {jqueryLoaded = true; document.write('<script type="text/javascript" src="http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js"></script>');}


function InstanceHelper(appName, asyncRequest ){
    this.ndjinServiceURL = "http://"+ appName + ".ndjin.net/ng/service";
   	this.async = asyncRequest;
    
	this.applyTransition = function ( query )
	{
		var result;
		$.ajax({
	        url: this.ndjinServiceURL+"/InstanceService/applyTransitionToInstance",
			async: this.async,
	        dataType: "jsonp",
	        data: { requestDataType:'json', responseDataType:'jsonp', data: JSON.stringify( query ) },
	        success: function (data, textStatus)
	        {
				if( data.error )  
				{
					alert( data.error.message );
				}
				else
				{
					result = data.result.instance;
				}
			} // success
		}); // ajax	
		return result;
	}


	this.getInstances = function ( query )
	{
		var result = [];
		$.ajax({
	        url: this.ndjinServiceURL+"/InstanceService/getInstances",
			async: this.async,			
	        dataType: "jsonp",
	        data: { requestDataType:'json', responseDataType:'jsonp', data: JSON.stringify( query ) },
	        success: function (data, textStatus)
	        {
				if( data.error )  
				{
					alert( data.error.message );
				}
				else
				{
					result = data.result.instances;
				}
			} // success
		}); // ajax	
		return result;
	}

	
}