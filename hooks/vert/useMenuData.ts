import { getRandomCount } from "@/lib/libs/functions";
import { MenuItem } from "@/lib/libs/interface";
import { useState } from "react";

const createMenuItem = (
  baseTitle: string,
  count: number,
  icon: string,
  tpsglobal: number,
  blackicon: string
): MenuItem => ({
  nbetablissements: count,
  title: `${count} ${baseTitle}`,
  icon,
  tpsglobal,
  blackicon,
   id: baseTitle.toLowerCase().replace(/\s/g, '_'),
  count,
  trendValue: 0,
  iconSrc: icon,
  iconAlt: `Icône ${baseTitle}`,
  color: "text-black",
  bgColor: "bg-white",
  description: baseTitle
});

const generateMenuData = (): { MAIN_MENU_ITEMS: MenuItem[] } => {
  const hotelsItem = createMenuItem(
    "HÔTELS",
    getRandomCount(2000, 20000),
    "/icons/hotel.png",
    200,
    "/icons/hotel-black.png"
  );

  const residencesItem = createMenuItem(
    "RÉSIDENCES",
    Math.floor(hotelsItem.nbetablissements * getRandomCount(30, 50) / 100),
    "/icons/residence.png",
    100,
    "/icons/residence-black.png"
  );

  const maisonsItem = createMenuItem(
    "MAISONS D'HÔTES",
    Math.floor(hotelsItem.nbetablissements * getRandomCount(10, 20) / 100),
    "/icons/maisondhote.png",
    46,
    "/icons/maisondhote-black.png"
  );

  const totalEtablissements = hotelsItem.nbetablissements + residencesItem.nbetablissements + maisonsItem.nbetablissements;

  const hommesCount = getRandomCount(2000, 10000);
  const femmesCount = getRandomCount(2000, 1000);
  const clientsCount = hommesCount + femmesCount;

  return {
    MAIN_MENU_ITEMS: [
      createMenuItem("ÉTABLISSEMENTS", totalEtablissements, "/icons/batiment.png", 0, "/icons/batiment.png"),
      createMenuItem("CLIENTS", clientsCount, "/icons/clients.png", 1, "/icons/clients.png"),
    ]
  };
};

export function useMenuData() {
  const [menuData] = useState(generateMenuData);

  return {   mainmenutitems: menuData.MAIN_MENU_ITEMS };
}