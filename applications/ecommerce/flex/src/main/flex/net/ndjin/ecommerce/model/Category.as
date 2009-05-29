package net.ndjin.ecommerce.model
{
	
	public class Category
	{
		public var _id:Number;
		public var name:Object;		
		
		public function Category( jsonObject:Object )
		{
			_id = jsonObject._id;
			name = jsonObject.name;
		}
		
		

	}
}