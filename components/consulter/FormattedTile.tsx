'use client';
import { MenuItem } from "@/libs/interface";
import { useMemo, memo } from "react";
import { STAT_LABEL_MAP } from "@/libs/constants";

interface InfoStatProps {
    item: MenuItem;
    tpsglobal?: number;
    inverse?: boolean;
}

const FormattedTitle = memo(({ item, inverse = false, tpsglobal = 1 }: InfoStatProps) => {

    const formattedTitle = useMemo(() => {
        if (!item.title) return null;

        const match = item.title.match(/^(\d+)\s(.+)$/);
        if (!match) return item.title;

        const numberPart = match[1];
        const textPart = match[2];
        const modifiedText = STAT_LABEL_MAP[tpsglobal] || "";

        return (
            <>
                <span className="text-gray-900">{inverse ? numberPart : textPart}</span>
                <br />
                <div>
                    <span className="text-blue-600 font-bold">{inverse ? textPart : numberPart}</span>
                    {!inverse && modifiedText && (<span className="text-blue-600 font-bold"> {modifiedText}</span>)}
                </div>
            </>
        );

    }, [item.title, inverse, tpsglobal]);

    return formattedTitle || <span className="text-gray-800">non spécifié</span>;
});

FormattedTitle.displayName = "FormattedTitle";

export default FormattedTitle;