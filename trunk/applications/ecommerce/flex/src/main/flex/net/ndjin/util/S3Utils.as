package net.ndjin.util
{
	public class S3Utils
	{
		public static function getPublicURL( url:String ):String
		{
			if( url )
			{
				url = url.replace("s3://", "http://datastore-eu-test.smk.fr/" );
				return url;
			}
			return null;	
		}
	}
}