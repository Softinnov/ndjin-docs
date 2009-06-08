package net.ndjin.ecommerce.model
{
	import mx.collections.ArrayCollection;
	import mx.core.Application;
	
	import net.ndjin.ecommerce.ApplicationLanguage;
	
	[Bindable]
	public class Product
	{
		private static var applicationLanguage:ApplicationLanguage = Application.application.applicationLanguage;

		public var _id:Number;

		public var state:String;

		private var _name:Object;
		
		public function get name():String
		{
			return _name[applicationLanguage.dataLanguage];
		}
		public function set name(value:String):void
		{
			if( !_name ) _name = {};
			_name[applicationLanguage.dataLanguage] = value;	
		}
		
		
		public var _description:Object;
		public function get description():String
		{
			return _description[applicationLanguage.dataLanguage];
		}
		public function set description(value:String):void
		{
			if( !_description ) _description = {};
			_description[applicationLanguage.dataLanguage] = value;	
		}
		
		
		public var productSpecifics:ArrayCollection;
		
		public var pictures:ArrayCollection;
		public var tax:Number;
		public var weight:Number;
		
		public var categories:ArrayCollection;
		
		
		
		// Files {name:'', url:'' } uploaded and to be joined to the update		
		public var uploadedFiles:ArrayCollection;

		
		public function Product( jsonObject:Object )
		{
			uploadedFiles = new ArrayCollection();
			
			
			_id = jsonObject._id;
			state = jsonObject._stateName;
			_name = jsonObject.name;
			_description = jsonObject.description;
			
			if( jsonObject.pictures )
			{
				if( jsonObject.pictures is Array ) pictures = new ArrayCollection( jsonObject.pictures );
				else pictures = new ArrayCollection( [jsonObject.pictures] );
			}
			else pictures = new ArrayCollection();
			
			if( jsonObject.tax ) tax = jsonObject.tax;
			else tax = 0;
			
			if( jsonObject.weight ) weight = jsonObject.weight;
			else weight = 0;
				
			var array:Array = [];
			for each( var o:Object in jsonObject.productSpecifics )
			{
				array.push( new ProductSpecific( o ) );
			}
			productSpecifics = new ArrayCollection( array );

			array = [];
			for each( o in jsonObject.categories )
			{
				array.push( new Category( o ) );
			}
			categories = new ArrayCollection( array );


		}
		
		
		public function toJSONObject():Object
		{
			
			var picturesArray:Array = pictures.source;
			for each( var file:Object in uploadedFiles.source )
			{
				picturesArray.push( file.name );			
			}
			
			
			var productSpecificsArray:Array = [];
			for each( var productSpecific:ProductSpecific in productSpecifics )
			{
				productSpecificsArray.push( productSpecific.toJSONObject() );
			}
			
			return { 
				_id: _id, 
				name: _name,
				description: _description,
				tax: tax,
				weight: weight,
				pictures: picturesArray,
				productSpecifics: productSpecificsArray
				};
		}
		

	}
}