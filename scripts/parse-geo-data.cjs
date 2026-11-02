/**
 * parse-geo-data.cjs
 * 
 * Парсер сырых данных геометок из data/ в оптимизированные файлы для Leaflet-карты.
 * 
 * Задачи:
 * 1. Валидирует и нормализует координаты (отсекает точки вне границ Беларуси).
 * 2. Сжимает точность координат до 6 знаков (точность ~10 см, экономит вес JSON).
 * 3. Форматирует HTTP image_url на HTTPS (защита от Mixed Content при работе карты).
 * 4. Назначает уникальный id и дефолтный бонус баллов за чекин (+50 Б).
 * 5. Рассчитывает точный Bounding Box (границы) и географический центр Беларуси для начального зума Leaflet.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../data');
const SIGHTS_RAW = path.join(DATA_DIR, 'belarus_sights.json');
const STATIONS_RAW = path.join(DATA_DIR, 'belorusneft_stations.json');

// Границы Беларуси с небольшим запасом
const BELARUS_BBOX = {
  minLat: 51.0,
  maxLat: 56.5,
  minLng: 23.0,
  maxLng: 33.0,
};

function isValidCoord(lat, lng) {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= BELARUS_BBOX.minLat &&
    lat <= BELARUS_BBOX.maxLat &&
    lng >= BELARUS_BBOX.minLng &&
    lng <= BELARUS_BBOX.maxLng
  );
}

function roundCoord(val) {
  return Math.round(val * 1000000) / 1000000;
}

function normalizeUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
}

function parseData() {
  console.log('🔄 Запуск парсинга гео-данных...');

  if (!fs.existsSync(SIGHTS_RAW) || !fs.existsSync(STATIONS_RAW)) {
    console.error('❌ Ошибка: Файлы данных не найдены в папке data/');
    process.exit(1);
  }

  const rawSights = JSON.parse(fs.readFileSync(SIGHTS_RAW, 'utf8'));
  const rawStations = JSON.parse(fs.readFileSync(STATIONS_RAW, 'utf8'));

  console.log(`📥 Прочитано сырых записей:`);
  console.log(`   - Достопримечательности: ${rawSights.length}`);
  console.log(`   - АЗС/ЭЗС Белоруснефть:  ${rawStations.length}`);

  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;

  // 1. Парсинг достопримечательностей
  const parsedSights = [];
  rawSights.forEach((item, index) => {
    const lat = item.latitude;
    const lng = item.longitude;

    if (!isValidCoord(lat, lng)) return;

    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);

    parsedSights.push({
      id: item.wikidata_id || `sight_${index}`,
      name: (item.name || 'Безымянный объект').trim(),
      category: (item.category || 'Достопримечательность').trim(),
      lat: roundCoord(lat),
      lng: roundCoord(lng),
      region: (item.region || '').trim(),
      desc: (item.description || '').trim(),
      image_url: normalizeUrl(item.image_url),
      wikipedia_url: normalizeUrl(item.wikipedia_url),
      bonus: 50, // Бонус за чекин по дизайн-контракту (+50 Б)
    });
  });

  // 2. Парсинг АЗС и ЭЗС «Белоруснефть»
  const parsedStations = [];
  rawStations.forEach((item, index) => {
    const lat = item.latitude;
    const lng = item.longitude;

    if (!isValidCoord(lat, lng)) return;

    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);

    parsedStations.push({
      id: `station_${item.osm_id || index}`,
      name: (item.name || 'Белоруснефть').trim(),
      station_number: item.station_number ? String(item.station_number).trim() : '',
      category: (item.category || 'АЗС').trim(),
      lat: roundCoord(lat),
      lng: roundCoord(lng),
      city: (item.city || '').trim(),
      address: (item.address || '').trim(),
      fuels: (item.fuels || '').trim(),
      operator: (item.operator || 'ПО «Белоруснефть»').trim(),
      is_electric: (item.category || '').toLowerCase().includes('эзс') || (item.category || '').toLowerCase().includes('заряд'),
    });
  });

  const summary = {
    totalSights: parsedSights.length,
    sightsWithImages: parsedSights.filter(s => !!s.image_url).length,
    totalStations: parsedStations.length,
    electricStations: parsedStations.filter(s => s.is_electric).length,
    bounds: {
      minLat: roundCoord(minLat),
      maxLat: roundCoord(maxLat),
      minLng: roundCoord(minLng),
      maxLng: roundCoord(maxLng),
      center: [roundCoord((minLat + maxLat) / 2), roundCoord((minLng + maxLng) / 2)],
    },
  };

  // Сохраняем спарсенные компактные структуры в data/
  const SIGHTS_PARSED_OUT = path.join(DATA_DIR, 'sights_parsed.json');
  const STATIONS_PARSED_OUT = path.join(DATA_DIR, 'stations_parsed.json');
  const META_OUT = path.join(DATA_DIR, 'geo_meta.json');

  fs.writeFileSync(SIGHTS_PARSED_OUT, JSON.stringify(parsedSights, null, 2), 'utf8');
  fs.writeFileSync(STATIONS_PARSED_OUT, JSON.stringify(parsedStations, null, 2), 'utf8');
  fs.writeFileSync(META_OUT, JSON.stringify(summary, null, 2), 'utf8');

  console.log('✅ Парсинг успешно завершён!');
  console.log(`📊 Итог:`);
  console.log(`   - Валидных достопримечательностей: ${summary.totalSights} (с фотографиями: ${summary.sightsWithImages})`);
  console.log(`   - Валидных АЗС/ЭЗС:               ${summary.totalStations} (из них ЭЗС: ${summary.electricStations})`);
  console.log(`   - Bounding Box: [${summary.bounds.minLat}, ${summary.bounds.minLng}] .. [${summary.bounds.maxLat}, ${summary.bounds.maxLng}]`);
  console.log(`   - Центр карты:  [${summary.bounds.center[0]}, ${summary.bounds.center[1]}]`);
  console.log(`📁 Файлы сохранены:`);
  console.log(`   - ${SIGHTS_PARSED_OUT}`);
  console.log(`   - ${STATIONS_PARSED_OUT}`);
  console.log(`   - ${META_OUT}`);
}

parseData();
