import printDivider from './printDivider';

export default (message: string): void => {
  printDivider(message);
  console.log(message);
  printDivider(message);
};
