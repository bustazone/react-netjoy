interface MapLocaleDomain {
  [key: string]: string
}

export type ConfigurationsResponseDomainType = {
  allowedDomains: string[]
  ads_domains: string[]
  locales_map: MapLocaleDomain
}
