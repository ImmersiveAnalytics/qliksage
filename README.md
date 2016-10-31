# Qlik app for SAGE2
This SAGE2 app enables Qlik analytics visualizations to be interacted with on large tiled display walls running the SAGE2 middleware.

## Requirements
- *Used in conjunction with [SAGE2](https://bitbucket.org/sage2/sage2/overview)*
- Currently hardcoded to connect to the public Happiness application on the Qlik pe.qlik.com server
- The processAndPassEvents function within SAGE2_MouseEventPassing.js requires the following additional code prior to the switch() to fix a problem with interacting with canvas elements
```
		var appname = null;
		var idx = appId.indexOf('app_');
		if (idx >= 0) {
			// extract the app_ part of the string
			appname = appId.slice(idx);
		}

		var appElem = document.getElementById(appname);

		var appLeftOffset = 0;
		if (appElem && appElem.style.left != null) {
			appLeftOffset = parseInt(appElem.style.left, 10);
		}
		var appTopOffset = 0;
		if (appElem && appElem.style.top != null) {
			appTopOffset = parseInt(appElem.style.top, 10);
		}
		var titleBarDiv = document.getElementById(appname + "_title");
		appTopOffset -= parseInt(titleBarDiv.style.height);

		point.xCanvas = xLocationOfPointerOnScreen + appLeftOffset;
		point.yCanvas = yLocationOfPointerOnScreen + appTopOffset;
```
Then use point.xCanvas & point.yCanvas in all of the MouseEvents rather than point.xCurrent/point.yCurrent. This requires further testing, but it seems to work.


## To Run
- Clone this repository into your SAGE2_Media/apps directory
- Run SAGE2 as normal
- Add Qlik app to SAGE2 via App Launcher
- Choose existing object, visualization, dimension or measure OR create a new chart by selecting your dimension(s), measure(s) and visualization type
