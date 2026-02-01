import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Activity, Droplets, Wind, Heart, Smile, Sprout, TrendingUp } from 'lucide-react';

const MetricCard = ({ title, value, unit, icon: Icon, colorClass, trend }) => (
    <div className="group glass-panel p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500`}></div>

        <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 text-slate-700 mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
            <Icon className="w-8 h-8 opacity-80" />
        </div>

        <div className="font-extrabold text-3xl text-slate-800 tracking-tight">
            {value} <span className="text-base font-medium text-slate-400">{unit}</span>
        </div>
        <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">{title}</div>
    </div>
);

const Dashboard = ({ prediction, baseline }) => {
    if (!prediction) return null;

    const { predictions, explanations, trees_to_plant_for_happiness } = prediction;
    const finalState = predictions[predictions.length - 1];

    return (
        <div className="space-y-8">
            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <MetricCard
                    title="Air Quality"
                    value={finalState.aqi}
                    unit="AQI"
                    icon={Wind}
                    colorClass={finalState.aqi > 100 ? "from-red-400 to-orange-400 text-red-600" : "from-green-400 to-emerald-400 text-green-600"}
                />
                <MetricCard
                    title="Water Health"
                    value={finalState.water_quality}
                    unit="Index"
                    icon={Droplets}
                    colorClass="from-blue-400 to-cyan-400 text-blue-600"
                />
                <MetricCard
                    title="Public Health"
                    value={finalState.health_index}
                    unit="/ 100"
                    icon={Heart}
                    colorClass="from-rose-400 to-pink-400 text-pink-600"
                />
                <MetricCard
                    title="Happiness"
                    value={finalState.happiness_index}
                    unit="%"
                    icon={Smile}
                    colorClass={finalState.happiness_index > 60 ? "from-purple-400 to-violet-400 text-purple-600" : "from-orange-400 to-amber-400 text-orange-600"}
                />
                <MetricCard
                    title="Carbon"
                    value={finalState.carbon_budget}
                    unit="Mt"
                    icon={Activity}
                    colorClass="from-yellow-400 to-amber-400 text-amber-600"
                />
            </div>

            {/* Recommendation Alert */}
            {trees_to_plant_for_happiness > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                    <div className="p-4 bg-white rounded-full shadow-sm z-10">
                        <Sprout className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div className="z-10">
                        <h4 className="text-xl font-bold text-emerald-900 mb-1">Nature Restoration Needed</h4>
                        <p className="text-emerald-700 leading-relaxed">
                            The community's happiness is declining due to environmental stress. Our models suggest planting
                            <span className="font-extrabold text-2xl mx-1.5 bg-white px-2 py-0.5 rounded shadow-sm text-emerald-600">{trees_to_plant_for_happiness}</span>
                            new trees will restore the ecological balance and improve resident well-being.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-panel p-6 shadow-md">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Environmental Trend</h3>
                            <p className="text-xs text-slate-500">AQI vs Water Quality over time</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={predictions} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: '#475569', fontWeight: 600 }}
                                />
                                <Area type="monotone" dataKey="aqi" stroke="#f87171" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" name="AQI" activeDot={{ r: 6 }} />
                                <Area type="monotone" dataKey="water_quality" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#colorWater)" name="Water Quality" activeDot={{ r: 6 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6 shadow-md">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Quality of Life</h3>
                            <p className="text-xs text-slate-500">Happiness & Health correlations</p>
                        </div>
                        <Heart className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={predictions} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                                <Legend iconType="circle" />
                                <Line type="monotone" dataKey="health_index" stroke="#fb7185" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Health" />
                                <Line type="monotone" dataKey="happiness_index" stroke="#a78bfa" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Happiness" />
                                <Line type="monotone" dataKey="social_inequality" stroke="#fbbf24" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Inequality" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Explanations */}
            <div className="glass-panel p-8 bg-gradient-to-r from-white to-slate-50">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Simulation Insights</h3>
                <div className="grid gap-3">
                    {explanations.map((exp, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm transition-transform hover:translate-x-1">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <p className="text-slate-600 leading-relaxed text-sm">{exp}</p>
                        </div>
                    ))}
                    {explanations.length === 0 && (
                        <div className="text-center py-8 text-slate-400 italic">
                            Adjust parameters in the control panel to see causal impacts here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
