export class Timezone {
  zoneName!: string;
  gmtOffset!: number;
  gmtOffsetName!: string;
  abbreviation!: string;
  tzName!: string;
}

export class Translations {
  [key: string]: string;
}

export class CountryEntity {
  id!: string;
  name!: string;
  iso3!: string;
  iso2!: string;
  numericCode!: string;
  phoneCode!: string;
  currency!: string;
  currencyName!: string;
  currencySymbol!: string;
  native!: string | null;
  region!: string;
  subregion!: string;
  nationality!: string;
  timezones!: Timezone[];
  translations!: Translations;
  emoji!: string;
  emojiU!: string;
}
