package net.ndjin.ecommerce.ui
{
	import flash.events.*;
	import flash.net.FileFilter;
	import flash.net.FileReference;
	import flash.net.URLRequest;
	import flash.net.URLVariables;
	
	import mx.containers.Box;
	import mx.controls.Button;
	import mx.controls.ProgressBar;
	import mx.core.UIComponent;
	import mx.managers.CursorManager;
	
	import net.ndjin.ecommerce.json.JSONService;


    public class FileUpload extends UIComponent 
    {
        // Hard-code the URL of the remote upload script.
        public var url:String;
        public var fileName:String;
        public var parameters:URLVariables = new URLVariables();
        
        private var fileReference:FileReference;
            
        
        private var pb:ProgressBar;
        private var btn:Button;
        private var uploadbox:Box;
        private var completeHandler:Function;
        
        public var filterName:String = "Images (*.jpg, *.jpeg, *.gif, *.png)";
        public var filterExtension:String = "*.jpg; *.jpeg; *.gif; *.png";
        
        public function FileUpload() 
        {

        }

        /**
         * Set references to the components, and add listeners for the SELECT,
         * OPEN, PROGRESS, and COMPLETE events.
         */

        public function init( uploadbox:Box = null, pb:ProgressBar = null, btn:Button=null, completeHandler:Function = null ):void 
        {

            // Set up the references to the progress bar and cancel button, which are passed from the calling script.
            this.btn = btn;
            
            
            fileReference = new FileReference();
            fileReference.addEventListener(Event.SELECT, selectHandler);
            
            if( uploadbox )
            {
            	this.uploadbox=uploadbox;
            	fileReference.addEventListener(Event.OPEN, openHandler);
            }
            if( pb )
            {
            	this.pb = pb;
       			fileReference.addEventListener(ProgressEvent.PROGRESS, progressHandler);
            }
           
            this.completeHandler = completeHandler;
            
            fileReference.addEventListener(Event.COMPLETE, localCompleteHandler);
        }



		private function localCompleteHandler( event:Event ):void
		{
			CursorManager.removeBusyCursor();
			completeHandler( event );
		}



        /**
         * Immediately cancel the upload in progress and disable the cancel button.
         */
        public function cancelUpload():void {
            fileReference.cancel();
            //pb.label = "UPLOAD CANCELLED";
            if( btn ) btn.enabled = false;
            if( uploadbox )
            {
            	uploadbox.visible = false;
            	uploadbox.width = 0;
            }
        }

        /**
         * Launch the browse dialog box which allows the user to select a file to upload to the server.
         */
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
            fileName = fileReference.name;
        }


        /**
         * When the OPEN event has dispatched, change the progress bar's label 
         * and enable the "Cancel" button, which allows the user to abort the 
         * upload operation.
         */
        private function openHandler(event:Event):void {
            //pb.label = "UPLOADING";
            if( btn ) btn.enabled = true;
            uploadbox.visible = true;
            uploadbox.width = uploadbox.measuredWidth;
        }

        /**
         * While the file is uploading, update the progress bar's status and label.
         */
        private function progressHandler(event:ProgressEvent):void {
            //pb.label = "%3%%";
        	if( event.bytesLoaded == event.bytesTotal ) pb.label = "Server Process...";
            else pb.setProgress(event.bytesLoaded, event.bytesTotal);
        }

	}
}