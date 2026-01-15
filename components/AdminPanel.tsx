
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, X, Plus, Image as ImageIcon, Check,
    Trash2, Globe, TrendingUp, Save, Upload, Loader2, Eye, EyeOff
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CampaignData } from '../types';
import { STATE_COORDINATES } from '../constants';

interface AdminPanelProps {
    campaigns: CampaignData[];
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ campaigns, onClose }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'list' | 'edit'>('list');

    const [formData, setFormData] = useState<Partial<CampaignData>>({
        client: '',
        type: '',
        description: '',
        impact: 0,
        stateId: 'São Paulo',
        stateName: 'São Paulo',
        imageUrl: '',
        is_active: true
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const states = Object.keys(STATE_COORDINATES).sort();

    const handleEdit = (campaign: CampaignData) => {
        setFormData(campaign);
        setEditingId(campaign.id);
        setActiveTab('edit');
    };

    const handleNew = () => {
        setFormData({
            client: '',
            type: '',
            description: '',
            impact: 0,
            stateId: 'São Paulo',
            stateName: 'São Paulo',
            imageUrl: '',
            is_active: true
        });
        setEditingId(null);
        setActiveTab('edit');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `campaigns/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('campaign-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('campaign-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Erro ao fazer upload da imagem');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.client || !formData.stateId) {
            alert('Preencha os campos obrigatórios');
            return;
        }

        const stateData = STATE_COORDINATES[formData.stateId!];

        const dbPayload = {
            client_name: formData.client,
            category: formData.type,
            description: formData.description,
            impact_value: formData.impact,
            state_id: formData.stateId,
            state_name: formData.stateId, // simplify state name to match id for this demo
            image_url: formData.imageUrl,
            coord_long: stateData.coords[0],
            coord_lat: stateData.coords[1],
            zoom_level: stateData.zoom,
            is_active: formData.is_active ?? true
        };

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('campaigns')
                    .update(dbPayload)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('campaigns')
                    .insert([dbPayload]);
                if (error) throw error;
            }
            setActiveTab('list');
        } catch (error) {
            console.error('Error saving campaign:', error);
            alert('Erro ao salvar campanha');
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean | undefined) => {
        try {
            await supabase
                .from('campaigns')
                .update({ is_active: !currentStatus })
                .eq('id', id);
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const deleteCampaign = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta campanha?')) return;
        try {
            await supabase.from('campaigns').delete().eq('id', id);
        } catch (error) {
            console.error('Error deleting campaign:', error);
        }
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-[480px] bg-[#0A0A0A] border-l border-white/10 z-[100] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
        >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#FF2D55]/10 rounded-lg">
                        <Settings className="text-[#FF2D55] w-5 h-5" />
                    </div>
                    <h2 className="text-white text-xl font-bold uppercase tracking-tight">Painel Admin</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                    <X className="text-white/40 w-6 h-6" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-8">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`py-4 px-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'list' ? 'text-[#FF2D55]' : 'text-white/40 hover:text-white/60'}`}
                >
                    Listagem
                    {activeTab === 'list' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF2D55]" />}
                </button>
                <button
                    onClick={handleNew}
                    className={`py-4 px-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'edit' ? 'text-[#FF2D55]' : 'text-white/40 hover:text-white/60'}`}
                >
                    {editingId ? 'Editar' : 'Novo'}
                    {activeTab === 'edit' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF2D55]" />}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {campaigns.map(camp => (
                                <div key={camp.id} className="glass p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 border border-white/5">
                                            {camp.imageUrl ? (
                                                <img src={camp.imageUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="text-white/10 w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-white font-bold truncate pr-2 uppercase text-sm tracking-tight">{camp.client}</h4>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => toggleActive(camp.id, camp.is_active)}
                                                        className={`p-1.5 rounded-lg transition-colors ${camp.is_active === false ? 'text-white/20 hover:bg-white/5' : 'text-[#FF2D55] hover:bg-[#FF2D55]/10'}`}
                                                    >
                                                        {camp.is_active === false ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">{camp.stateId} • {camp.type}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(camp)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white px-3 py-1.5 bg-white/5 rounded-lg transition-colors"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => deleteCampaign(camp.id)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleNew}
                                className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-white/20 hover:text-[#FF2D55] hover:border-[#FF2D55]/30 hover:bg-[#FF2D55]/5 transition-all flex items-center justify-center gap-2 group"
                            >
                                <Plus size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-black uppercase tracking-widest">Adicionar Campanha</span>
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Cliente</label>
                                <input
                                    value={formData.client}
                                    onChange={e => setFormData({ ...formData, client: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF2D55]/50 transition-colors"
                                    placeholder="Ex: Tivva Capital"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Segmento</label>
                                    <input
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF2D55]/50 transition-colors"
                                        placeholder="Ex: Fintech"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Alcance</label>
                                    <div className="relative">
                                        <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                                        <input
                                            type="number"
                                            value={formData.impact}
                                            onChange={e => setFormData({ ...formData, impact: parseInt(e.target.value) })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#FF2D55]/50 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Região (Estado)</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                                    <select
                                        value={formData.stateId}
                                        onChange={e => setFormData({ ...formData, stateId: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#FF2D55]/50 transition-colors appearance-none"
                                    >
                                        {states.map(s => <option key={s} value={s} className="bg-[#0A0A0A]">{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Descrição</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF2D55]/50 transition-colors resize-none"
                                    placeholder="Breve resumo do impacto..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Imagem da Campanha</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative group cursor-pointer aspect-video rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] overflow-hidden flex flex-col items-center justify-center gap-3 hover:border-[#FF2D55]/30 hover:bg-[#FF2D55]/5 transition-all"
                                >
                                    {formData.imageUrl ? (
                                        <>
                                            <img src={formData.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Upload size={24} className="text-white mb-2" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Trocar Imagem</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-4 bg-white/5 rounded-full">
                                                {isUploading ? <Loader2 className="text-[#FF2D55] w-6 h-6 animate-spin" /> : <ImageIcon className="text-white/20 w-6 h-6" />}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Upload Arquivo</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-[#FF2D55] hover:bg-[#FF2D55]/90 text-white h-12 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95"
                                >
                                    <Save size={18} />
                                    Salvar
                                </button>
                                <button
                                    onClick={() => setActiveTab('list')}
                                    className="px-6 border border-white/10 text-white/40 hover:text-white hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default AdminPanel;
