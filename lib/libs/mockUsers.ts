import { ConnexionHistory } from '@/lib/libs/interface';

const ivoirianFirstNames = ['Koffi', 'Ama', 'Yao', 'Mariam', 'Jean', 'Fatou'];
const ivoirianLastNames = ['Kouassi', 'Traoré', 'Yao', 'Konaté', 'Bamba', 'Diop'];

const citiesCI: { city: string; coords: [number, number] }[] = [
    { city: 'Abidjan', coords: [5.35995, -4.00896] },
    { city: 'Bouaké', coords: [7.69385, -5.03031] },
    { city: 'Daloa', coords: [6.87735, -6.44761] },
    { city: 'GBOKLE', coords: [5.254467, -5.928269] },
    { city: 'NAWA', coords: [5.9478118, -6.6861058] },
    { city: 'SAN PEDRO', coords: [4.7589989, -6.6463922] },
    { city: 'INDENIE-DJUABLIN', coords: [6.6216454, -3.4689578] },
    { city: 'SUD-COMOE', coords: [5.6832478, -3.1742961] },
    { city: 'FOLON', coords: [10.104917, -7.4514106] },
    { city: 'KABADOUGOU', coords: [9.3043595, -7.3358413] },
    { city: 'GOH', coords: [5.2322329, -6.6360889] },
    { city: 'LOH-DJIBOUA', coords: [5.6945419, -5.4994467] },
    { city: 'BELIER', coords: [6.9072745, -4.9194344] },
    { city: 'IFFOU', coords: [7.4977539, -4.1213543] },
    { city: 'MORONOU', coords: [6.5942654, -4.1579986] },
    { city: "N'ZI", coords: [7.0103664, -4.4178761] },
    { city: 'AGNEBY-TIASSA', coords: [5.9685016, -4.5420479] },
    { city: 'GRANDS PONTS', coords: [5.4540163, -4.6488923] },
    { city: 'LA ME', coords: [5.932282, -3.755491] },
    { city: 'CAVALLY', coords: [6.3032154, -7.5732829] },
    { city: 'GUEMON', coords: [6.9963016, -7.3504004] },
    { city: 'TONKPI', coords: [7.3721417, -7.944586] },
    { city: 'HAUT-SASSANDRA', coords: [7.0304715, -6.6189533] },
    { city: 'MARAHOUE', coords: [7.1382029, -5.7569299] },
    { city: 'BAGOE', coords: [9.896245, -6.448633] },
    { city: 'PORO', coords: [9.4760023, -5.7312223] },
    { city: 'TCHOLOGO', coords: [9.5466024, -4.7845119] },
    { city: 'GBEKE', coords: [7.6991765, -5.0965222] },
    { city: 'HAMBOL', coords: [8.6201989, -4.8136527] },
    { city: 'BAFING', coords: [8.457986, -7.4228369] },
    { city: 'BERE', coords: [9.0, -6.75] },
    { city: 'WORODOUGOU', coords: [8.3977175, -6.7575757] },
    { city: 'BOUNKANI', coords: [9.0799571, -3.3293652] },
    { city: 'GONTOUGO', coords: [7.9234394, -3.369677] },
    { city: 'ABIDJAN', coords: [5.320357, -4.016107] },
    { city: 'YAMOUSSOKRO', coords: [6.8200066, -5.2776034] },
];

export const generateMockUsers = (count: number): ConnexionHistory[] => {
    return Array.from({ length: count }, (_, i) => {
        const firstName = ivoirianFirstNames[Math.floor(Math.random() * ivoirianFirstNames.length)];
        const lastName = ivoirianLastNames[Math.floor(Math.random() * ivoirianLastNames.length)];
        const cityData = citiesCI[Math.floor(Math.random() * citiesCI.length)];
        const loginDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));

        const session: ConnexionHistory = {
            userId: `CI-${10000 + i}`,
            userImage: Math.random() > 0.3 ?
                `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${i % 100}.jpg` :
                undefined,
            userName: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${Math.random() > 0.5 ? 'gmail' : 'yahoo'}.com`,
            role: Math.random() > 0.95 ? 'admin' :
                Math.random() > 0.8 ? 'manager' :
                    Math.random() > 0.7 ? 'agent' : 'superviseur',
            sessionId: `sess-${Math.random().toString(36).substring(2, 10)}`,
            status: Math.random() > 0.9 ? 'echec' : Math.random() > 0.85 ? 'expiré' : 'succes',
            login: {
                timestamp: Math.floor(loginDate.getTime() / 1000),
                date: loginDate.toLocaleDateString('fr-CI'),
                time: loginDate.toLocaleTimeString('fr-CI', { hour: '2-digit', minute: '2-digit' }),
                ipAddress: `196.207.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                location: {
                    city: cityData.city,
                    country: 'Côte d\'Ivoire',
                    coordinates: cityData.coords
                }
            },
            device: {
                type: Math.random() > 0.6 ? 'mobile' : Math.random() > 0.3 ? 'desktop' : 'tablet',
                os: {
                    name: ['Android', 'iOS', 'Windows'][Math.floor(Math.random() * 3)],
                    version: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
                },
                browser: {
                    name: ['chrome', 'firefox', 'safari'][Math.floor(Math.random() * 3)] as 'chrome' | 'firefox' | 'safari',
                    version: `${Math.floor(Math.random() * 100)}.0`
                }
            }
        };

        if (Math.random() > 0.1) {
            const logoutDate = new Date(loginDate.getTime() + Math.random() * 8 * 3600 * 1000);
            session.logout = {
                timestamp: Math.floor(logoutDate.getTime() / 1000),
                date: logoutDate.toLocaleDateString('fr-CI'),
                time: logoutDate.toLocaleTimeString('fr-CI', { hour: '2-digit', minute: '2-digit' }),
                reason: ['user', 'timeout', 'system'][Math.floor(Math.random() * 3)] as 'user' | 'timeout' | 'system'
            };
            session.duration = Math.floor((logoutDate.getTime() - loginDate.getTime()) / 1000);
        }

        if (session.role === 'superviseur') {
            session.customRole = ['Vendeur', 'Technicien'][Math.floor(Math.random() * 2)];
        }

        if (Math.random() > 0.5) {
            session.metadata = {
                isp: ['Orange CI', 'MTN CI'][Math.floor(Math.random() * 2)],
                vpn: Math.random() > 0.8
            };
        }

        return session;
    });
};