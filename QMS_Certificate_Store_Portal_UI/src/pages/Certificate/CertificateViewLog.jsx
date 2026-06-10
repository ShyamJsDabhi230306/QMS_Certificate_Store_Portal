import React, { useEffect, useState } from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import { certificateService } from '../../api/certificateService';
import { toast } from 'react-hot-toast';
import { usePagination } from '../../components/usePagination';
import SearchInput from '../../components/SearchInput';
import { useSearch } from '../../hooks/useSearch';
import Pagination from '../../components/Pagination';

const CertificateViewLog = () => {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const {
        searchTerm,
        setSearchTerm,
        filteredItems
    } = useSearch(logs);

    const {
        currentItems,
        paginationProps
    } = usePagination(filteredItems, 10);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {

        try {

            setLoading(true);

            const res =
                await certificateService.getLogs();

            console.log("LOG RESPONSE:", res);

            if (Array.isArray(res)) {

                setLogs(res);

            } else if (res?.success) {

                setLogs(res.data || []);

            } else {

                setLogs([]);

            }

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load certificate logs"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">

                    <Eye
                        className="text-gold"
                        size={32}
                    />

                    Certificate View Log

                </h1>

                <div className="w-full md:w-96">

                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search logs..."
                    />

                </div>

            </div>

            {/* Table */}
            <div
                className="
                bg-card/40
                backdrop-blur-md
                rounded-3xl
                border
                border-border
                shadow-2xl
                overflow-hidden
                text-[14px]
            "
            >

                <table
                    className="
                    w-full
                    text-left
                    border-collapse
                "
                >

                    <thead
                        className="
                        bg-muted/50
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.2em]
                        text-muted-foreground
                        border-b
                        border-border
                    "
                    >

                        <tr>

                            <th className="px-6 py-5 w-20">
                                #
                            </th>

                            <th className="px-6 py-5">
                                User Name
                            </th>

                            <th className="px-6 py-5">
                                Designation
                            </th>

                            <th className="px-6 py-5">
                                Certificate No
                            </th>

                            <th className="px-6 py-5">
                                Certificate Name
                            </th>

                            <th className="px-6 py-5">
                                Certificate Type
                            </th>

                            <th className="px-6 py-5">
                                Date
                            </th>

                            <th className="px-6 py-5">
                                Time
                            </th>

                        </tr>

                    </thead>

                    <tbody className="divide-y divide-border">

                        {loading ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="py-20 text-center"
                                >

                                    <RefreshCw
                                        className="
                                            animate-spin
                                            text-gold
                                            mx-auto
                                        "
                                    />

                                </td>

                            </tr>

                        ) : currentItems.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="
                                        py-20
                                        text-center
                                        text-muted-foreground
                                        font-black
                                        text-xs
                                        uppercase
                                        tracking-widest
                                    "
                                >

                                    No Logs Found

                                </td>

                            </tr>

                        ) : (

                            currentItems.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <tr
                                        key={item.idLog}
                                        className="
                                            group
                                            hover:bg-gold/[0.03]
                                            transition-colors
                                        "
                                    >

                                        <td
                                            className="
                                            px-6
                                            py-4
                                            font-black
                                            text-muted-foreground
                                        "
                                        >

                                            {
                                                (paginationProps.currentPage - 1) * 10 +
                                                index +
                                                1
                                            }

                                        </td>

                                        <td
                                            className="
                                            px-6
                                            py-4
                                            font-black
                                            text-foreground
                                        "
                                        >
                                            {item.userFullName}
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.designationName}
                                        </td>

                                        <td className="px-6 py-4 font-medium">
                                            {item.certificateNumber}
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.certificateName}
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.certificateTypeName}
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.logDate
                                                ? new Date(item.logDate).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td className="px-6 py-4">
                                            {item.logTime
                                                ? item.logTime.substring(0, 8)
                                                : "-"}
                                        </td>

                                    </tr>
                                )
                            )

                        )}

                    </tbody>

                </table>

                <Pagination
                    {...paginationProps}
                />

            </div>

        </div>
    );
};

export default CertificateViewLog;