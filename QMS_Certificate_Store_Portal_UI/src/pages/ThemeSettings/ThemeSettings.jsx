import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Palette, Type, Layout, Sidebar as SidebarIcon, AlignLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

// 1. Setup factory default states for ALL custom variables
const DEFAULT_THEME = {
    background: '#0a0a0a',
    foreground: '#fafafa',
    mutedForeground: '#737373',
    card: '#171717',
    border: '#262626',
    gold: '#c5a059',

    // Sidebar Variable Defaults
    sidebar: '#111111',
    sidebarForeground: '#a3a3a3',
    sidebarActive: '#c5a059',

    fontSize: '16', // in px
};

const ThemeSettings = () => {
    // 2. Initialize state from localStorage or defaults
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('custom-theme-variables');
        return saved ? JSON.parse(saved) : { ...DEFAULT_THEME };
    });

    // 3. Dynamic DOM injection for ALL CSS custom variables
    const applyTheme = (currentTheme) => {
        const root = document.documentElement;

        // Core Colors
        root.style.setProperty('--background', currentTheme.background);
        root.style.setProperty('--foreground', currentTheme.foreground);
        root.style.setProperty('--muted-foreground', currentTheme.mutedForeground);
        root.style.setProperty('--card', currentTheme.card);
        root.style.setProperty('--border', currentTheme.border);
        root.style.setProperty('--gold', currentTheme.gold);

        // Sidebar Colors
        root.style.setProperty('--sidebar', currentTheme.sidebar);
        root.style.setProperty('--sidebar-foreground', currentTheme.sidebarForeground);
        root.style.setProperty('--sidebar-active', currentTheme.sidebarActive);

        // Typography Size
        root.style.setProperty('--font-size-base', `${currentTheme.fontSize}px`);
    };

    // 4. Live update variables as user interacts with pickers
    const handleChange = (key, value) => {
        const updatedTheme = { ...theme, [key]: value };
        setTheme(updatedTheme);
        applyTheme(updatedTheme);
    };

    // 5. Persist setting states in localStorage
    const handleSave = () => {
        localStorage.setItem('custom-theme-variables', JSON.stringify(theme));
        toast.success("Theme settings saved successfully!");
    };

    // 6. Hard reset options back to factory configuration
    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all theme components to factory defaults?")) {
            setTheme(DEFAULT_THEME);
            applyTheme(DEFAULT_THEME);
            localStorage.removeItem('custom-theme-variables');
            toast.success("Theme reset to defaults!");
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Title */}
            <div>
                <h1 className="text-3xl font-black uppercase text-foreground flex items-center gap-3">
                    <Palette className="text-gold" size={32} /> Visual Engine Control
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Live-configure colors, secondary text details, sidebar layers, and typography scaling across the registry portal.
                </p>
            </div>

            {/* Grid Layout of Variable Groups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ── GROUP 1: Core Layout Canvas & Typography ── */}
                <div className="space-y-6">
                    {/* General Palette Card */}
                    <div className="bg-card border-2 border-border p-6 rounded-3xl space-y-6 shadow-xl">
                        <h2 className="text-[12px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                            <Layout size={16} /> Canvas & General System Colors
                        </h2>

                        <div className="space-y-4">
                            {/* Background Color */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground">Canvas Background</span>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={theme.background}
                                        onChange={e => handleChange('background', e.target.value)}
                                        className="w-10 h-10 border-2 border-border rounded-xl cursor-pointer bg-transparent"
                                    />
                                    <span className="text-xs uppercase font-mono text-muted-foreground">{theme.background}</span>
                                </div>
                            </div>

                            {/* Card Background Color */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground">Component Card Canvas</span>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={theme.card}
                                        onChange={e => handleChange('card', e.target.value)}
                                        className="w-10 h-10 border-2 border-border rounded-xl cursor-pointer bg-transparent"
                                    />
                                    <span className="text-xs uppercase font-mono text-muted-foreground">{theme.card}</span>
                                </div>
                            </div>

                            {/* Border Color */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground">Grid Outlines & Borders</span>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={theme.border}
                                        onChange={e => handleChange('border', e.target.value)}
                                        className="w-10 h-10 border-2 border-border rounded-xl cursor-pointer bg-transparent"
                                    />
                                    <span className="text-xs uppercase font-mono text-muted-foreground">{theme.border}</span>
                                </div>
                            </div>

                            {/* Main Accent Gold Branding */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground">System Gold Branding</span>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={theme.gold}
                                        onChange={e => handleChange('gold', e.target.value)}
                                        className="w-10 h-10 border-2 border-border rounded-xl cursor-pointer bg-transparent"
                                    />
                                    <span className="text-xs uppercase font-mono text-muted-foreground">{theme.gold}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Customization Card */}
                    <div className="bg-card border-2 border-border p-6 rounded-3xl space-y-6 shadow-xl">
                        <h2 className="text-[12px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                            <AlignLeft size={16} /> Typography & Text Color Management
                        </h2>

                        <div className="space-y-4">
                            {/* Primary Foreground Text */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground">Primary Text Color</span>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={theme.foreground}
                                        onChange={e => handleChange('foreground', e.target.value)}
                                        className="w-10 h-10 border-2 border-border rounded-xl cursor-pointer bg-transparent"
                                    />
                                    <span className="text-xs uppercase font-mono text-muted-foreground">{theme.foreground}</span>
                                </div>
                            </div>

                            {/* Secondary/Muted Text */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground">Secondary / Muted Text</span>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={theme.mutedForeground}
                                        onChange={e => handleChange('mutedForeground', e.target.value)}
                                        className="w-10 h-10 border-2 border-border rounded-xl cursor-pointer bg-transparent"
                                    />
                                    <span className="text-xs uppercase font-mono text-muted-foreground">{theme.mutedForeground}</span>
                                </div>
                            </div>

                            {/* Scaling slider */}
                            <div className="space-y-3 pt-3 border-t border-border/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-foreground">Base FontSize Scale</span>
                                    <span className="px-2 py-0.5 rounded bg-muted text-xs font-black tracking-wider">{theme.fontSize}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="12"
                                    max="24"
                                    value={theme.fontSize}
                                    onChange={e => handleChange('fontSize', e.target.value)}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-gold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── GROUP 2: Sidebar Control & Visual Sandboxing ── */}
                <div className="space-y-6">

                    {/* Sidebar Styling Card */}
                    <div className="bg-card border-2 border-border p-6 rounded-3xl space-y-6 shadow-xl">
                        <h2 className="text-[12px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                            <SidebarIcon size={16} /> Navigation Sidebar Colors
                        </h2>

                        <div className="space-y-4">
                            {/* Sidebar Background */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground">Sidebar Panel Canvas</span>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={theme.sidebar}
                                        onChange={e => handleChange('sidebar', e.target.value)}
                                        className="w-10 h-10 border-2 border-border rounded-xl cursor-pointer bg-transparent"
                                    />
                                    <span className="text-xs uppercase font-mono text-muted-foreground">{theme.sidebar}</span>
                                </div>
                            </div>

                            {/* Sidebar Menu Texts */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground">Sidebar Text Color</span>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={theme.sidebarForeground}
                                        onChange={e => handleChange('sidebarForeground', e.target.value)}
                                        className="w-10 h-10 border-2 border-border rounded-xl cursor-pointer bg-transparent"
                                    />
                                    <span className="text-xs uppercase font-mono text-muted-foreground">{theme.sidebarForeground}</span>
                                </div>
                            </div>

                            {/* Sidebar Active Element Highlight */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground">Sidebar Active Highlight</span>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={theme.sidebarActive}
                                        onChange={e => handleChange('sidebarActive', e.target.value)}
                                        className="w-10 h-10 border-2 border-border rounded-xl cursor-pointer bg-transparent"
                                    />
                                    <span className="text-xs uppercase font-mono text-muted-foreground">{theme.sidebarActive}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Sandboxing Sandbox */}
                    <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-xl flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                            <h2 className="text-[12px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                                <Type size={16} /> Visual Sandbox Preview
                            </h2>

                            <div className="border border-border/80 bg-background/50 rounded-2xl p-5 space-y-3">
                                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">Demonstration Widget</p>

                                <p style={{ fontSize: `${theme.fontSize}px` }} className="font-bold text-foreground leading-tight transition-all duration-150">
                                    This primary text scales to {theme.fontSize}px on the fly.
                                </p>

                                <p className="text-xs font-bold text-muted-foreground">
                                    This represents secondary descriptions or labels using muted configurations.
                                </p>

                                <div className="flex items-center gap-2 pt-2">
                                    <span className="px-3 py-1 rounded bg-gold/15 text-[10px] font-black uppercase tracking-widest text-gold">
                                        System Badge Preview
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save & Reset Panel */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <button
                    onClick={handleReset}
                    className="px-6 py-3.5 bg-muted text-foreground border-2 border-border rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95"
                >
                    <RotateCcw size={16} /> Factory Default Reset
                </button>
                <button
                    onClick={handleSave}
                    className="px-8 py-3.5 bg-gold hover:bg-gold-hover text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-gold/20"
                >
                    <Save size={16} /> Save Visual States
                </button>
            </div>
        </div>
    );
};

export default ThemeSettings;
