import Shape from 'Doodle3D/clipper-js';

export default class {
	constructor () {
		this.parts = [];
	}

	optimizePaths (start) {
		if (this.brim !== undefined && this.brim.length > 0) {
			this.brim = this.brim.optimizePath(start);
			start = this.brim.lastPoint();
		}

		var parts = [];

		while (this.parts.length > 0) {

			var closestDistance = Infinity;
			var closestPart;

			for (var i = 0; i < this.parts.length; i ++) {
				var part = this.parts[i];
				if (part.shape.closed) {
					var bounds = part.outerLine.bounds();
				}
				else {
					var bounds = part.shape.bounds();
				}

				var top = bounds.top - start.y;
				var bottom = start.y - bounds.bottom;
				var left = bounds.left - start.x;
				var right = start.x - bounds.right;

				var distance = Math.max(top, bottom, left, right);

				if (distance < closestDistance) {
					closestDistance = distance;
					closestPart = i;
				}
			}

			var part = this.parts.splice(closestPart, 1)[0];
			parts.push(part);

			if (part.shape.closed) {
				if (part.outerLine.length > 0) {
					part.outerLine = part.outerLine.optimizePath(start);
					start = part.outerLine.lastPoint();
				}

				for (var j = 0; j < part.innerLines.length; j ++) {
					var innerLine = part.innerLines[j];
					if (innerLine.length > 0) {
						part.innerLines[j] = innerLine.optimizePath(start);
						start = part.innerLines[j].lastPoint();
					}
				}

				if (part.fill.length > 0) {
					part.fill = part.fill.optimizePath(start);
					start = part.fill.lastPoint();
				}
			}
			else {
				part.shape.optimizePath(start);
				start = part.shape.lastPoint();
			}

		}

		this.parts = parts;

		if (this.support !== undefined && this.support.length > 0) {
			this.support = this.support.optimizePath(start);
			start = this.support.lastPoint();
		}

		return start;
	}

	getOutline () {
		var outLines = new Shape([], true);

		for (var i = 0; i < this.parts.length; i ++) {
			var part = this.parts[i];

			if (part.shape.closed) {
				outLines.join(this.parts[i].outerLine);
			}
		}

		return outLines;
	}

	add (shape) {
		const part = { shape };

		if (shape.closed) {
			part.innerLines = [];
			part.outerLine = new Shape([], true);
			part.fill = new Shape([], false);
		}

		this.parts.push(part);
	}
}
