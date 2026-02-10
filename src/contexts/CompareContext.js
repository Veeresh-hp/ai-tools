import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
    const [selectedTools, setSelectedTools] = useState([]);

    // Load from local storage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('compare_list');
            if (stored) setSelectedTools(JSON.parse(stored));
        } catch (e) {
            console.error("Failed to load compare list", e);
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('compare_list', JSON.stringify(selectedTools));
    }, [selectedTools]);

    const addToCompare = (tool) => {
        if (selectedTools.find(t => t.name === tool.name)) return;
        if (selectedTools.length >= 3) {
            // Optional: Show toast or alert? 
            // For now, we replace the oldest one or just stop? 
            // Let's stop and let UI handle the message or return false.
            return false;
        }
        setSelectedTools(prev => [...prev, tool]);
        return true;
    };

    const removeFromCompare = (toolIdOrName) => {
        setSelectedTools(prev => prev.filter(t => t.name !== toolIdOrName && t._id !== toolIdOrName));
    };

    const clearCompare = () => {
        setSelectedTools([]);
    };

    const isSelected = (tool) => {
        return selectedTools.some(t => t.name === tool.name);
    };

    return (
        <CompareContext.Provider value={{ selectedTools, addToCompare, removeFromCompare, clearCompare, isSelected }}>
            {children}
        </CompareContext.Provider>
    );
};
