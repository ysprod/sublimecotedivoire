import { regionsData, departementData } from "./mockdata";
import { Etablissement } from "./interface";

const typesEtablissements = [
    { type: "Hôtel", classifications: ["1 étoile", "2 étoiles", "3 étoiles", "4 étoiles", "5 étoiles"] },
    { type: "Résidence", classifications: ["Standard", "Confort", "Premium"] },
    { type: "Maison d'hôtes", classifications: ["Simple", "Traditionnelle", "Luxe"] }
];

const nomsEtablissements = [
    "Le Wafa", "La Perle", "Les Cocotiers", "Ivoire Lodge", "Sunset",
    "Palm Beach", "Savana", "Ebène", "Baobab", "Lagune Bleue",
    "Royal", "Paradise", "Jardin d'Eden", "Les Almadies", "Toubabou",
    "La Maison Bleue", "Le Domanial", "Les Bougainvilliers", "Le N'Zassa", "Awale"
];

const prenoms = ["Jean", "Marie", "Koffi", "Aïcha", "Mohamed", "Fatou", "Paul", "Adjoua", "Yves", "Amélie"];
const noms = ["Koné", "Yao", "Diop", "Toure", "Kouassi", "Bamba", "Gnahoré", "Soro", "Dosso", "Kamara"];

function genererTelephone() {
    return `+2250${Math.floor(Math.random() * 9)}${Math.floor(10000000 + Math.random() * 90000000)}`;
}

function genererEmail(nomEtablissement: string) {
    const domaine = ["gmail.com", "yahoo.fr", "hotmail.com", "etablissement-ci.com", "tourisme.ci"];
    return `${nomEtablissement.toLowerCase().replace(/\s+/g, '.')}@${domaine[Math.floor(Math.random() * domaine.length)]}`;
}

function genererMatricule() {
    return `AG${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
}

export const generateMockEtablissements = (count: number): Etablissement[] => {
    const etablissements: Etablissement[] = [];
    const regionsArray = Object.values(regionsData);

    for (let i = 0; i < count; i++) {
        const regionObj = regionsArray[Math.floor(Math.random() * regionsArray.length)];
        const regionId = Object.keys(regionsData).find(key => regionsData[key] === regionObj);
        const regionName = regionObj.c;

        const departementsRegion = departementData[regionId!] ? Object.values(departementData[regionId!]) : [];
        const departementObj = departementsRegion.length > 0
            ? departementsRegion[Math.floor(Math.random() * departementsRegion.length)]
            : { a: "Inconnu" };
        const departementName = departementObj.a;

        const typeData = typesEtablissements[Math.floor(Math.random() * typesEtablissements.length)];
        const classification = typeData.classifications[Math.floor(Math.random() * typeData.classifications.length)];

        const nomEtablissement = `${nomsEtablissements[Math.floor(Math.random() * nomsEtablissements.length)]} ${Math.random() > 0.5 ? nomsEtablissements[Math.floor(Math.random() * nomsEtablissements.length)] : ""}`.trim();

        const genre = Math.random() > 0.5 ? "Homme" : "Femme";
        const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
        const nom = noms[Math.floor(Math.random() * noms.length)];

        etablissements.push({
            type: typeData.type,
            nom: nomEtablissement,
            licence: `LIC-${Math.floor(10000 + Math.random() * 90000)}`,
            classification,
            chambres: Math.floor(5 + Math.random() * 100),
            region: regionName!,
            departement: departementName!,
            commune: `Commune ${Math.floor(1 + Math.random() * 10)}`,
            quartier: `Quartier ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
            adresse: `${Math.floor(1 + Math.random() * 200)} Rue des ${nomsEtablissements[Math.floor(Math.random() * nomsEtablissements.length)]}`,
            telephone: genererTelephone(),
            email: genererEmail(nomEtablissement),
            cotisation: Math.random() > 0.3 ? "À jour" : "Pas à jour",
            owner: {
                nom,
                prenom,
                genre,
                photo: Math.random() > 0.7 ? `https://randomuser.me/api/portraits/${prenom.toLowerCase()}-${nom.toLowerCase()}.jpg` : undefined,
                telephone: genererTelephone(),
                matricule: Math.random() > 0.5 ? genererMatricule() : undefined,
                typeagent: Math.random() > 0.5 ? "Gérant" : "Propriétaire"
            }
        });
    }

    return etablissements;
};