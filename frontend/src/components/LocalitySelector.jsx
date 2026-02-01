import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const LocalitySelector = ({ localities, onSelect }) => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const countries = Object.keys(localities);
    const states = selectedCountry ? Object.keys(localities[selectedCountry] || {}) : [];
    const districts = selectedState ? Object.keys(localities[selectedCountry][selectedState] || {}) : [];
    const cities = selectedDistrict ? Object.keys(localities[selectedCountry][selectedState][selectedDistrict] || {}) : [];

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        onSelect(city);
    };

    const SelectBox = ({ value, options, onChange, placeholder, disabled }) => (
        <div className="relative">
            <select
                className="w-full appearance-none bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-white"
                value={value}
                onChange={onChange}
                disabled={disabled}
            >
                <option value="">{placeholder}</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Navigation className="w-3 h-3 fill-current" />
            </div>
        </div>
    );

    return (
        <div className="glass-panel p-6 mb-8 bg-gradient-to-br from-white/80 to-green-50/50">
            <div className="flex items-center gap-2 mb-5 text-emerald-600">
                <MapPin className="w-6 h-6" />
                <h2 className="text-lg font-bold text-slate-800">Locality</h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <SelectBox
                    value={selectedCountry}
                    options={countries}
                    onChange={(e) => { setSelectedCountry(e.target.value); setSelectedState(''); }}
                    placeholder="Country"
                />
                <SelectBox
                    value={selectedState}
                    options={states}
                    onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                    placeholder="State"
                    disabled={!selectedCountry}
                />
                <SelectBox
                    value={selectedDistrict}
                    options={districts}
                    onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedCity(''); }}
                    placeholder="District"
                    disabled={!selectedState}
                />
                <SelectBox
                    value={selectedCity}
                    options={cities}
                    onChange={(e) => handleCitySelect(e.target.value)}
                    placeholder="City / Town"
                    disabled={!selectedDistrict}
                />
            </div>
        </div>
    );
};

export default LocalitySelector;
