const { isPointInCircle } = require('geolib')

exports.getPointsInCircle = (points, center, radius) =>
  points.filter(point => isPointInCircle(point, center, radius))

exports.KILOMETER_TO_METER = 1000
exports.MILE_TO_METER = 1609.344
