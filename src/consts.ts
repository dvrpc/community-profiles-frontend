import { CategoryKeys } from "./types";

export const HEADER_HEIGHT = 172;
export const NAV_HEIGHT = 64;
export const REMAINING_VIEWPORT_HEIGHT_PROPERTY = `h-[calc(100vh-236px)]`;

export const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

export const categoryTitleMap: Record<CategoryKeys, string> = {
  "active-transportation": "Active Transportation",
  "demographics-housing": "Demographics & Housing",
  economy: "Economy",
  environment: "Environment",
  freight: "Freight",
  roadways: "Roadways",
  "safety-health": "Safety & Health",
  transit: "Transit",
};

export const CATEGORIES: CategoryKeys[] = [
  "demographics-housing",
  "economy",
  "active-transportation",
  "safety-health",
  "freight",
  "environment",
  "transit",
  "roadways",
];

export const countyInfoMap = {
  bucks: {
    geoid: 42017,
    label: "Bucks County",
  },
  burlington: {
    geoid: 34005,
    label: "Burlington County",
  },
  camden: {
    geoid: 34007,
    label: "Camden County",
  },
  chester: {
    geoid: 42029,
    label: "Chester County",
  },
  delaware: {
    geoid: 42045,
    label: "Delaware County",
  },
  gloucester: {
    geoid: 34015,
    label: "Gloucester County",
  },
  mercer: {
    geoid: 34021,
    label: "Mercer County",
  },
  montgomery: {
    geoid: 42091,
    label: "Montgomery County",
  },
  philadelphia: {
    geoid: 42101,
    label: "Philadelphia County",
  },
};

type MunicipalityInfo = {
  geoid: string;
  label: string;
};

type MunicipalityInfoMap = {
  [county: string]: {
    [municipality: string]: MunicipalityInfo;
  };
};

export const municipalityInfoMap: MunicipalityInfoMap = {
  bucks: {
    "ivyland-borough": { geoid: "4201737304", label: "Ivyland Borough" },
    "bristol-township": { geoid: "4201708768", label: "Bristol Township" },
    "langhorne-borough": {
      geoid: "4201741392",
      label: "Langhorne Borough",
    },
    "bensalem-township": {
      geoid: "4201705616",
      label: "Bensalem Township",
    },
    "perkasie-borough": { geoid: "4201759384", label: "Perkasie Borough" },
    "new-hope-borough": { geoid: "4201753712", label: "New Hope Borough" },
    "dublin-borough": { geoid: "4201720104", label: "Dublin Borough" },
    "nockamixon-township": {
      geoid: "4201754576",
      label: "Nockamixon Township",
    },
    "durham-township": { geoid: "4201720480", label: "Durham Township" },
    "richlandtown-borough": {
      geoid: "4201764584",
      label: "Richlandtown Borough",
    },
    "milford-township": { geoid: "4201749384", label: "Milford Township" },
    "silverdale-borough": {
      geoid: "4201770744",
      label: "Silverdale Borough",
    },
    "newtown-township": { geoid: "4201754192", label: "Newtown Township" },
    "tullytown-borough": {
      geoid: "4201777744",
      label: "Tullytown Borough",
    },
    "solebury-township": {
      geoid: "4201771752",
      label: "Solebury Township",
    },
    "telford-borough": { geoid: "4201776304", label: "Telford Borough" },
    "chalfont-borough": { geoid: "4201712504", label: "Chalfont Borough" },
    "middletown-township": {
      geoid: "4201749120",
      label: "Middletown Township",
    },
    "doylestown-borough": {
      geoid: "4201719784",
      label: "Doylestown Borough",
    },
    "lower-makefield-township": {
      geoid: "4201744968",
      label: "Lower Makefield Township",
    },
    "trumbauersville-borough": {
      geoid: "4201777704",
      label: "Trumbauersville Borough",
    },
    "wrightstown-township": {
      geoid: "4201786624",
      label: "Wrightstown Township",
    },
    "upper-southampton-township": {
      geoid: "4201779296",
      label: "Upper Southampton Township",
    },
    "warwick-township": { geoid: "4201781144", label: "Warwick Township" },
    "lower-southampton-township": {
      geoid: "4201745112",
      label: "Lower Southampton Township",
    },
    "east-rockhill-township": {
      geoid: "4201721760",
      label: "East Rockhill Township",
    },
    "sellersville-borough": {
      geoid: "4201769248",
      label: "Sellersville Borough",
    },
    "upper-makefield-township": {
      geoid: "4201779128",
      label: "Upper Makefield Township",
    },
    "hilltown-township": {
      geoid: "4201734952",
      label: "Hilltown Township",
    },
    "plumstead-township": {
      geoid: "4201761616",
      label: "Plumstead Township",
    },
    "bristol-borough": { geoid: "4201708760", label: "Bristol Borough" },
    "haycock-township": { geoid: "4201733224", label: "Haycock Township" },
    "new-britain-township": {
      geoid: "4201753304",
      label: "New Britain Township",
    },
    "penndel-borough": { geoid: "4201758936", label: "Penndel Borough" },
    "bedminster-township": {
      geoid: "4201704976",
      label: "Bedminster Township",
    },
    "springfield-township": {
      geoid: "4201773016",
      label: "Springfield Township",
    },
    "buckingham-township": {
      geoid: "4201709816",
      label: "Buckingham Township",
    },
    "morrisville-borough": {
      geoid: "4201751144",
      label: "Morrisville Borough",
    },
    "riegelsville-borough": {
      geoid: "4201764856",
      label: "Riegelsville Borough",
    },
    "northampton-township": {
      geoid: "4201754688",
      label: "Northampton Township",
    },
    "langhorne-manor-borough": {
      geoid: "4201741416",
      label: "Langhorne Manor Borough",
    },
    "newtown-borough": { geoid: "4201754184", label: "Newtown Borough" },
    "yardley-borough": { geoid: "4201786920", label: "Yardley Borough" },
    "new-britain-borough": {
      geoid: "4201753296",
      label: "New Britain Borough",
    },
    "bridgeton-township": {
      geoid: "4201708592",
      label: "Bridgeton Township",
    },
    "west-rockhill-township": {
      geoid: "4201783960",
      label: "West Rockhill Township",
    },
    "hulmeville-borough": {
      geoid: "4201736192",
      label: "Hulmeville Borough",
    },
    "warminster-township": {
      geoid: "4201780952",
      label: "Warminster Township",
    },
    "tinicum-township": { geoid: "4201776784", label: "Tinicum Township" },
    "richland-township": {
      geoid: "4201764536",
      label: "Richland Township",
    },
    "doylestown-township": {
      geoid: "4201719792",
      label: "Doylestown Township",
    },
    "warrington-township": {
      geoid: "4201781048",
      label: "Warrington Township",
    },
    "falls-township": { geoid: "4201725112", label: "Falls Township" },
    "quakertown-borough": {
      geoid: "4201763048",
      label: "Quakertown Borough",
    },
  },
  burlington: {
    "evesham-township": { geoid: "3400522110", label: "Evesham Township" },
    "burlington-city": { geoid: "3400508920", label: "Burlington City" },
    "riverside-township": {
      geoid: "3400563510",
      label: "Riverside Township",
    },
    "springfield-township": {
      geoid: "3400569990",
      label: "Springfield Township",
    },
    "moorestown-township": {
      geoid: "3400547880",
      label: "Moorestown Township",
    },
    "palmyra-borough": { geoid: "3400555800", label: "Palmyra Borough" },
    "mount-laurel-township": {
      geoid: "3400549020",
      label: "Mount Laurel Township",
    },
    "lumberton-township": {
      geoid: "3400542060",
      label: "Lumberton Township",
    },
    "delran-township": { geoid: "3400517440", label: "Delran Township" },
    "willingboro-township": {
      geoid: "3400581440",
      label: "Willingboro Township",
    },
    "woodland-township": {
      geoid: "3400582420",
      label: "Woodland Township",
    },
    "edgewater-park-township": {
      geoid: "3400520050",
      label: "Edgewater Park Township",
    },
    "washington-township": {
      geoid: "3400577150",
      label: "Washington Township",
    },
    "tabernacle-township": {
      geoid: "3400572060",
      label: "Tabernacle Township",
    },
    "pemberton-borough": {
      geoid: "3400557480",
      label: "Pemberton Borough",
    },
    "mount-holly-township": {
      geoid: "3400548900",
      label: "Mount Holly Township",
    },
    "medford-township": { geoid: "3400545120", label: "Medford Township" },
    "bordentown-city": { geoid: "3400506670", label: "Bordentown City" },
    "bordentown-township": {
      geoid: "3400506700",
      label: "Bordentown Township",
    },
    "new-hanover-township": {
      geoid: "3400551510",
      label: "New Hanover Township",
    },
    "riverton-borough": { geoid: "3400563660", label: "Riverton Borough" },
    "chesterfield-township": {
      geoid: "3400512670",
      label: "Chesterfield Township",
    },
    "shamong-township": { geoid: "3400566810", label: "Shamong Township" },
    "fieldsboro-borough": {
      geoid: "3400523250",
      label: "Fieldsboro Borough",
    },
    "florence-township": {
      geoid: "3400523850",
      label: "Florence Township",
    },
    "hainesport-township": {
      geoid: "3400529010",
      label: "Hainesport Township",
    },
    "cinnaminson-township": {
      geoid: "3400512940",
      label: "Cinnaminson Township",
    },
    "medford-lakes-borough": {
      geoid: "3400545210",
      label: "Medford Lakes Borough",
    },
    "wrightstown-borough": {
      geoid: "3400582960",
      label: "Wrightstown Borough",
    },
    "mansfield-township": {
      geoid: "3400543290",
      label: "Mansfield Township",
    },
    "pemberton-township": {
      geoid: "3400557510",
      label: "Pemberton Township",
    },
    "eastampton-township": {
      geoid: "3400518790",
      label: "Eastampton Township",
    },
    "southampton-township": {
      geoid: "3400568610",
      label: "Southampton Township",
    },
    "beverly-city": { geoid: "3400505740", label: "Beverly City" },
    "maple-shade-township": {
      geoid: "3400543740",
      label: "Maple Shade Township",
    },
    "burlington-township": {
      geoid: "3400508950",
      label: "Burlington Township",
    },
    "westampton-township": {
      geoid: "3400578200",
      label: "Westampton Township",
    },
    "delanco-township": { geoid: "3400517080", label: "Delanco Township" },
    "bass-river-township": {
      geoid: "3400503370",
      label: "Bass River Township",
    },
    "north-hanover-township": {
      geoid: "3400553070",
      label: "North Hanover Township",
    },
  },
  camden: {
    "pine-hill-borough": {
      geoid: "3400758770",
      label: "Pine Hill Borough",
    },
    "gloucester-township": {
      geoid: "3400726760",
      label: "Gloucester Township",
    },
    "berlin-township": { geoid: "3400705470", label: "Berlin Township" },
    "lindenwold-borough": {
      geoid: "3400740440",
      label: "Lindenwold Borough",
    },
    "gloucester-city": { geoid: "3400726820", label: "Gloucester City" },
    "gibbsboro-borough": {
      geoid: "3400726070",
      label: "Gibbsboro Borough",
    },
    "tavistock-borough": {
      geoid: "3400772240",
      label: "Tavistock Borough",
    },
    "haddon-township": { geoid: "3400728740", label: "Haddon Township" },
    "runnemede-borough": {
      geoid: "3400765160",
      label: "Runnemede Borough",
    },
    "collingswood-borough": {
      geoid: "3400714260",
      label: "Collingswood Borough",
    },
    "brooklawn-borough": {
      geoid: "3400708170",
      label: "Brooklawn Borough",
    },
    "audubon-borough": { geoid: "3400702200", label: "Audubon Borough" },
    "bellmawr-borough": { geoid: "3400704750", label: "Bellmawr Borough" },
    "stratford-borough": {
      geoid: "3400771220",
      label: "Stratford Borough",
    },
    "haddonfield-borough": {
      geoid: "3400728770",
      label: "Haddonfield Borough",
    },
    "winslow-township": { geoid: "3400781740", label: "Winslow Township" },
    "hi-nella-borough": { geoid: "3400732220", label: "Hi-Nella Borough" },
    "audubon-park-borough": {
      geoid: "3400702230",
      label: "Audubon Park Borough",
    },
    "mount-ephraim-borough": {
      geoid: "3400748750",
      label: "Mount Ephraim Borough",
    },
    "lawnside-borough": { geoid: "3400739420", label: "Lawnside Borough" },
    "laurel-springs-borough": {
      geoid: "3400739210",
      label: "Laurel Springs Borough",
    },
    "somerdale-borough": {
      geoid: "3400768340",
      label: "Somerdale Borough",
    },
    "berlin-borough": { geoid: "3400705440", label: "Berlin Borough" },
    "merchantville-borough": {
      geoid: "3400745510",
      label: "Merchantville Borough",
    },
    "camden-city": { geoid: "3400710000", label: "Camden City" },
    "clementon-borough": {
      geoid: "3400713420",
      label: "Clementon Borough",
    },
    "haddon-heights-borough": {
      geoid: "3400728800",
      label: "Haddon Heights Borough",
    },
    "pennsauken-township": {
      geoid: "3400757660",
      label: "Pennsauken Township",
    },
    "barrington-borough": {
      geoid: "3400703250",
      label: "Barrington Borough",
    },
    "woodlynne-borough": {
      geoid: "3400782450",
      label: "Woodlynne Borough",
    },
    "chesilhurst-borough": {
      geoid: "3400712550",
      label: "Chesilhurst Borough",
    },
    "cherry-hill-township": {
      geoid: "3400712280",
      label: "Cherry Hill Township",
    },
    "magnolia-borough": { geoid: "3400742630", label: "Magnolia Borough" },
    "waterford-township": {
      geoid: "3400777630",
      label: "Waterford Township",
    },
    "oaklyn-borough": { geoid: "3400753880", label: "Oaklyn Borough" },
    "voorhees-township": { geoid: "3400776220", label: "Voorhees Township" },
  },
  chester: {
    "spring-city-borough": {
      geoid: "4202972920",
      label: "Spring City Borough",
    },
    "west-bradford-township": {
      geoid: "4202982544",
      label: "West Bradford Township",
    },
    "west-grove-borough": {
      geoid: "4202983104",
      label: "West Grove Borough",
    },
    "east-bradford-township": {
      geoid: "4202920824",
      label: "East Bradford Township",
    },
    "east-caln-township": {
      geoid: "4202920920",
      label: "East Caln Township",
    },
    "west-marlborough-township": {
      geoid: "4202983464",
      label: "West Marlborough Township",
    },
    "east-brandywine-township": {
      geoid: "4202920864",
      label: "East Brandywine Township",
    },
    "london-britain-township": {
      geoid: "4202944440",
      label: "London Britain Township",
    },
    "birmingham-township": {
      geoid: "4202906544",
      label: "Birmingham Township",
    },
    "north-coventry-township": {
      geoid: "4202954936",
      label: "North Coventry Township",
    },
    "uwchlan-township": { geoid: "4202979480", label: "Uwchlan Township" },
    "honey-brook-township": {
      geoid: "4202935536",
      label: "Honey Brook Township",
    },
    "kennett-square-borough": {
      geoid: "4202939352",
      label: "Kennett Square Borough",
    },
    "west-caln-township": {
      geoid: "4202982664",
      label: "West Caln Township",
    },
    "west-chester-borough": {
      geoid: "4202982704",
      label: "West Chester Borough",
    },
    "east-nottingham-township": {
      geoid: "4202921624",
      label: "East Nottingham Township",
    },
    "easttown-township": {
      geoid: "4202921928",
      label: "Easttown Township",
    },
    "east-marlborough-township": {
      geoid: "4202921480",
      label: "East Marlborough Township",
    },
    "west-fallowfield-township": {
      geoid: "4202982936",
      label: "West Fallowfield Township",
    },
    "london-grove-township": {
      geoid: "4202944480",
      label: "London Grove Township",
    },
    "new-london-township": {
      geoid: "4202953816",
      label: "New London Township",
    },
    "downingtown-borough": {
      geoid: "4202919752",
      label: "Downingtown Borough",
    },
    "upper-uwchlan-township": {
      geoid: "4202979352",
      label: "Upper Uwchlan Township",
    },
    "coatesville-city": { geoid: "4202914712", label: "Coatesville City" },
    "west-goshen-township": {
      geoid: "4202983080",
      label: "West Goshen Township",
    },
    "upper-oxford-township": {
      geoid: "4202979208",
      label: "Upper Oxford Township",
    },
    "west-brandywine-township": {
      geoid: "4202982576",
      label: "West Brandywine Township",
    },
    "west-nantmeal-township": {
      geoid: "4202983664",
      label: "West Nantmeal Township",
    },
    "malvern-borough": { geoid: "4202946792", label: "Malvern Borough" },
    "newlin-township": { geoid: "4202953784", label: "Newlin Township" },
    "thornbury-township": {
      geoid: "4202976568",
      label: "Thornbury Township",
    },
    "parkesburg-borough": {
      geoid: "4202958032",
      label: "Parkesburg Borough",
    },
    "sadsbury-township": {
      geoid: "4202967080",
      label: "Sadsbury Township",
    },
    "highland-township": {
      geoid: "4202934448",
      label: "Highland Township",
    },
    "modena-borough": { geoid: "4202950232", label: "Modena Borough" },
    "new-garden-township": {
      geoid: "4202953608",
      label: "New Garden Township",
    },
    "west-sadsbury-township": {
      geoid: "4202983968",
      label: "West Sadsbury Township",
    },
    "penn-township": { geoid: "4202958808", label: "Penn Township" },
    "east-whiteland-township": {
      geoid: "4202922056",
      label: "East Whiteland Township",
    },
    "west-nottingham-township": {
      geoid: "4202983712",
      label: "West Nottingham Township",
    },
    "avondale-borough": { geoid: "4202903656", label: "Avondale Borough" },
    "east-goshen-township": {
      geoid: "4202921192",
      label: "East Goshen Township",
    },
    "phoenixville-borough": {
      geoid: "4202960120",
      label: "Phoenixville Borough",
    },
    "atglen-borough": { geoid: "4202903384", label: "Atglen Borough" },
    "warwick-township": { geoid: "4202981160", label: "Warwick Township" },
    "honey-brook-borough": {
      geoid: "4202935528",
      label: "Honey Brook Borough",
    },
    "east-coventry-township": {
      geoid: "4202921008",
      label: "East Coventry Township",
    },
    "south-coventry-township": {
      geoid: "4202972088",
      label: "South Coventry Township",
    },
    "elk-township": { geoid: "4202923032", label: "Elk Township" },
    "westtown-township": {
      geoid: "4202984104",
      label: "Westtown Township",
    },
    "lower-oxford-township": {
      geoid: "4202945040",
      label: "Lower Oxford Township",
    },
    "schuylkill-township": {
      geoid: "4202968288",
      label: "Schuylkill Township",
    },
    "caln-township": { geoid: "4202910824", label: "Caln Township" },
    "west-whiteland-township": {
      geoid: "4202984192",
      label: "West Whiteland Township",
    },
    "west-pikeland-township": {
      geoid: "4202983832",
      label: "West Pikeland Township",
    },
    "oxford-borough": { geoid: "4202957480", label: "Oxford Borough" },
    "pennsbury-township": {
      geoid: "4202959136",
      label: "Pennsbury Township",
    },
    "elverson-borough": { geoid: "4202923440", label: "Elverson Borough" },
    "west-vincent-township": {
      geoid: "4202984160",
      label: "West Vincent Township",
    },
    "south-coatesville-borough": {
      geoid: "4202972072",
      label: "South Coatesville Borough",
    },
    "east-vincent-township": {
      geoid: "4202922000",
      label: "East Vincent Township",
    },
    "franklin-township": {
      geoid: "4202927376",
      label: "Franklin Township",
    },
    "tredyffrin-township": {
      geoid: "4202977344",
      label: "Tredyffrin Township",
    },
    "kennett-township": { geoid: "4202939344", label: "Kennett Township" },
    "east-fallowfield-township": {
      geoid: "4202921104",
      label: "East Fallowfield Township",
    },
    "pocopson-township": {
      geoid: "4202961800",
      label: "Pocopson Township",
    },
    "valley-township": { geoid: "4202979544", label: "Valley Township" },
    "east-nantmeal-township": {
      geoid: "4202921576",
      label: "East Nantmeal Township",
    },
    "londonderry-township": {
      geoid: "4202944456",
      label: "Londonderry Township",
    },
    "wallace-township": { geoid: "4202980616", label: "Wallace Township" },
    "east-pikeland-township": {
      geoid: "4202921696",
      label: "East Pikeland Township",
    },
    "charlestown-township": {
      geoid: "4202912744",
      label: "Charlestown Township",
    },
    "willistown-township": {
      geoid: "4202985352",
      label: "Willistown Township",
    },
  },
  delaware: {
    "yeadon-borough": { geoid: "4204586968", label: "Yeadon Borough" },
    "darby-borough": { geoid: "4204518152", label: "Darby Borough" },
    "folcroft-borough": { geoid: "4204526408", label: "Folcroft Borough" },
    "ridley-park-borough": {
      geoid: "4204564832",
      label: "Ridley Park Borough",
    },
    "upper-providence-township": {
      geoid: "4204579248",
      label: "Upper Providence Township",
    },
    "darby-township": { geoid: "4204518160", label: "Darby Township" },
    "media-borough": { geoid: "4204548480", label: "Media Borough" },
    "glenolden-borough": {
      geoid: "4204529720",
      label: "Glenolden Borough",
    },
    "eddystone-borough": {
      geoid: "4204522296",
      label: "Eddystone Borough",
    },
    "marple-township": { geoid: "4204547616", label: "Marple Township" },
    "clifton-heights-borough": {
      geoid: "4204514264",
      label: "Clifton Heights Borough",
    },
    "upland-borough": { geoid: "4204578712", label: "Upland Borough" },
    "chester-township": { geoid: "4204513212", label: "Chester Township" },
    "thornbury-township": {
      geoid: "4204576576",
      label: "Thornbury Township",
    },
    "concord-township": { geoid: "4204515488", label: "Concord Township" },
    "sharon-hill-borough": {
      geoid: "4204569752",
      label: "Sharon Hill Borough",
    },
    "haverford-township": {
      geoid: "4204533144",
      label: "Haverford Township",
    },
    "swarthmore-borough": {
      geoid: "4204575648",
      label: "Swarthmore Borough",
    },
    "tinicum-township": { geoid: "4204576792", label: "Tinicum Township" },
    "rutledge-borough": { geoid: "4204566928", label: "Rutledge Borough" },
    "bethel-township": { geoid: "4204506024", label: "Bethel Township" },
    "rose-valley-borough": {
      geoid: "4204566192",
      label: "Rose Valley Borough",
    },
    "nether-providence-township": {
      geoid: "4204553104",
      label: "Nether Providence Township",
    },
    "chester-heights-borough": {
      geoid: "4204513232",
      label: "Chester Heights Borough",
    },
    "prospect-park-borough": {
      geoid: "4204562792",
      label: "Prospect Park Borough",
    },
    "lansdowne-borough": {
      geoid: "4204541440",
      label: "Lansdowne Borough",
    },
    "trainer-borough": { geoid: "4204577288", label: "Trainer Borough" },
    "collingdale-borough": {
      geoid: "4204515232",
      label: "Collingdale Borough",
    },
    "aston-township": { geoid: "4204503336", label: "Aston Township" },
    "ridley-township": { geoid: "4204564800", label: "Ridley Township" },
    "chester-city": { geoid: "4204513208", label: "Chester City" },
    "upper-darby-township": {
      geoid: "4204579000",
      label: "Upper Darby Township",
    },
    "newtown-township": { geoid: "4204554224", label: "Newtown Township" },
    "norwood-borough": { geoid: "4204555664", label: "Norwood Borough" },
    "upper-chichester-township": {
      geoid: "4204578776",
      label: "Upper Chichester Township",
    },
    "aldan-borough": { geoid: "4204500676", label: "Aldan Borough" },
    "middletown-township": {
      geoid: "4204549136",
      label: "Middletown Township",
    },
    "springfield-township": {
      geoid: "4204573032",
      label: "Springfield Township",
    },
    "morton-borough": { geoid: "4204551176", label: "Morton Borough" },
    "lower-chichester-township": {
      geoid: "4204544888",
      label: "Lower Chichester Township",
    },
    "chadds-ford-township": {
      geoid: "4204512442",
      label: "Chadds Ford Township",
    },
    "parkside-borough": { geoid: "4204558176", label: "Parkside Borough" },
    "radnor-township": { geoid: "4204563264", label: "Radnor Township" },
    "east-lansdowne-borough": {
      geoid: "4204521384",
      label: "East Lansdowne Borough",
    },
    "edgmont-township": { geoid: "4204522584", label: "Edgmont Township" },
    "marcus-hook-borough": {
      geoid: "4204547344",
      label: "Marcus Hook Borough",
    },
    "brookhaven-borough": {
      geoid: "4204509080",
      label: "Brookhaven Borough",
    },
    "millbourne-borough": {
      geoid: "4204549504",
      label: "Millbourne Borough",
    },
    "colwyn-borough": { geoid: "4204515432", label: "Colwyn Borough" },
  },
  gloucester: {
    "east-greenwich-township": {
      geoid: "3401519180",
      label: "East Greenwich Township",
    },
    "newfield-borough": { geoid: "3401551390", label: "Newfield Borough" },
    "harrison-township": {
      geoid: "3401530180",
      label: "Harrison Township",
    },
    "mantua-township": { geoid: "3401543440", label: "Mantua Township" },
    "south-harrison-township": {
      geoid: "3401569030",
      label: "South Harrison Township",
    },
    "glassboro-borough": {
      geoid: "3401526340",
      label: "Glassboro Borough",
    },
    "wenonah-borough": { geoid: "3401578110", label: "Wenonah Borough" },
    "westville-borough": {
      geoid: "3401580120",
      label: "Westville Borough",
    },
    "woodbury-heights-borough": {
      geoid: "3401582180",
      label: "Woodbury Heights Borough",
    },
    "pitman-borough": { geoid: "3401559070", label: "Pitman Borough" },
    "paulsboro-borough": {
      geoid: "3401557150",
      label: "Paulsboro Borough",
    },
    "swedesboro-borough": {
      geoid: "3401571850",
      label: "Swedesboro Borough",
    },
    "west-deptford-township": {
      geoid: "3401578800",
      label: "West Deptford Township",
    },
    "monroe-township": { geoid: "3401547250", label: "Monroe Township" },
    "logan-township": { geoid: "3401541160", label: "Logan Township" },
    "clayton-borough": { geoid: "3401513360", label: "Clayton Borough" },
    "deptford-township": {
      geoid: "3401517710",
      label: "Deptford Township",
    },
    "greenwich-township": {
      geoid: "3401528185",
      label: "Greenwich Township",
    },
    "franklin-township": {
      geoid: "3401524840",
      label: "Franklin Township",
    },
    "woodbury-city": { geoid: "3401582120", label: "Woodbury City" },
    "washington-township": {
      geoid: "3401577180",
      label: "Washington Township",
    },
    "elk-township": { geoid: "3401521060", label: "Elk Township" },
    "national-park-borough": {
      geoid: "3401549680",
      label: "National Park Borough",
    },
    "woolwich-township": { geoid: "3401582840", label: "Woolwich Township" },
  },
  mercer: {
    "hopewell-township": {
      geoid: "3402133180",
      label: "Hopewell Township",
    },
    "ewing-township": { geoid: "3402122185", label: "Ewing Township" },
    "robbinsville-township": {
      geoid: "3402163850",
      label: "Robbinsville Township",
    },
    "hopewell-borough": { geoid: "3402133150", label: "Hopewell Borough" },
    "east-windsor-township": {
      geoid: "3402119780",
      label: "East Windsor Township",
    },
    princeton: { geoid: "3402160900", label: "Princeton" },
    "west-windsor-township": {
      geoid: "3402180240",
      label: "West Windsor Township",
    },
    "hightstown-borough": {
      geoid: "3402131620",
      label: "Hightstown Borough",
    },
    "hamilton-township": {
      geoid: "3402129310",
      label: "Hamilton Township",
    },
    "trenton-city": { geoid: "3402174000", label: "Trenton City" },
    "lawrence-township": {
      geoid: "3402139510",
      label: "Lawrence Township",
    },
    "pennington-borough": {
      geoid: "3402157600",
      label: "Pennington Borough",
    },
  },
  montgomery: {
    "horsham-township": { geoid: "4209135808", label: "Horsham Township" },
    "lower-salford-township": {
      geoid: "4209145096",
      label: "Lower Salford Township",
    },
    "lower-pottsgrove-township": {
      geoid: "4209145072",
      label: "Lower Pottsgrove Township",
    },
    "salford-township": { geoid: "4209167528", label: "Salford Township" },
    "upper-pottsgrove-township": {
      geoid: "4209179240",
      label: "Upper Pottsgrove Township",
    },
    "lower-moreland-township": {
      geoid: "4209145008",
      label: "Lower Moreland Township",
    },
    "north-wales-borough": {
      geoid: "4209155512",
      label: "North Wales Borough",
    },
    "upper-gwynedd-township": {
      geoid: "4209179056",
      label: "Upper Gwynedd Township",
    },
    "perkiomen-township": {
      geoid: "4209159392",
      label: "Perkiomen Township",
    },
    "west-pottsgrove-township": {
      geoid: "4209183912",
      label: "West Pottsgrove Township",
    },
    "narberth-borough": { geoid: "4209152664", label: "Narberth Borough" },
    "pennsburg-borough": {
      geoid: "4209159120",
      label: "Pennsburg Borough",
    },
    "marlborough-township": {
      geoid: "4209147592",
      label: "Marlborough Township",
    },
    "lower-frederick-township": {
      geoid: "4209144912",
      label: "Lower Frederick Township",
    },
    "royersford-borough": {
      geoid: "4209166576",
      label: "Royersford Borough",
    },
    "trappe-borough": { geoid: "4209177304", label: "Trappe Borough" },
    "ambler-borough": { geoid: "4209102264", label: "Ambler Borough" },
    "upper-dublin-township": {
      geoid: "4209179008",
      label: "Upper Dublin Township",
    },
    "lower-gwynedd-township": {
      geoid: "4209144920",
      label: "Lower Gwynedd Township",
    },
    "montgomery-township": {
      geoid: "4209150640",
      label: "Montgomery Township",
    },
    "jenkintown-borough": {
      geoid: "4209138000",
      label: "Jenkintown Borough",
    },
    "pottstown-borough": {
      geoid: "4209162416",
      label: "Pottstown Borough",
    },
    "east-norriton-township": {
      geoid: "4209121600",
      label: "East Norriton Township",
    },
    "plymouth-township": {
      geoid: "4209161664",
      label: "Plymouth Township",
    },
    "collegeville-borough": {
      geoid: "4209115192",
      label: "Collegeville Borough",
    },
    "towamencin-township": {
      geoid: "4209177152",
      label: "Towamencin Township",
    },
    "green-lane-borough": {
      geoid: "4209131088",
      label: "Green Lane Borough",
    },
    "upper-providence-township": {
      geoid: "4209179256",
      label: "Upper Providence Township",
    },
    "worcester-township": {
      geoid: "4209186496",
      label: "Worcester Township",
    },
    "schwenksville-borough": {
      geoid: "4209168328",
      label: "Schwenksville Borough",
    },
    "west-norriton-township": {
      geoid: "4209183696",
      label: "West Norriton Township",
    },
    "west-conshohocken-borough": {
      geoid: "4209182736",
      label: "West Conshohocken Borough",
    },
    "conshohocken-borough": {
      geoid: "4209115848",
      label: "Conshohocken Borough",
    },
    "hatboro-borough": { geoid: "4209133088", label: "Hatboro Borough" },
    "hatfield-township": {
      geoid: "4209133120",
      label: "Hatfield Township",
    },
    "souderton-borough": {
      geoid: "4209171856",
      label: "Souderton Borough",
    },
    "telford-borough": { geoid: "4209176304", label: "Telford Borough" },
    "franconia-township": {
      geoid: "4209127280",
      label: "Franconia Township",
    },
    "rockledge-borough": {
      geoid: "4209165568",
      label: "Rockledge Borough",
    },
    "hatfield-borough": { geoid: "4209133112", label: "Hatfield Borough" },
    "lower-merion-township": {
      geoid: "4209144976",
      label: "Lower Merion Township",
    },
    "springfield-township": {
      geoid: "4209173088",
      label: "Springfield Township",
    },
    "cheltenham-township": {
      geoid: "4209112968",
      label: "Cheltenham Township",
    },
    "upper-salford-township": {
      geoid: "4209179280",
      label: "Upper Salford Township",
    },
    "east-greenville-borough": {
      geoid: "4209121200",
      label: "East Greenville Borough",
    },
    "norristown-borough": {
      geoid: "4209154656",
      label: "Norristown Borough",
    },
    "limerick-township": {
      geoid: "4209143312",
      label: "Limerick Township",
    },
    "upper-moreland-township": {
      geoid: "4209179176",
      label: "Upper Moreland Township",
    },
    "lansdale-borough": { geoid: "4209141432", label: "Lansdale Borough" },
    "douglass-township": {
      geoid: "4209119672",
      label: "Douglass Township",
    },
    "upper-frederick-township": {
      geoid: "4209179040",
      label: "Upper Frederick Township",
    },
    "abington-township": {
      geoid: "4209100156",
      label: "Abington Township",
    },
    "red-hill-borough": { geoid: "4209163808", label: "Red Hill Borough" },
    "upper-merion-township": {
      geoid: "4209179136",
      label: "Upper Merion Township",
    },
    "new-hanover-township": {
      geoid: "4209153664",
      label: "New Hanover Township",
    },
    "bryn-athyn-borough": {
      geoid: "4209109696",
      label: "Bryn Athyn Borough",
    },
    "whitpain-township": {
      geoid: "4209184888",
      label: "Whitpain Township",
    },
    "lower-providence-township": {
      geoid: "4209145080",
      label: "Lower Providence Township",
    },
    "bridgeport-borough": {
      geoid: "4209108568",
      label: "Bridgeport Borough",
    },
    "skippack-township": {
      geoid: "4209171016",
      label: "Skippack Township",
    },
    "upper-hanover-township": {
      geoid: "4209179064",
      label: "Upper Hanover Township",
    },
    "whitemarsh-township": {
      geoid: "4209184624",
      label: "Whitemarsh Township",
    },
  },
  philadelphia: {
    "philadelphia-city": { geoid: "4210160000", label: "Philadelphia City" },
  },
};
