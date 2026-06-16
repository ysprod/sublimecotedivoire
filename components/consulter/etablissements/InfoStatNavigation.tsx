'use client';
import type { MenuItem } from "@/lib/libs/interface";
import { memo, useCallback } from "react";
import ConsulterNavButton from "./ConsulterNavButton";

interface InfoStatProps {
  item: MenuItem;
  setSelectedMenuItem?: (item: MenuItem | null) => void;
  isActive?: boolean
}

const InfoStatNavigation = memo(({ item, setSelectedMenuItem, isActive }: InfoStatProps) => {
  const handleClick = useCallback(() => { setSelectedMenuItem?.(item); }, [item, setSelectedMenuItem]);

  return (
    <ConsulterNavButton key={item.tpsglobal} handleButtonClick={handleClick} item={item} isActive={isActive} />
  );
});

InfoStatNavigation.displayName = "InfoStat";

export default InfoStatNavigation;