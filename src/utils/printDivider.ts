import { replace } from 'lodash';

export default (text: string): void => {
  console.log(replace(text, /(\w|\.|\s|:|\/|\\|\(|\)|\-)/gi, '='));
};
