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
  id!: number;
  name!: string;
  iso3!: string;
  iso2!: string;
  numericCode!: string;
  phoneCode!: string;
  capital!: string;
  currency!: string;
  currencyName!: string;
  currencySymbol!: string;
  tld!: string;
  native!: string;
  region!: string;
  regionId!: string;
  subregion!: string;
  subregionId!: string;
  nationality!: string;
  timezones!: Timezone[];
  translations!: Translations;
  latitude!: string;
  longitude!: string;
  emoji!: string;
  emojiU!: string;
}
