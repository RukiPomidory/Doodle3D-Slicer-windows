import GCode from './helpers/GCode.js';

const PROFILE_TYPES = ['brim', 'outerLine', 'innerLine', 'fill', 'support'];

export default function slicesToGCode(slices, settings) {
  const {
    layerHeight,
    filamentThickness,
    nozzleDiameter,
    travelSpeed,
    retraction,
    retractionEnabled
  } = settings;

  const filamentSurfaceArea = Math.pow((filamentThickness / 2), 2) * Math.PI;
  const lineSurfaceArea = nozzleDiameter * layerHeight;
  const nozzleToFilamentRatio = lineSurfaceArea / filamentSurfaceArea;

  const gcode = new GCode(nozzleToFilamentRatio);

  const defaultProfile = {
    travelProfile: {
      speed: travelSpeed
    },
    retractProfile: {
      ...retraction,
      enabled: retractionEnabled
    }
  };

  let isBottom = true;
  for (let layer = 0; layer < slices.length; layer ++) {
    const slice = slices[layer];
    const z = layer * layerHeight + 0.2;

    if (layer === 1) {
      gcode.turnFanOn();
      isBottom = false;
    }

    const profiles = PROFILE_TYPES.reduce((profiles, profileType) => {
      profiles[profileType] = {
        ...defaultProfile,
        lineProfile: isBottom ? settings.bottom : settings[profileType]
      }
      return profiles;
    }, {});

    if (typeof slice.brim !== 'undefined') {
      pathToGCode(gcode, slice.brim, true, true, z, profiles.brim);
    }

    for (let i = 0; i < slice.parts.length; i ++) {
      const part = slice.parts[i];

      if (part.shape.closed) {
        pathToGCode(gcode, part.outerLine, false, true, profiles.outerLine);

        for (let i = 0; i < part.innerLines.length; i ++) {
          const innerLine = part.innerLines[i];
          pathToGCode(gcode, innerLine, false, false, z, profiles.innerLine);
        }

        pathToGCode(gcode, part.fill, true, false, z, profiles.fill);
      } else {
        const retract = !(slice.parts.length === 1 && typeof slice.support === 'undefined');
        pathToGCode(gcode, part.shape, retract, retract, z, profiles.outerLine);
      }
    }

    if (typeof slice.support !== 'undefined') {
      pathToGCode(gcode, slice.support, true, true, z, profiles.support);
    }
  }

  return gcode.getGCode();
}

function pathToGCode(gcode, shape, retract, unRetract, z, { lineProfile, travelProfile, retractProfile }) {
  const { closed } = shape;
  const paths = shape.mapToLower();

  for (let i = 0; i < paths.length; i ++) {
    const line = paths[i];

    const length = closed ? (line.length + 1) : line.length;
    for (let i = 0; i < length; i ++) {
      const point = line[i % line.length];

      if (i === 0) {
        // TODO
        // moveTo should impliment combing
        gcode.moveTo(point.x, point.y, z, travelProfile);

        if (unRetract) {
          gcode.unRetract(retractProfile);
        }
      } else {
        gcode.lineTo(point.x, point.y, z, lineProfile);
      }
    }
  }

  if (retract) {
    gcode.retract(retractProfile);
  }
}
