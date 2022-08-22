const airportDomestic = [
  { value: 'Shanghai (PVG)' },
  { value: 'Shanghai (SHA)' },
  { value: 'Beijing (PEK)' },
  { value: 'Beijing (PKX)' },
  { value: 'Shenzhen (SZX)' },
  { value: 'Hangzhou (HGH)' },
  { value: 'Guangzhou (CAN)' },
  { value: 'Chongqing (CKG)' },
  { value: 'Chengdu (CTU)' },
  { value: "Xi'an (XIY)" },
  { value: 'Hohhot (HET)' },
  { value: 'Ningbo (NGB)' },
  { value: 'Zhengzhou (CGO)' },
]

const airportInternational = [
  { value: 'Hong Kong (HKG)' },
  { value: 'Macau (MFM)' },
  { value: 'Taipei (TPE)' },
  { value: 'New York (JFK)' },
  { value: 'Washington D.C. (IAD)' },
  { value: 'Tokyo (HND)' },
  { value: 'Tokyo (NRT)' },
  { value: 'Sydney (SYD)' },
  { value: 'London (LHR)' },
]

module.exports = {
  domestic: airportDomestic,
  international: airportInternational,
}
