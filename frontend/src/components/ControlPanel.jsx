import React from 'react';
import { Settings, Sliders, TreePine, Factory, Sun, Trash2, Bus, ShieldCheck } from 'lucide-react';

const ActionToggle = ({ label, value, onChange, description, icon: Icon, color }) => (
    <div className="group flex items-center justify-between p-4 bg-white/50 border border-white/60 rounded-xl hover:bg-white/80 transition-all shadow-sm hover:shadow-md cursor-pointer" onClick={() => onChange(!value)}>
        <div className="flex gap-3 items-center">
            <div className={`p-2 rounded-lg ${color} bg-opacity-20 text-slate-700`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="font-bold text-slate-700 group-hover:text-primary transition-colors">{label}</div>
                <div className="text-xs text-slate-500">{description}</div>
            </div>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${value ? 'bg-primary' : 'bg-slate-300'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
    </div>
);

const ControlPanel = ({ actions, setActions, timeHorizon, setTimeHorizon }) => {
    const updateAction = (key, val) => {
        setActions(prev => ({ ...prev, [key]: val }));
    };

    return (
        <div className="glass-panel p-6 h-full overflow-y-auto max-h-[80vh] custom-scrollbar">
            <div className="flex items-center gap-2 mb-6 text-slate-700 border-b border-slate-200 pb-4">
                <Sliders className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Controls</h2>
            </div>

            <div className="space-y-6 mb-8">

                {/* Factory Selection */}
                <div className="p-4 bg-white/60 rounded-xl border border-white/60 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-2 mb-3 text-slate-700">
                        <Factory className="w-5 h-5 text-indigo-500" />
                        <label className="text-sm font-bold">Industrial Zone</label>
                    </div>
                    <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer hover:bg-white"
                        value={actions.factory_type}
                        onChange={(e) => updateAction('factory_type', e.target.value)}
                    >
                        <option value="None">No New Industry</option>
                        <option value="Textile">Textile Factory (High Water Use)</option>
                        <option value="Chemical">Chemical Plant (High Risk)</option>
                        <option value="Electronics">Electronics Unit (High Energy)</option>
                        <option value="Automobile">Automobile Plant (High Emissions)</option>
                    </select>
                </div>

                <ActionToggle
                    label="Solar Grid"
                    value={actions.add_solar}
                    onChange={(v) => updateAction('add_solar', v)}
                    description="Install renewable energy."
                    icon={Sun}
                    color="bg-orange-400"
                />

                {/* Tree Management */}
                <div className="p-4 bg-white/60 rounded-xl border border-white/60 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-slate-700 border-b border-slate-200/50 pb-2">
                        <TreePine className="w-5 h-5 text-emerald-600" />
                        <label className="text-sm font-bold">Urban Forestry</label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-emerald-600 mb-1.5 block">Trees Planted</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                value={actions.trees_planted}
                                onChange={(e) => updateAction('trees_planted', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-red-500 mb-1.5 block">Trees Cut</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full bg-red-50 border border-red-100 rounded-lg p-2 text-sm text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                                value={actions.trees_cut}
                                onChange={(e) => updateAction('trees_cut', parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>

                <ActionToggle
                    label="Waste Mgmt"
                    value={actions.improve_waste_management}
                    onChange={(v) => updateAction('improve_waste_management', v)}
                    description="Efficient recycling & disposal."
                    icon={Trash2}
                    color="bg-purple-400"
                />

                <ActionToggle
                    label="Public Transit"
                    value={actions.expand_public_transport}
                    onChange={(v) => updateAction('expand_public_transport', v)}
                    description="Expand bus & metro networks."
                    icon={Bus}
                    color="bg-blue-400"
                />

                <ActionToggle
                    label="Green Policy"
                    value={actions.enforce_green_policy}
                    onChange={(v) => updateAction('enforce_green_policy', v)}
                    description="Strict environmental laws."
                    icon={ShieldCheck}
                    color="bg-teal-400"
                />
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
                <label className="flex justify-between text-sm font-bold text-slate-600 mb-4">
                    <span>Forecast Horizon</span>
                    <span className="bg-slate-200 px-2 py-0.5 rounded text-xs">{timeHorizon} Years</span>
                </label>
                <input
                    type="range"
                    min="5"
                    max="50"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-green-500 transition-all"
                />
            </div>
        </div>
    );
};

export default ControlPanel;
