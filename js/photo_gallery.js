// Depends on utlities.js.

function showOverlay()
{
  var overlay = document.getElementById('overlay');
  overlay.removeClassName('hidden');
  // The "setTimeout" ensures that the initial style is rendered, and hence allows the transition to run.
  window.setTimeout(function() {
    overlay.addClassName('visible');
  }, 0);
}

function setUpTouchables()
{
  	var triggerElements = document.querySelectorAll('.overlayTrigger');
  	for (var i = 0; i < triggerElements.length; ++i) 
	{
    	var curElement = triggerElements[i];
    	// ".bind()" calls Function.prototype.bind (in utilities.js); it's a convenient way to
    // hook up an event listener with 'this' as the target, inside a loop.
    	curElement.addEventListener('click', triggerClicked.bind(this, curElement), false);
	}
}

var gGallery;
function triggerClicked()
{
  if (gGallery)
    return;

  // var galleryContainer = document.getElementById('gallery-container');
  // gGallery = new Gallery(galleryContainer);

  showOverlay();
}


// The preferred way to call a function when the page loads.
window.addEventListener('load', setUpTouchables, false);
