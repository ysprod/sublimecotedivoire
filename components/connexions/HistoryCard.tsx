'use client';
import { FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ConnexionHistory } from '@/lib/libs/interface';
import Image from 'next/image';
import { memo } from 'react';
import InfoConnexion from './InfoConnexion';

const HistoryCard = memo(({ history }: { history: ConnexionHistory }) => (
  <div className="w-full flex justify-center items-center m-1">
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-300 overflow-hidden group"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
            {history.userImage ? (
              <Image src={history.userImage} alt={`Photo de ${history.userName}`}
                width={56} height={56} className="object-cover"
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-full w-full flex items-center justify-center">
                <FiUser className="text-blue-500 text-xl" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 truncate text-lg">{history.userName}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{history.email}</p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${history.status === 'succes'
                ? 'bg-green-100 text-green-800'
                : history.status === 'expiré' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                {history.status === 'succes' ? 'Actif' : history.status === 'expiré' ? 'Expiré' : 'Échec'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`text-xs px-2.5 py-1 rounded-full ${history.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                history.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                  history.role === 'agent' ? 'bg-cyan-100 text-cyan-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                {history.role === 'superviseur' ? history.customRole : history.role}
              </span>
              <span className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                ID: {history.userId}
              </span>
            </div>
          </div>
        </div>

        <InfoConnexion history={history} />
        {history.metadata && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {history.metadata.isp && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                  FAI: {history.metadata.isp}
                </span>
              )}
              {history.metadata.vpn && (
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                  VPN
                </span>
              )}
              {history.metadata.proxy && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
                  Proxy
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  </div>
));

HistoryCard.displayName = 'HistoryCard';

export default HistoryCard;