import about from '../public/locales/en/about.json';
import aerialdronesasbuiltsurveys from '../public/locales/en/aerial-drones-as-built-surveys.json';
import aerialsurveys from '../public/locales/en/aerial-surveys.json';
import agriculturalndvimapping from '../public/locales/en/agricultural-ndvi-mapping.json';
import bathymetricsurveys from '../public/locales/en/bathymetric-surveys.json';
import buildingsitesurveys from '../public/locales/en/building-site-surveys.json';
import cadastralsurveys from '../public/locales/en/cadastral-surveys.json';
import civilasbuiltsurveys from '../public/locales/en/civil-as-built-surveys.json';
import civilbim from '../public/locales/en/civil-bim.json';
import civilhighwaysurveys from '../public/locales/en/civil-highway-surveys.json';
import civilsiteengineering from '../public/locales/en/civil-site-engineering.json';
import civilsitesettingout from '../public/locales/en/civil-site-setting-out.json';
import civilvolumetricsurveys from '../public/locales/en/civil-volumetric-surveys.json';
import common from '../public/locales/en/common.json';
import contact from '../public/locales/en/contact.json';
import droneimagerysurveys from '../public/locales/en/drone-imagery-surveys.json';
import foifa90rtkgnss from '../public/locales/en/foif-a90-rtk-gnss.json';
import gismapping from '../public/locales/en/gis-mapping.json';
import groundpenetratingradar from '../public/locales/en/ground-penetrating-radar.json';
import hiring from '../public/locales/en/hiring.json';
import home from '../public/locales/en/home.json';
import landfillquarrydronesurveys from '../public/locales/en/landfill-quarry-drone-surveys.json';
import lidarmapping from '../public/locales/en/lidar-mapping.json';
import meta from '../public/locales/en/meta.json';
import monitoringandevaluation from '../public/locales/en/monitoring-and-evaluation.json';
import photographyvideomarketing from '../public/locales/en/photography-video-marketing.json';
import resourcemapping from '../public/locales/en/resource-mapping.json';
import sectionalproperties from '../public/locales/en/sectional-properties.json';
import solarpaneldronesurveys from '../public/locales/en/solar-panel-drone-surveys.json';
import surveying from '../public/locales/en/surveying.json';
import terms from '../public/locales/en/terms.json';
import topographicalsurveys from '../public/locales/en/topographical-surveys.json';
import volumetricsurveys from '../public/locales/en/volumetric-surveys.json';
import automaticlevelbosch from '../public/locales/en/equipment-sale/automatic-level-bosch.json';
import automaticlevelhueper from '../public/locales/en/equipment-sale/automatic-level-hueper.json';
import equipmentcatalogue from '../public/locales/en/equipment-sale/equipment-catalogue.json';
import totalstationdtm152m from '../public/locales/en/equipment-sale/total-station-dtm-152m.json';
import totalstationesurvey from '../public/locales/en/equipment-sale/total-station-esurvey.json';

const resources = {
  about,
  'aerial-drones-as-built-surveys': aerialdronesasbuiltsurveys,
  'aerial-surveys': aerialsurveys,
  'agricultural-ndvi-mapping': agriculturalndvimapping,
  'bathymetric-surveys': bathymetricsurveys,
  'building-site-surveys': buildingsitesurveys,
  'cadastral-surveys': cadastralsurveys,
  'civil-as-built-surveys': civilasbuiltsurveys,
  'civil-bim': civilbim,
  'civil-highway-surveys': civilhighwaysurveys,
  'civil-site-engineering': civilsiteengineering,
  'civil-site-setting-out': civilsitesettingout,
  'civil-volumetric-surveys': civilvolumetricsurveys,
  common,
  contact,
  'drone-imagery-surveys': droneimagerysurveys,
  'foif-a90-rtk-gnss': foifa90rtkgnss,
  'gis-mapping': gismapping,
  'ground-penetrating-radar': groundpenetratingradar,
  hiring,
  home,
  'landfill-quarry-drone-surveys': landfillquarrydronesurveys,
  'lidar-mapping': lidarmapping,
  meta,
  'monitoring-and-evaluation': monitoringandevaluation,
  'photography-video-marketing': photographyvideomarketing,
  'resource-mapping': resourcemapping,
  'sectional-properties': sectionalproperties,
  'solar-panel-drone-surveys': solarpaneldronesurveys,
  surveying,
  terms,
  'topographical-surveys': topographicalsurveys,
  'volumetric-surveys': volumetricsurveys,
  'automatic-level-bosch': automaticlevelbosch,
  'automatic-level-hueper': automaticlevelhueper,
  'equipment-catalogue': equipmentcatalogue,
  'total-station-dtm-152m': totalstationdtm152m,
  'total-station-esurvey': totalstationesurvey
} as const;

export default resources;
