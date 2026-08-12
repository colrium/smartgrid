import buildingsitesurveys from '../public/locales/en/building-site-surveys.json';
import common from '../public/locales/en/common.json';
import contact from '../public/locales/en/contact.json';
import home from '../public/locales/en/home.json';
import meta from '../public/locales/en/meta.json';
import privacy from '../public/locales/en/privacy.json';
import surveying from '../public/locales/en/surveying.json';
import terms from '../public/locales/en/terms.json';
import topographicalsurveys from '../public/locales/en/topographical-surveys.json';

const resources = {
  'building-site-surveys': buildingsitesurveys,
  common,
  contact,
  home,
  meta,
  privacy,
  surveying,
  terms,
  'topographical-surveys': topographicalsurveys
} as const;

export default resources;
