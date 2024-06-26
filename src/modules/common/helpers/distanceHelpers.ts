import { Geodesic } from 'geographiclib-geodesic';
import { DMS } from 'geographiclib-dms';


function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// Helper function to convert radians to degrees
function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

export function calculateDistance(coordinate1, coordinate2) {
  const earthRadiusKm = 6371; // Radius of the Earth in kilometers
  const { lat1, lon1 } = coordinate1;
  const { lat2, lon2 } = coordinate2;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = earthRadiusKm * c;

  return distanceKm * 1000;
}

export function calculateMinMaxCoordinates(centreCoordinate, distanceMetres) {
  const earthRadiusKm = 6371; // Radius of the Earth in kilometers
  const { centreLat, centreLon } = centreCoordinate;
  const distanceKm = distanceMetres / 1000;

  const angularDistance = distanceKm / earthRadiusKm;

  const centerLatRad = toRadians(centreLat);
  const centerLonRad = toRadians(centreLon);

  const minLat = centerLatRad - angularDistance;
  const maxLat = centerLatRad + angularDistance;

  const dLonAtCenterLat = Math.asin(
    Math.sin(angularDistance) / Math.cos(centerLatRad),
  );

  const minLon = centerLonRad - dLonAtCenterLat;
  const maxLon = centerLonRad + dLonAtCenterLat;

  const minLatDeg = toDegrees(minLat);
  const maxLatDeg = toDegrees(maxLat);
  const minLonDeg = toDegrees(minLon);
  const maxLonDeg = toDegrees(maxLon);

  return {
    minLatitude: minLatDeg,
    maxLatitude: maxLatDeg,
    minLongitude: minLonDeg,
    maxLongitude: maxLonDeg,
  };
}

export function calculateMinMaxCoordinates2(center, distance) {
  const geod = Geodesic.WGS84;
  const { latitude, longitude } = center;

  const distanceKm = distance / 1000;
  // Calculate bounding points
  const northPoint = geod.Direct(latitude, longitude, 0, distanceKm);
  const southPoint = geod.Direct(latitude, longitude, 180, distanceKm);
  const eastPoint = geod.Direct(latitude, longitude, 90, distanceKm);
  const westPoint = geod.Direct(latitude, longitude, 270, distanceKm);


  return {
    minLatitude2: southPoint.lat2,
    maxLatitude2: northPoint.lat2,
    minLongitude2: westPoint.lon2,
    maxLongitude2: eastPoint.lon2
  };
}
