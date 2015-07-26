# Doodle3D-Slicer
JavaScript gcode slicer, Intended to use with the Doodle3D WiFi-Box
# Usage

```javascript
import THREE from 'three.js';
import PRINTER_SETTINGS from 'settings/printer_settings.json!';
import USER_SETTINGS from 'settings/user_settings.json!';
import * as SLICER from 'Doodle3D/Doodle3d-Slicer';

var settings = new SLICER.Settings();
settings.updateConfig(PRINTER_SETTINGS['ultimaker2go']);
settings.updateConfig(USER_SETTINGS);

var geometry = new THREE.TorusGeometry(20, 10, 30, 30);

var slicer = new SLICER.Slicer();

slicer.setGeometry(geometry);
slicer.onfinish = function (gCode) {
	document.write(gCode.replace(/(?:\r\n|\r|\n)/g, '<br />'));
};
slicer.slice(settings);
```
