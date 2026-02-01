import React, { useState, useEffect, useMemo } from 'react';
import LocalitySelector from './components/LocalitySelector';
import ControlPanel from './components/ControlPanel';
import Dashboard from './components/Dashboard';
import ChatBot from './components/ChatBot';
import { api } from './api';
import { Leaf, Activity, AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';

function App() {
    const [localities, setLocalities] = useState({});
    const [selectedLocality, setSelectedLocality] = useState(null);
    const [baseline, setBaseline] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timeHorizon, setTimeHorizon] = useState(20);

    const [actions, setActions] = useState({
        build_factory: false,
        factory_type: 'None',
        add_solar: false,
        trees_planted: 0,
        trees_cut: 0,
        increase_green_cover: false,
        improve_waste_management: false,
        expand_public_transport: false,
        enforce_green_policy: false
    });

    useEffect(() => {
        api.getLocalities().then(setLocalities).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedLocality) {
            api.getBaseline(selectedLocality).then(setBaseline).catch(console.error);
        }
    }, [selectedLocality]);

    useEffect(() => {
        if (selectedLocality && baseline) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const res = await api.predict({
                        locality: selectedLocality,
                        baseline: baseline,
                        actions: actions,
                        time_horizon_years: timeHorizon
                    });
                    setPrediction(res);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            const debounce = setTimeout(fetchData, 500);
            return () => clearTimeout(debounce);
        }
    }, [selectedLocality, baseline, actions, timeHorizon]);

    // Determine Overall Situation
    const overallStatus = useMemo(() => {
        if (!prediction) return null;
        const final = prediction.predictions[prediction.predictions.length - 1];
        const score = (final.happiness_index + final.health_index + (100 - final.pollution_index)) / 3;

        if (score >= 80) return { label: 'Excellent', color: 'bg-green-500', icon: CheckCircle };
        if (score >= 60) return { label: 'Good', color: 'bg-emerald-400', icon: CheckCircle };
        if (score >= 40) return { label: 'Moderate', color: 'bg-yellow-400', icon: Activity };
        if (score >= 20) return { label: 'Poor', color: 'bg-orange-500', icon: AlertTriangle };
        return { label: 'Critical', color: 'bg-red-500', icon: AlertTriangle };
    }, [prediction]);

    return (
        <div className="min-h-screen p-4 md:p-6 font-sans text-slate-800">

            {/* Dynamic Status Header */}
            {overallStatus && (
                <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
                    <div className="mt-4 bg-white/90 backdrop-blur-md shadow-xl border border-white/50 rounded-full px-8 py-3 flex items-center gap-4 animate-in slide-in-from-top-10 pointer-events-auto transition-all hover:scale-105">
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Overall Condition</span>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-white font-bold shadow-sm ${overallStatus.color}`}>
                            <overallStatus.icon className="w-4 h-4" />
                            {overallStatus.label}
                        </div>
                    </div>
                </div>
            )}

            <header className="flex flex-col md:flex-row items-center justify-between mb-10 max-w-7xl mx-auto pt-16 md:pt-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-3 rounded-2xl">
                        <Leaf className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                            Living Neighborhood
                        </h1>
                        <p className="text-slate-500 font-medium">Future Prediction Digital Twin</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto">
                <div className="lg:col-span-3 space-y-6">
                    <LocalitySelector localities={localities} onSelect={setSelectedLocality} />

                    {selectedLocality && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                            <ControlPanel
                                actions={actions}
                                setActions={setActions}
                                timeHorizon={timeHorizon}
                                setTimeHorizon={setTimeHorizon}
                            />
                        </div>
                    )}
                </div>

                <div className="lg:col-span-9">
                    {selectedLocality ? (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            <Dashboard prediction={prediction} baseline={baseline} />
                        </div>
                    ) : (
                        <div className="glass-panel p-12 text-center h-96 flex flex-col items-center justify-center border-dashed border-2 border-slate-300">
                            <div className="bg-blue-50 p-6 rounded-full mb-6 animate-float">
                                <Smartphone className="w-12 h-12 text-secondary" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-700 mb-2">Start Simulation</h2>
                            <p className="text-slate-500 max-w-md">
                                Select a locality to load the digital twin and begin exploring future scenarios.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {selectedLocality && (
                <ChatBot context={{ locality: selectedLocality, current_stats: prediction?.predictions?.at(-1), actions }} />
            )}
        </div>
    );
}

export default App;
