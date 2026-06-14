'use client';
import { truncateEmail } from '@/libs/functions';
import { memo } from 'react';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

interface ContactInfoProps {
  telephone: string;
  email?: string;
  maxEmailLength?: number;
}

const ContactInfo = memo(({ telephone, email, maxEmailLength = 40 }: ContactInfoProps) => {

  return (
    <div className="space-y-3">

      <div className="flex items-center space-x-3">
        <FaPhone className="text-gray-400 flex-shrink-0" />
        <a href={`tel:${telephone}`} className="text-blue-600 hover:underline text-sm">
          {telephone}
        </a>
      </div>

      {email && (
        <div className="flex items-center space-x-3">
          <FaEnvelope className="text-gray-400 flex-shrink-0" />
          <a
            href={`mailto:${email}`}
            className="text-blue-600 hover:underline text-sm"
            title={email}
          >
            {truncateEmail(email, maxEmailLength)}
          </a>
        </div>
      )}
    </div>
  );
});

ContactInfo.displayName = 'ContactInfo';

export default ContactInfo;