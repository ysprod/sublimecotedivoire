'use client';
import { FiClock, FiCalendar, FiMapPin, FiHardDrive, FiLogOut, FiInfo } from 'react-icons/fi';
import { ConnexionHistory } from '@/libs/interface';
import { memo } from 'react';

const InfoConnexion = memo(({ history }: { history: ConnexionHistory }) => (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <FiClock className="text-blue-500 flex-shrink-0" />
                <span>Connexion</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <FiCalendar className="text-gray-500 flex-shrink-0" />
                <span>
                    {history.login.date} à {history.login.time}
                </span>
            </div>
            {history.duration && (
                <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <FiInfo className="flex-shrink-0" />
                    <span>Durée: {Math.floor(history.duration / 3600)}h {Math.floor((history.duration % 3600) / 60)}m</span>
                </div>
            )}
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <FiLogOut className="text-blue-500 flex-shrink-0" />
                <span>Déconnexion</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <FiCalendar className="text-gray-500 flex-shrink-0" />
                <span>
                    {history.logout ? (`${history.logout.date} à ${history.logout.time}`
                    ) : (<span className="text-amber-600">En cours...</span>)}
                </span>
            </div>

            {history.logout?.reason && (
                <div className="mt-1 text-xs text-gray-500">
                    Raison: {history.logout.reason === 'user' ? 'Utilisateur' :
                        history.logout.reason === 'timeout' ? 'Inactivité' : 'Système'}
                </div>
            )}
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <FiMapPin className="text-blue-500 flex-shrink-0" />
                <span>Localisation</span>
            </div>
            <div className="text-sm font-medium text-gray-800">
                {history.login.location?.city || 'Ville inconnue'}
                {history.login.location?.country && (
                    <span className="text-xs text-gray-500 ml-1">({history.login.location.country})</span>
                )}
            </div>

            {history.login.location?.coordinates && (
                <div className="mt-1 text-xs text-gray-500">
                    GPS: {history.login.location.coordinates[0].toFixed(4)}, {history.login.location.coordinates[1].toFixed(4)}
                </div>
            )}
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <FiHardDrive className="text-blue-500 flex-shrink-0" />
                <span>Appareil</span>
            </div>
            <div className="text-sm font-medium text-gray-800 capitalize">
                {history.device.type === 'mobile' ? 'Mobile' :
                    history.device.type === 'desktop' ? 'Ordinateur' :
                        history.device.type === 'tablet' ? 'Tablette' : 'Inconnu'}
            </div>
            <div className="mt-1 text-xs text-gray-500">
                {history.device.os.name} {history.device.os.version} • {history.device.browser.name} {history.device.browser.version}
            </div>
        </div>
    </div>
));

InfoConnexion.displayName = 'InfoConnexion';

export default InfoConnexion;