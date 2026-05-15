import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // if (totalPages <= 1) return null; // Don't show if only one page

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    const btnClass = "p-2 rounded-xl border border-border bg-card hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground";

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-muted/20 border-t border-border">
            <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Showing <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-foreground">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-gold">{totalItems}</span> Entities
            </div>

            <div className="flex items-center gap-2">
                {/* First Page */}
                <button disabled={currentPage === 1} onClick={() => onPageChange(1)} className={btnClass}>
                    <ChevronsLeft size={16} />
                </button>

                {/* Previous */}
                <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className={btnClass}>
                    <ChevronLeft size={16} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 mx-2">
                    {getPageNumbers().map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === page
                                ? 'bg-gold text-white shadow-lg shadow-gold/20 scale-110'
                                : 'bg-card border border-border hover:border-gold text-muted-foreground'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Next */}
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className={btnClass}>
                    <ChevronRight size={16} />
                </button>

                {/* Last Page */}
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)} className={btnClass}>
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
