

function SessionController()
{
	this.jsonService = new JSONService( baseURL+'/service/SessionService' );
	
	this.openId;
	
	this.getOpenId = function ()
	{
		if( this.openId  )
		{
			return this.openId;
		}
		
		var that = this;
		this.jsonService.querySync( 'getSessionInfo', null, function( data )
		{
			if( data.result['currentOpenId'] )
			{
				that.openId = data.result.currentOpenId;
			}
		});
		
		
		return this.openId;		
	}
	
	
		
	
}
