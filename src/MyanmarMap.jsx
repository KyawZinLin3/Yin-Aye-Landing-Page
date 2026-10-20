import React, { useEffect, useState } from 'react';
import geoJsonUrl from './data/myanmar-adm1.geojson?url';

const MAP_HEIGHT = 680;
const MAP_AREA = { x: 12, y: 18, width: 405, height: 642 };

function walkCoordinates(value, visit) {
  if (Array.isArray(value) && typeof value[0] === 'number' && typeof value[1] === 'number') {
    visit(value);
    return;
  }
  if (Array.isArray(value)) value.forEach(child => walkCoordinates(child, visit));
}

function featureName(feature) {
  const properties = feature.properties || {};
  const sourceName = properties.shapeName || properties.NAME_1 || properties.name || properties.NAME || 'Region';
  const displayNames = { Saigang: 'Sagaing', Tanitharyi: 'Tanintharyi' };
  return displayNames[sourceName] || sourceName;
}

function featureType(feature) {
  const type = feature.properties?.shapeType || feature.properties?.TYPE_1 || '';
  const isoCode = feature.properties?.shapeISO || '';
  const adminCode = isoCode.split('-').pop();
  if (/^0[1-7]$/.test(adminCode) || String(type).toLowerCase().includes('region')) return 'Region';
  if (/^1[1-7]$/.test(adminCode) || String(type).toLowerCase().includes('state')) return 'State';
  return featureName(feature) === 'Nay Pyi Taw' ? 'Union Territory' : 'State or Region';
}

function prepareMap(data) {
  const features = data.features || [];
  const bounds = { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity };
  features.forEach(feature => walkCoordinates(feature.geometry?.coordinates, ([lon, lat]) => {
    bounds.minLon = Math.min(bounds.minLon, lon);
    bounds.maxLon = Math.max(bounds.maxLon, lon);
    bounds.minLat = Math.min(bounds.minLat, lat);
    bounds.maxLat = Math.max(bounds.maxLat, lat);
  }));

  const middleLatitude = ((bounds.minLat + bounds.maxLat) / 2) * Math.PI / 180;
  const longitudeScale = Math.cos(middleLatitude);
  const geographicWidth = (bounds.maxLon - bounds.minLon) * longitudeScale;
  const geographicHeight = bounds.maxLat - bounds.minLat;
  const scale = Math.min((MAP_AREA.width - 30) / geographicWidth, (MAP_AREA.height - 30) / geographicHeight);
  const drawnWidth = geographicWidth * scale;
  const drawnHeight = geographicHeight * scale;
  const offsetX = MAP_AREA.x + (MAP_AREA.width - drawnWidth) / 2;
  const offsetY = MAP_AREA.y + (MAP_AREA.height - drawnHeight) / 2;

  const project = ([lon, lat]) => [
    offsetX + (lon - bounds.minLon) * longitudeScale * scale,
    offsetY + (bounds.maxLat - lat) * scale,
  ];
  const ringPath = ring => {
    const points = ring.map(project);
    const simplified = [];
    const minSpacingSquared = 0.85 * 0.85;
    points.forEach((point, index) => {
      const last = simplified[simplified.length - 1];
      const isLast = index === points.length - 1;
      if (!last || isLast || (point[0] - last[0]) ** 2 + (point[1] - last[1]) ** 2 >= minSpacingSquared) {
        simplified.push(point);
      }
    });
    return simplified.map(([x, y], index) => {
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ') + ' Z';
  };

  const preparedFeatures = features.map(feature => {
    const polygons = feature.geometry?.type === 'Polygon'
      ? [feature.geometry.coordinates]
      : feature.geometry?.coordinates || [];
    return {
      feature,
      name: featureName(feature),
      type: featureType(feature),
      path: polygons.map(rings => rings.map(ringPath).join(' ')).join(' '),
    };
  });

  return { features: preparedFeatures, project };
}

export default function MyanmarMap() {
  const [mapData, setMapData] = useState(null);
  const [selectedName, setSelectedName] = useState('Yangon');
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(geoJsonUrl)
      .then(response => {
        if (!response.ok) throw new Error('Map data could not be loaded');
        return response.json();
      })
      .then(data => {
        if (active) setMapData(prepareMap(data));
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => { active = false; };
  }, []);

  const selected = mapData?.features.find(item => item.name === selectedName);
  const yangon = mapData?.features.find(item => item.name === 'Yangon');
  const yangonPoint = mapData?.project([96.17, 16.87]);

  return (
    <div className="service-map-layout">
      <div className="service-map-copy">
        <span className="service-map-kicker">Current service area</span>
        <h3>{selected ? `${selected.name}${selected.type === 'State or Region' ? '' : ` ${selected.type}`}` : 'Yangon Region'}</h3>
        <p aria-live="polite">
          {selectedName === 'Yangon'
            ? 'Yin Aye Finance currently serves customers in Yangon Region.'
            : `You selected ${selected?.name || selectedName}. Yangon Region is our currently listed service area; contact us to ask about service in other locations.`}
        </p>
        <a className="service-map-contact" href="/contact">Contact us <span aria-hidden="true">↗</span></a>
        <p className="service-map-hint">Select any state or region on the map to explore it.</p>
      </div>

      <figure className="myanmar-map-frame">
        {loadError ? (
          <div className="map-loading" role="status">The map is temporarily unavailable. Yangon Region is our currently listed service area.</div>
        ) : !mapData ? (
          <div className="map-loading" role="status">Loading Myanmar map…</div>
        ) : (
          <svg className="myanmar-map" viewBox={`0 0 460 ${MAP_HEIGHT}`} role="group" aria-label="Interactive map of Myanmar states and regions">
            <title>Interactive map of Myanmar. Yangon Region is highlighted.</title>
            <g className="map-shapes">
              {mapData.features.map(({ name, type, path }) => {
                const isYangon = name === 'Yangon';
                const isSelected = selectedName === name;
                return (
                  <path
                    key={name}
                    className={`map-region${isYangon ? ' map-region-yangon' : ''}${isSelected && !isYangon ? ' map-region-selected' : ''}`}
                    d={path}
                    fillRule="evenodd"
                    role="button"
                    tabIndex="0"
                    aria-label={`${name} ${type}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedName(name)}
                    onFocus={() => setSelectedName(name)}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedName(name);
                      }
                    }}
                  >
                    <title>{`${name} ${type}`}</title>
                  </path>
                );
              })}
            </g>
            {yangon && yangonPoint && (
              <g className="map-yangon-callout" aria-hidden="true">
                <circle cx={yangonPoint[0]} cy={yangonPoint[1]} r="4" />
                <path d={`M${yangonPoint[0]},${yangonPoint[1]} L${yangonPoint[0] + 44},${yangonPoint[1] - 36} L${yangonPoint[0] + 105},${yangonPoint[1] - 36}`} />
                <text x={yangonPoint[0] + 112} y={yangonPoint[1] - 39}>Yangon Region</text>
                <text className="map-callout-subtitle" x={yangonPoint[0] + 112} y={yangonPoint[1] - 22}>Our current service area</text>
              </g>
            )}
            {selected && selectedName !== 'Yangon' && (
              <text className="map-selection-label" x="20" y="670">Selected: {selected.name} {selected.type}</text>
            )}
          </svg>
        )}
        <figcaption>
          <span><i className="map-legend-dot" />Yangon Region</span>
          <a href="https://www.geoboundaries.org/" target="_blank" rel="noreferrer">Boundaries: Myanmar Analytics Project via geoBoundaries · CC BY 4.0</a>
        </figcaption>
      </figure>
    </div>
  );
}
