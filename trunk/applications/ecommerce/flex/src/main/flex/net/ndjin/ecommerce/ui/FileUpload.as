package net.ndjin.ecommerce.ui
{
	import flash.events.*;
	import flash.net.FileFilter;
	import flash.net.FileReference;
	import flash.net.URLRequest;
	import flash.net.URLVariables;
	
	import mx.controls.ProgressBar;
	import mx.core.UIComponent;
	import mx.managers.CursorManager;
	
	import net.ndjin.ecommerce.json.JSONService;


    public class FileUpload extends UIComponent 
    {
        private var url:String;
        public var fileName:String;
        public var parameters:URLVariables = new URLVariables();
        
        private var fileReference:FileReference;
            
        
        private var progressBar:ProgressBar;
        private var completeHandler:Function;
        
        public var filterName:String = "Images (*.jpg, *.jpeg, *.gif, *.png)";
        public var filterExtension:String = "*.jpg; *.jpeg; *.gif; *.png";
        
        [Bindable]
		public var uploading:Boolean = false;

        public function init( url: String, progressBar:ProgressBar = null, completeHandler:Function = null ):void 
        {
			this.url = url;
            
            fileReference = new FileReference();
            fileReference.addEventListener(Event.SELECT, selectHandler);
            
            if( progressBar )
            {
            	this.progressBar = progressBar;
       			fileReference.addEventListener(ProgressEvent.PROGRESS, progressHandler);
            }
           
            this.completeHandler = completeHandler;
            fileReference.addEventListener(Event.COMPLETE, localCompleteHandler);
        }



		private function localCompleteHandler( event:Event ):void
		{
			uploading = false;
			CursorManager.removeBusyCursor();
			completeHandler( event );
		}



        public function cancelUpload():void 
        {
            fileReference.cancel();
        }

        public function startUpload():void {
            fileReference.cancel();
            var imageTypes:FileFilter = new FileFilter(filterName, filterExtension);
            var types:Array = new Array(imageTypes);
            fileReference.browse(types);
        }

        /**
         * Begin uploading the file specified in the UPLOAD_URL constant.
         */
        private function selectHandler(event:Event):void {
            var request:URLRequest = new URLRequest(url);
            
		  	parameters.ndjinSession=JSONService.sessionId;
			request.data = parameters;
			
            fileReference.upload(request);
            CursorManager.setBusyCursor();
        	uploading = true;
            fileName = fileReference.name;
        }

        private function progressHandler(event:ProgressEvent):void 
        {
        	if( event.bytesLoaded == event.bytesTotal ) progressBar.label = "Server Process...";
            else progressBar.setProgress( event.bytesLoaded, event.bytesTotal );
        }

	}
}