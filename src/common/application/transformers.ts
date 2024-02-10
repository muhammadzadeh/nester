import { useContainer } from 'class-validator';

export default (iocContainer: { get(someClass: unknown): unknown }): void => {
  useContainer(iocContainer, { fallbackOnErrors: true });
};
