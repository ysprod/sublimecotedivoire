import LogoutClient from "@/components/auth/logout/LogoutClient"; 

export const metadata = {
  title: 'Déconnexion - DATAKWABA',
  description: 'Déconnexion sécurisée de votre compte DATAKWABA',
};

export default function LogoutPage() {
  return <LogoutClient />;
}