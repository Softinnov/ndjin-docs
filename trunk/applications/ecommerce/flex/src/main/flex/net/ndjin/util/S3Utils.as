package net.ndjin.util
{
	import org.swizframework.Swiz;
	
	public class S3Utils
	{
		public static function getPublicURL( url:String ):String
		{
			if( url )
			{
				if( url.indexOf("s3://") >= 0 )
				{
					url = url.replace("s3://", Swiz.getBean("publicDataStoreURL")+'/' );				
				}
				else if( url.indexOf( "s3p://" ) >= 0 )
				{
					 
					url = Swiz.getBean("baseURL")+"/s3p/?url=" + url;
				}
				
				return url;
			}
			return null;	
		}
	}
}