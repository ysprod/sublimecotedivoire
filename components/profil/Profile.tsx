'use client';
import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiEdit, FiTrash2, FiSave, FiX, FiUser, FiMail, FiCalendar, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Image from 'next/image';
import Loader from '../commons/Loader';

const Profile = memo(() => {
    const { isAuthenticated, user, updateUser, deleteUser, logout } = useAuth();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: ''
    });

    useEffect(() => { if (isAuthenticated === false) { router.push('/'); } }, [isAuthenticated, router]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '', email: user.email || '', birthDate: user.birthDate || ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await updateUser(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleDeleteAccount = () => {
        confirmAlert({
            title: 'Confirmer la suppression',
            message: 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
            buttons: [
                {
                    label: 'Oui',
                    onClick: async () => {
                        await deleteUser();
                        logout();
                        router.push('/');
                    }
                },
                { label: 'Non', onClick: () => { } }
            ]
        });
    };

    if (!isAuthenticated) { return <Loader />; }


    if (!user) {
        return <div className="flex justify-center items-center h-screen">Chargement...</div>;
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-4">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl  border border-gray-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Profil Utilisateur</h1>
                        {isEditing ? (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSave}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                                    title="Enregistrer"
                                >
                                    <FiSave size={20} />
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                                    title="Annuler"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                title="Modifier"
                            >
                                <FiEdit size={20} />
                            </button>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center space-x-4">

                            {user.photo ? (
                                <div className="w-8 h-8 rounded-full overflow-hidden relative">
                                    <Image
                                        src={user.photo}
                                        alt={`Photo`}
                                        width={32}
                                        height={32}
                                        className="object-cover w-full h-full"
                                        unoptimized
                                    />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                                    <FiUser size={32} />
                                </div>
                            )}

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-500">Nom</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2"
                                    />
                                ) : (
                                    <p className="mt-1 text-gray-900">{user.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-100 rounded-full text-green-600">
                                <FiMail size={24} />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-500">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2"
                                    />
                                ) : (
                                    <p className="mt-1 text-gray-900">{user.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                                <FiCalendar size={24} />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-500">Date de naissance</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2"
                                    />
                                ) : (
                                    <p className="mt-1 text-gray-900">{user.birthDate || 'Non renseignée'}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-red-100 rounded-full text-red-600">
                                <FiLock size={24} />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-500">Mot de passe</label>
                                <p className="mt-1 text-gray-900">••••••••</p>
                                {isEditing && (
                                    <button
                                        onClick={() => router.push('/change-password')}
                                        className="mt-2 text-sm text-blue-600 hover:underline"
                                    >
                                        Changer le mot de passe
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-12 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleDeleteAccount}
                            className="w-full flex justify-center items-center space-x-2 py-3 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <FiTrash2 size={18} />
                            <span>Supprimer mon compte</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
});

Profile.displayName = "Profile";

export default Profile;