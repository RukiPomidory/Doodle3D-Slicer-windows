import { sliceGeometry, sliceMesh } from './slicer.js';
import baseSettings from './settings/default.yml';
import printerSettings from './settings/printer.yml';
import materialSettings from './settings/material.yml';
import qualitySettings from './settings/quality.yml';

const defaultSettings = {
  base: baseSettings,
  printer: printerSettings,
  material: materialSettings,
  quality: qualitySettings
};

export {
  sliceGeometry,
  sliceMesh,
  defaultSettings
};
