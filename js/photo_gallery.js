// Depends on utlities.js.

var gPhotos = 
[
	{filename: "jotsview_screenshot.png", width: 320, height: 480},
	{filename: "editorviewlandscape_screenshot.png", width: 480, height: 320},
	{filename: "outletselection_screenshot.png", width: 320, height: 480},
	{filename: "imageeditor_screenshot.png", width: 320, height: 480},
	{filename: "jotsviewhelp_screenshot.png", width: 320, height: 480},
	{filename: "dataliberation_screenshot.png", width: 320, height: 480},
	{filename: "search_screenshot.png",width: 320, height: 480}
];

var gPhotoIndex = 0;
var photoCount = 7;
var gRingIntervalId = null;

function incrementPhotoIndex()
{
	gPhotoIndex++;
	if (gPhotoIndex >= photoCount)
	{
		gPhotoIndex = 0;
	}
}

function decrementPhotoIndex()
{
	gPhotoIndex--;
	if (gPhotoIndex < 0)
	{
		gPhotoIndex = photoCount - 1;
	}	
}

var gShouldAnimateRings = true;
function animateRing(ring)
{
	if (gShouldAnimateRings)
	{
		gRingIntervalId = window.setInterval(function() 
		{
			// Now it's done animating, so reset. 			 
			ring.removeClassName("expandedTriggerRing");
			
			if (navigator.appName.indexOf("Netscape" != -1))
			{
				// Destroy and recreate the node.
				var parent = ring.parentNode;
				var newRing = document.createElement('img');
				newRing.src = ring.src;
				
				parent.removeChild(ring);
				parent.appendChild(newRing)				
				newRing.addClassName("triggerRing");
				ring = newRing;
			}
			// And start the animation again.
		  	// The "setTimeout" ensures that the initial style is rendered, and hence allows the transition to run.
			window.setTimeout(function() 
			{
				ring.addClassName("expandedTriggerRing");
			}, 0);						
		}, 1600);
		
		// Kick off animation.
		ring.addClassName("expandedTriggerRing");
	}
}

function setUpRingAnimation()
{
	if (gShouldAnimateRings)
	{
	  	var rings = document.querySelectorAll('.triggerRing');
		// 	  	for (var i = 0; i < rings.length; ++i) 
		// {
		// 	    	animateRing(rings[i]);		
		// }		
		// Right now, we're only handling one.
		animateRing(rings[0]);
	}
}


function showOverlay()
{
  var overlay = document.getElementById('overlay');
  overlay.removeClassName('hidden');
  // The "setTimeout" ensures that the initial style is rendered, and hence allows the transition to run.
  window.setTimeout(function() {
    overlay.addClassName('visible');
	showNextPhoto();
  }, 0);
}

function hideOverlay()
{
  var overlay = document.getElementById('overlay');
  overlay.removeClassName('visible');
  // The "setTimeout" ensures that the initial style is rendered, and hence allows the transition to run.
  window.setTimeout(function() {
    overlay.addClassName('hidden');
  }, 0);
}

// function overlayIsVisible()
// {
// 	var overlay = document.getElementById('overlay');
// 	return overlay.hasClassName('visible');
// }

function showNextPhoto()
{		
  	var photoContainer = document.getElementById('photo-container');
  	photoContainer.removeAllChildren();

 	var newContent = createElementForAssetAtIndex(gPhotoIndex);
	incrementPhotoIndex();
	
  	photoContainer.appendChild(newContent);	
}

function createElementForAssetAtIndex(assetIndex)
{
	if (assetIndex < 0 || assetIndex >= photoCount)
	{
 		return undefined;
	
	}
	var container = document.createElement('div');
	container.className = 'contents';

	var photoData = gPhotos[assetIndex];
	var mediaElement;
	if (photoData.filename.match(/[.jpg|.png|.gif]$/)) 
	{
    	// If the asset has an image extension, make an image element.
    	mediaElement = new Image();
    	// Register a load listener; when it fires, our handleEvent() method will get called.
    	//mediaElement.addEventListener('load', this, false);
    	mediaElement.src = "img/" + photoData.filename;
		mediaElement.width = photoData.width;
		mediaElement.height = photoData.height;
	} 

	container.appendChild(mediaElement);
	return container;
}

function setUp()
{
  	var triggerElements = document.querySelectorAll('.overlayTrigger');
  	for (var i = 0; i < triggerElements.length; ++i) 
	{
    	var curElement = triggerElements[i];
    	// ".bind()" calls Function.prototype.bind (in utilities.js); it's a convenient way to
    // hook up an event listener with 'this' as the target, inside a loop.
    	curElement.addEventListener('click', triggerClicked.bind(this, curElement), false);
	}
	
	var overlay = document.getElementById('overlay');
	overlay.addEventListener('click', hideOverlay.bind(this, overlay), false);
	
	// Using jQuery so that the handler gets the event and can stop propagation.
	$('#photo-container').bind('click', photoContainerClicked);
	//   	var photoContainer = document.getElementById('photo-container');
	// photoContainer.addEventListener('click', showNextPhoto.bind(this, photoContainer), false);

	// Get ring animation going.
	setUpRingAnimation();
}

function triggerClicked()
{	
  // var galleryContainer = document.getElementById('gallery-container');
  // gGallery = new Gallery(galleryContainer);

	showOverlay();
}

function photoContainerClicked(event)
{
	// event.stopPropagation();
	showNextPhoto();
	return false; // Equivalent to event.stopPropagation.
}

// The preferred way to call a function when the page loads.
window.addEventListener('load', setUp, false);
