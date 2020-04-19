import {FILTER_TITLES} from '../../src/consts';

const generateFilters = () => {
  return FILTER_TITLES.map((it) => {
    return {
      title: it,
      count: Math.floor(Math.random() * 10),
    };
  });
};

export default generateFilters;
