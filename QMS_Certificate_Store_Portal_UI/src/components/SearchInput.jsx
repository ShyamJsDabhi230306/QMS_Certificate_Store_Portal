import React from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = "Search entities..." }) => {
    return (
        <div className="relative max-w-md w-full group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-muted-foreground group-focus-within:text-gold transition-colors" size={18} />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-card/50 border-2 border-border/50 rounded-2xl py-3 pl-12 pr-10 text-sm font-bold text-foreground focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/5 transition-all shadow-sm group-hover:border-border"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-red-500 transition-colors"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default SearchInput;
