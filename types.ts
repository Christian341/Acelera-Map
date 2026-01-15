
export interface CampaignData {
  id: string;
  client: string;
  type: string;
  description: string;
  imageUrl: string;
  stateId: string; // Ex: 'SP', 'TO', 'MT'
  stateName: string;
  impact: number;
  coordinates: [number, number]; // [Longitude, Latitude]
  zoom: number; // Custom zoom level for this specific state
  is_active?: boolean;
}

export interface MapPosition {
  coordinates: [number, number];
  zoom: number;
}
