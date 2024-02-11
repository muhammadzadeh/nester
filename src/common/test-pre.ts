import { Chance } from 'chance';

export declare type ChanceType = Chance.Chance;

export const getSeed = (): string => {
  if (!process.env.CHANCE_SEED) {
    const seedGenerator = new Chance();
    process.env.CHANCE_SEED = seedGenerator.hash();
  }
  return process.env.CHANCE_SEED;
};

/**
 * @deprecated
 */
export const getChance = (seed?: string): ChanceType => {
  return new Chance(seed ?? getSeed());
};

/**
 * @deprecated
 */
export const chance: ChanceType = getChance();

const jestThing = (): void => {
  const seed = getSeed();
  // eslint-disable-next-line no-console
  console.log(`\nUsing Chance Seed: ${seed}`);
};

export default jestThing;
