import { useState, useMemo } from 'react';

export const useSearch = (items, searchFields = []) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchTerm.trim() || !items.length) return items;

        const term = searchTerm.toLowerCase();

        // 🟢 If no fields are provided, automatically get all keys from the first item
        const fieldsToSearch = searchFields.length > 0
            ? searchFields
            : Object.keys(items[0]);

        return items.filter(item =>
            fieldsToSearch.some(field => {
                const value = item[field];
                // Only search if value exists and is not an object/array
                return value !== null &&
                    value !== undefined &&
                    typeof value !== 'object' &&
                    value.toString().toLowerCase().includes(term);
            })
        );
    }, [items, searchTerm, searchFields]);

    return { searchTerm, setSearchTerm, filteredItems };
};
