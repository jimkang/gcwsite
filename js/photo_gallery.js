// Depends on utlities.js.

var gPhotos = [];

if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) 
{
	gPhotos = 
	[
		{filename: "jotsview_screenshot.png", width: 200, height: 300},
		{filename: "editorviewlandscape_screenshot.png", width: 300, height: 200},
		{filename: "outletselection_screenshot.png", width: 200, height: 300},
		{filename: "imageeditor_screenshot.png", width: 200, height: 300},
		{filename: "jotsviewhelp_screenshot.png", width: 200, height: 300},
		{filename: "dataliberation_screenshot.png", width: 200, height: 300},
		{filename: "search_screenshot.png",width: 200, height: 300}
	];	
}
else
{
	gPhotos = 
	[
		{filename: "jotsview_screenshot.png", width: 320, height: 480},
		{filename: "editorviewlandscape_screenshot.png", width: 480, height: 320},
		{filename: "outletselection_screenshot.png", width: 320, height: 480},
		{filename: "imageeditor_screenshot.png", width: 320, height: 480},
		{filename: "jotsviewhelp_screenshot.png", width: 320, height: 480},
		{filename: "dataliberation_screenshot.png", width: 320, height: 480},
		{filename: "search_screenshot.png",width: 320, height: 480}
	];
}

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

function animateRing(ring)
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

function setUpRingAnimation()
{
  	var rings = document.querySelectorAll('.triggerRing');
	// 	  	for (var i = 0; i < rings.length; ++i) 
	// {
	// 	    	animateRing(rings[i]);		
	// }		
	// Right now, we're only handling one.
	animateRing(rings[0]);
}

function takeDownRingAnimationForever()
{
	// Clear the resetter.
	window.clearInterval(gRingIntervalId);
	gRingIntervalId = null;
	// Hide the ring.
  	var rings = document.querySelectorAll('.triggerRing');
	// Right now, we're only handling one.
	rings[0].style.opacity = 0;
}

function setUpArrowHandlers()
{
	var leftArrow = document.getElementById('leftArrow');
	var rightArrow = document.getElementById('rightArrow');

	$(leftArrow).unbind('click');	
	$(rightArrow).unbind('click');	

	$(leftArrow).bind('click', prevPhotoTriggerClicked);	
	$(rightArrow).bind('click', nextPhotoTriggerClicked);	
	console.log("Set up arrow handlers.");
}

function showOverlay()
{
	var overlay = document.getElementById('overlay');
	overlay.removeClassName('hidden');
	// The "setTimeout" ensures that the initial style is rendered, and hence allows the transition to run.
	window.setTimeout(function() 
	{
		overlay.addClassName('visible');
		advanceThePhoto(function() {});
		
		// Scroll it into view on the iPhone.
		if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) 
		{
			window.scrollTo(0, 0);
		}
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

function advanceThePhoto(indexIncrementFunction)
{		
  	var contents = document.getElementById('theContainerContents');
  	contents.removeAllChildren();

	indexIncrementFunction();
 	var newElement = createElementForAssetAtIndex(gPhotoIndex);
	
  	contents.appendChild(newElement);
	// Center element within contents div.
	newElement.style.left = ((contents.offsetWidth - newElement.width)/2) + "px";
	
	var topNumber = ((contents.offsetHeight - newElement.height)/2);
	
	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) 
	{
		// Account for the nav bar.
		topNumber += 32;
	}
	
	newElement.style.top = topNumber + "px";		
}

function createElementForAssetAtIndex(assetIndex)
{
	if (assetIndex < 0 || assetIndex >= photoCount)
	{
 		return undefined;
	}

	var photoData = gPhotos[assetIndex];
	var mediaElement;
	if (photoData.filename.match(/[.jpg|.png|.gif]$/)) 
	{
    	// If the asset has an image extension, make an image element.
    	mediaElement = new Image();
    	// Register a load listener; when it fires, our handleEvent() method will get called.
    	//mediaElement.addEventListener('load', this, false);
    	mediaElement.src = "/jotunheim/img/" + photoData.filename;
		mediaElement.width = photoData.width;
		mediaElement.height = photoData.height;
		
		// Using jQuery so that the handler gets the event and can stop propagation.
		$(mediaElement).bind('click', nextPhotoTriggerClicked);
	} 

	return mediaElement;
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
	
	// Get ring animation going.
	setUpRingAnimation();
	
	setUpArrowHandlers();
}

function setUpForMobile()
{
  	var triggerElements = document.querySelectorAll('.overlayTrigger');
  	for (var i = 0; i < triggerElements.length; ++i) 
	{
    	var curElement = triggerElements[i];
    	curElement.addEventListener('click', triggerClicked.bind(this, curElement), false);
	}
	
	var overlay = document.getElementById('overlay');
	overlay.addEventListener('click', hideOverlay.bind(this, overlay), false);
	
	// Get ring animation going.
	setUpRingAnimation();
}

function triggerClicked()
{	
  // var galleryContainer = document.getElementById('gallery-container');
  // gGallery = new Gallery(galleryContainer);

	showOverlay();
	takeDownRingAnimationForever();
}

function nextPhotoTriggerClicked(event)
{
	console.log("nextPhotoTriggerClicked.");
	// event.stopPropagation();
	advanceThePhoto(incrementPhotoIndex);
	return false; // Equivalent to event.stopPropagation.
}

function prevPhotoTriggerClicked(event)
{
	advanceThePhoto(decrementPhotoIndex);
	return false; // Equivalent to event.stopPropagation.
}

// The preferred way to call a function when the page loads.
if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) 
{
	window.addEventListener('load', setUpForMobile, false);
}
else
{
	window.addEventListener('load', setUp, false);	
}
