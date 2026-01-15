
import { CampaignData } from './types';

export const BRAZIL_CENTER: [number, number] = [-55, -15];

export const STATE_COORDINATES: Record<string, { coords: [number, number]; zoom: number }> = {
  'Acre': { coords: [-70.81, -9.02], zoom: 3.5 },
  'Alagoas': { coords: [-36.66, -9.57], zoom: 6.0 },
  'Amapá': { coords: [-51.77, 1.41], zoom: 3.5 },
  'Amazonas': { coords: [-64.93, -3.41], zoom: 2.2 },
  'Bahia': { coords: [-41.74, -12.97], zoom: 2.5 },
  'Ceará': { coords: [-39.5, -5.2], zoom: 4.5 },
  'Distrito Federal': { coords: [-47.88, -15.78], zoom: 12.0 },
  'Espírito Santo': { coords: [-40.3, -19.19], zoom: 5.5 },
  'Goiás': { coords: [-49.83, -15.82], zoom: 3.2 },
  'Maranhão': { coords: [-45.16, -5.28], zoom: 3.2 },
  'Mato Grosso': { coords: [-55.88, -12.64], zoom: 2.5 },
  'Mato Grosso do Sul': { coords: [-54.7, -20.51], zoom: 3.2 },
  'Minas Gerais': { coords: [-44.55, -18.51], zoom: 2.8 },
  'Pará': { coords: [-52.33, -3.79], zoom: 2.2 },
  'Paraíba': { coords: [-36.78, -7.28], zoom: 6.0 },
  'Paraná': { coords: [-51.72, -24.89], zoom: 3.5 },
  'Pernambuco': { coords: [-37.95, -8.28], zoom: 5.0 },
  'Piauí': { coords: [-42.7, -7.71], zoom: 3.5 },
  'Rio de Janeiro': { coords: [-42.7, -22.5], zoom: 6.0 },
  'Rio Grande do Norte': { coords: [-36.5, -5.81], zoom: 6.0 },
  'Rio Grande do Sul': { coords: [-53.76, -30.03], zoom: 3.2 },
  'Rondônia': { coords: [-62.9, -10.83], zoom: 3.5 },
  'Roraima': { coords: [-61.3, 2.05], zoom: 3.5 },
  'Santa Catarina': { coords: [-50.45, -27.24], zoom: 4.5 },
  'São Paulo': { coords: [-48.5, -22.5], zoom: 3.5 },
  'Sergipe': { coords: [-37.45, -10.57], zoom: 8.0 },
  'Tocantins': { coords: [-48.25, -10.17], zoom: 3.2 },
};

export const CAMPAIGNS: CampaignData[] = [
  {
    id: 'c1',
    client: 'Tivva Capital',
    type: 'Fintech / Investimentos',
    description: 'Expansão de carteira digital e crédito sustentável em grandes centros urbanos de São Paulo.',
    imageUrl: '/images/tivva_capital.png',
    stateId: 'São Paulo',
    stateName: 'São Paulo',
    impact: 895612,
    coordinates: STATE_COORDINATES['São Paulo'].coords,
    zoom: STATE_COORDINATES['São Paulo'].zoom
  },
  {
    id: 'c2',
    client: 'Rede Acqua',
    type: 'Sustentabilidade Hídrica',
    description: 'Gestão inteligente de bacias hidrográficas no coração do cerrado tocantinense.',
    imageUrl: '/images/rede_acqua.png',
    stateId: 'Tocantins',
    stateName: 'Tocantins',
    impact: 195612,
    coordinates: STATE_COORDINATES['Tocantins'].coords,
    zoom: STATE_COORDINATES['Tocantins'].zoom
  },
  {
    id: 'c3',
    client: 'Eco Power',
    type: 'Energia Solar',
    description: 'Implementação de complexos fotovoltaicos em escala industrial no norte de Minas.',
    imageUrl: '/images/eco_power.png',
    stateId: 'Minas Gerais',
    stateName: 'Minas Gerais',
    impact: 542310,
    coordinates: STATE_COORDINATES['Minas Gerais'].coords,
    zoom: STATE_COORDINATES['Minas Gerais'].zoom
  },
  {
    id: 'c4',
    client: 'Agro Forte',
    type: 'Tecnologia Agrícola',
    description: 'Transformação digital no campo com monitoramento preditivo de safras no Mato Grosso.',
    imageUrl: '/images/agro_forte.png',
    stateId: 'Mato Grosso',
    stateName: 'Mato Grosso',
    impact: 712400,
    coordinates: STATE_COORDINATES['Mato Grosso'].coords,
    zoom: STATE_COORDINATES['Mato Grosso'].zoom
  },
  {
    id: 'c5',
    client: 'Bahia Wind',
    type: 'Energia Eólica',
    description: 'Liderança em matriz energética limpa com turbinas de última geração no litoral baiano.',
    imageUrl: '/images/bahia_wind.png',
    stateId: 'Bahia',
    stateName: 'Bahia',
    impact: 432100,
    coordinates: STATE_COORDINATES['Bahia'].coords,
    zoom: STATE_COORDINATES['Bahia'].zoom
  }
];

export const BR_TOPO_JSON = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";
