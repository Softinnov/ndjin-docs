var json2Loaded; if (!json2Loaded) {	json2Loaded = true;	document.write('<script type="text/javascript" src="./lib/json2.js"></script>'); }
var jqueryLoaded; if (!jqueryLoaded) {jqueryLoaded = true; document.write('<script type="text/javascript" src="./lib/jquery/jquery-1.3.2.min.js"></script>');}

function Model(appName, asyncRequest ){
    this.ndjinServiceURL = "http://"+ appName + ".ndjin.net/ng/service";
	this.async = asyncRequest;
    
	this.dataTypes = [];
    
    this.init = function(){
		var that = this;
        $.ajax({
            url: this.ndjinServiceURL + "/ModelService/getDataTypes",
			async: this.async,
            dataType: "jsonp",
            data: {
                requestDataType: 'json',
                responseDataType: 'jsonp'
            },
            success: function(data, textStatus){
				that.dataTypes = data.result.dataTypes;
            } // success
        }); // ajax
    }
    
    this.getDataTypeIdByName = function( name )
	{
		for( var i=0; i<this.dataTypes.length; i++ )
		{
			if( this.dataTypes[i].name == name ) return this.dataTypes[i]._id;
		}
	}
	
	
	this.createOrUpdateDataType = function( dataType )
	{
		var that = this;
		var data = { dataType: dataType };
        $.ajax({
            url: this.ndjinServiceURL + "/ModelService/updateDataType",
			async: this.async,
            dataType: "jsonp",
            data: {
                requestDataType: 'json',
                responseDataType: 'jsonp',
				data: JSON.stringify( data )
            },
            success: function(data, textStatus){
				that.dataTypes.push( data.result.dataType );
            } // success
        }); // ajax
	}
}
