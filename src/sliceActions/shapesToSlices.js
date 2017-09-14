import Shape from 'clipper-js';
import Slice from './helpers/Slice.js';

import { PRECISION } from '../constants.js';

export default function shapesToSlices(shapes, settings) {
  const sliceLayers = [];

  for (let layer = 0; layer < shapes.length; layer ++) {
    let { fillShapes, lineShapesOpen, lineShapesClosed } = shapes[layer];

    fillShapes = new Shape(fillShapes, true, true, true, true)
      .fixOrientation()
      .simplify('pftNonZero')
      .clean(1)
      .seperateShapes();

    lineShapesClosed = new Shape(lineShapesClosed, true, true, true, true)
      .clean(1);

    lineShapesOpen = new Shape(lineShapesOpen, false, true, true, true)
      .clean(1);

    const slice = new Slice();

    for (let i = 0; i < fillShapes.length; i ++) {
      const fillShape = fillShapes[i];
      slice.add(fillShape, true);

      // if (lineShapesClosed.paths.length > 0) {
      //   lineShapesClosed = lineShapesClosed.difference(closedShape);
      // }
      // if (lineShapesOpen.paths.length > 0) {
      //   lineShapesOpen = lineShapesOpen.difference(closedShape);
      // }
    }

    if (lineShapesClosed.paths.length > 0) {
      slice.add(lineShapesClosed, false);
    }

    if (lineShapesOpen.paths.length > 0) {
      slice.add(lineShapesOpen, false);
    }

    sliceLayers.push(slice);
  }

  return sliceLayers;
}
