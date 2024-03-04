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
  capital!: string;
  currency!: string;
  currencyName!: string;
  currencySymbol!: string;
  tld!: string;
  native!: string | null;
  region!: string;
  regionId!: number | null;
  subregion!: string;
  subregionId!: number | null;
  nationality!: string;
  timezones!: Timezone[];
  translations!: Translations;
  latitude!: number | null;
  longitude!: number | null;
  emoji!: string;
  emojiU!: string;
}
