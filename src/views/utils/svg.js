const svg = {}
svg.getScale = function () {
  return {
    COMPONENTS_SVG_SCALE: 50 / 1024,
    VIEWBOX_SCALE_INIT: 64 / 1024,
  };
}
svg.getSize = function () {
  return [1222, 1024];
}
export default svg