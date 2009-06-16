function CategoryView( template, target )
{
	this.template = template;
	this.target = target;

	this.categories;

	
	dispatcher.addEventListener( LANGUAGE_CHANGED_EVENT, this, function( that, data )
	{
		if( that.categories ) that.displayCategories( that.categories );
	});
	
	
	
	this.displayCategories = function ( value )
	{
		this.categories = value;

		var clone = this.template.clone();
		clone.empty();
		this.target.empty();
		this.target.append( clone );
		
		var itemTemplate = this.template.find( 'li' );
		
		
		$.each( value, function( i, instance )
      	{
			var itemClone = itemTemplate.clone();
			itemClone.click( function ()
			{ 
				dispatcher.dispatch( PRODUCT_CATEGORY_CHANGED_EVENT, instance._id );
			});

			itemClone.text( instance.name[lang] );
			clone.append( itemClone );
		});
	}
}