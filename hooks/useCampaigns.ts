import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CampaignData } from '../types';

export const useCampaigns = () => {
    const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                const { data, error: supabaseError } = await supabase
                    .from('campaigns')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (supabaseError) throw supabaseError;

                if (data) {
                    const mappedData: CampaignData[] = data.map(item => ({
                        id: item.id,
                        client: item.client_name,
                        type: item.category,
                        description: item.description,
                        imageUrl: item.image_url,
                        stateId: item.state_id,
                        stateName: item.state_name,
                        impact: parseInt(item.impact_value),
                        coordinates: [item.coord_long, item.coord_lat],
                        zoom: item.zoom_level,
                        is_active: item.is_active
                    }));
                    setCampaigns(mappedData);
                }
            } catch (e) {
                setError(e as Error);
                console.error('Error fetching campaigns:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();

        // Setup real-time subscription
        const subscription = supabase
            .channel('campaigns-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, () => {
                fetchCampaigns();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    return { campaigns, loading, error };
};
