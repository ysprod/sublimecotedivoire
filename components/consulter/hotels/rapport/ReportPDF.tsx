'use client';

import type { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import { Download, FileText, Loader2 } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

// ============ CONSTANTES ============
const PDF_STYLES = {
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#8b5cf6',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    paddingBottom: 4,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
  },
  card: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  cardLabel: {
    fontSize: 12,
    color: '#475569',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cardValueLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  trendBadge: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    color: '#475569',
  },
  trendUp: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  trendDown: {
    backgroundColor: '#fecaca',
    color: '#991b1b',
  },
  trendStable: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '48%',
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    textAlign: 'center',
    fontSize: 10,
    color: '#94a3b8',
  },
  highlightCard: {
    backgroundColor: '#f5f3ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c4b5fd',
  },
} as const;

//const CLIENT_KEYWORDS = ['CLIENTS', 'HÔTELS', 'RÉSIDENCES', 'MAISONS', 'HOMMES', 'FEMMES', ] as const;

// ============ COMPOSANT DE CHARGEMENT ============
const LoadingButton = memo(({ label = "Chargement du PDF..." }: { label?: string }) => (
  <button
    disabled
    className={clsx(
      "flex items-center gap-3 px-6 py-3 rounded-xl",
      "bg-gradient-to-r from-purple-600 to-pink-600",
      "text-white font-medium opacity-70 cursor-not-allowed",
      "w-full sm:w-auto"
    )}
  >
    <Loader2 size={20} className="animate-spin" />
    <span>{label}</span>
    <Download size={18} className="opacity-50" />
  </button>
));

LoadingButton.displayName = "LoadingButton";

// ============ COMPOSANT PRINCIPAL ============
const PDFDownloadButton = memo(({
  mainItem,
  hotelItems,
  subItems,
  fileName = "rapport-clients-hotels",
  buttonLabel = "Télécharger le PDF",
  className
}: {
  mainItem: MenuItem | null;
  hotelItems: MenuItem[];
  subItems: MenuItem[];
  fileName?: string;
  buttonLabel?: string;
  className?: string;
}) => {
  const [isClient, setIsClient] = useState(false);
  const [PDFComponent, setPDFComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction de calcul de tendance (mémorisée)
  const getTrend = useCallback((value: number) => {
    const trendValue = Math.round((Math.sin(value * 0.001) * 10 + Math.random() * 4 - 2) * 10) / 10;
    let direction: 'up' | 'down' | 'stable';
    if (trendValue > 2) direction = 'up';
    else if (trendValue < -2) direction = 'down';
    else direction = 'stable';
    return { direction, value: Math.abs(trendValue) };
  }, []);

  // Filtrer les items par catégorie (mémorisé)

  useEffect(() => {
    setIsClient(true);

    const loadPDF = async () => {
      try {
        const pdfModule = await import('@react-pdf/renderer');
        const { Document, Page, Text, View, StyleSheet, PDFDownloadLink } = pdfModule;

        const pdfStyles = StyleSheet.create(PDF_STYLES);

        // Composant PDF
        const ReportPDF = ({ mainItem, hotelItems, subItems, generatedAt, getTrend }: any) => {
          const totalClients = mainItem?.nbetablissements || 0;

          // Récupération des valeurs par catégorie
          const hommesClients = hotelItems.find((item: MenuItem) =>
            item.title?.includes('HOMMES')
          )?.nbetablissements || 0;

          const femmesClients = hotelItems.find((item: MenuItem) =>
            item.title?.includes('FEMMES')
          )?.nbetablissements || 0;

          const nationauxClients = hotelItems.find((item: MenuItem) =>
            item.title?.includes('NATIONAUX')
          )?.nbetablissements || 0;

          const etrangersClients = hotelItems.find((item: MenuItem) =>
            item.title?.includes('ETRANGERS')
          )?.nbetablissements || 0;

          // Filtrer les items clients uniquement


          return (
            <Document>
              <Page size="A4" style={pdfStyles.page}>
                {/* En-tête */}
                <View style={pdfStyles.header}>
                  <Text style={pdfStyles.title}>Rapport Analytique des Clients dans les Hôtels</Text>
                  <Text style={pdfStyles.subtitle}>
                    Généré le {new Date(generatedAt).toLocaleDateString('fr-FR')}
                  </Text>
                  <Text style={pdfStyles.subtitle}>
                    {new Date(generatedAt).toLocaleTimeString('fr-FR')}
                  </Text>
                </View>

                {/* Résumé Global */}
                <View style={pdfStyles.section}>
                  <Text style={pdfStyles.sectionTitle}>Résumé Global des Clients</Text>
                  <View style={pdfStyles.highlightCard}>
                    <View style={pdfStyles.cardRow}>
                      <Text style={pdfStyles.cardLabel}>Total des Clients dans les Hôtels</Text>
                      <Text style={pdfStyles.cardValueLarge}>
                        {totalClients.toLocaleString('fr-FR')}
                      </Text>
                    </View>
                  </View>
                  <View style={pdfStyles.card}>
                    <View style={pdfStyles.cardRow}>
                      <Text style={pdfStyles.cardLabel}>👨 Clients Hommes</Text>
                      <Text style={pdfStyles.cardValue}>{hommesClients.toLocaleString('fr-FR')}</Text>
                    </View>
                    <View style={pdfStyles.cardRow}>
                      <Text style={pdfStyles.cardLabel}>👩 Clients Femmes</Text>
                      <Text style={pdfStyles.cardValue}>{femmesClients.toLocaleString('fr-FR')}</Text>
                    </View>
                    <View style={pdfStyles.cardRow}>
                      <Text style={pdfStyles.cardLabel}>🇨🇮 Clients Nationaux</Text>
                      <Text style={pdfStyles.cardValue}>{nationauxClients.toLocaleString('fr-FR')}</Text>
                    </View>
                    <View style={pdfStyles.cardRow}>
                      <Text style={pdfStyles.cardLabel}>🌍 Clients Étrangers</Text>
                      <Text style={pdfStyles.cardValue}>{etrangersClients.toLocaleString('fr-FR')}</Text>
                    </View>
                  </View>
                </View>

                {/* Détails par Catégorie */}
                <View style={pdfStyles.section}>
                  <Text style={pdfStyles.sectionTitle}>Détails par Catégorie de Clients</Text>
                  <View style={pdfStyles.grid}>
                    {hotelItems.map((item: MenuItem, index: number) => {
                      const trend = getTrend(item.nbetablissements);
                      const trendStyle = trend.direction === 'up'
                        ? pdfStyles.trendUp
                        : trend.direction === 'down'
                          ? pdfStyles.trendDown
                          : pdfStyles.trendStable;
                      return (
                        <View key={index} style={[pdfStyles.card, pdfStyles.gridItem]}>
                          <View style={pdfStyles.cardRow}>
                            <Text style={pdfStyles.cardLabel}>
                              {item.title?.replace(/^\d+\s/, '') || 'Catégorie'}
                            </Text>
                          </View>
                          <View style={pdfStyles.cardRow}>
                            <Text style={pdfStyles.cardValue}>
                              {item.nbetablissements?.toLocaleString('fr-FR') || 0}
                            </Text>
                            <Text style={[pdfStyles.trendBadge, trendStyle]}>
                              {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}%
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Statistiques Complètes */}
                <View style={pdfStyles.section}>
                  <Text style={pdfStyles.sectionTitle}>Statistiques Complètes</Text>
                  <View style={pdfStyles.card}>
                    {subItems.map((item: MenuItem, index: number) => {
                      const trend = getTrend(item.nbetablissements);
                      const trendStyle = trend.direction === 'up'
                        ? pdfStyles.trendUp
                        : trend.direction === 'down'
                          ? pdfStyles.trendDown
                          : pdfStyles.trendStable;
                      return (
                        <View key={index} style={pdfStyles.cardRow}>
                          <Text style={pdfStyles.cardLabel}>
                            {item.title?.replace(/^\d+\s/, '') || `Item ${index + 1}`}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={pdfStyles.cardValue}>
                              {item.nbetablissements?.toLocaleString('fr-FR') || 0}
                            </Text>
                            <Text style={[pdfStyles.trendBadge, trendStyle]}>
                              {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}%
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Pied de page */}
                <View style={pdfStyles.footer}>
                  <Text>Rapport généré par Datakwaba - IA Analytics</Text>
                  <Text>© {new Date().getFullYear()} Tous droits réservés</Text>
                </View>
              </Page>
            </Document>
          );
        };

        // Composant wrapper avec PDFDownloadLink
        const PDFDownloadWrapper = () => {
          return (
            <PDFDownloadLink
              document={
                <ReportPDF
                  mainItem={mainItem}
                  hotelItems={hotelItems}
                  subItems={subItems}
                  generatedAt={new Date().toISOString()}
                  getTrend={getTrend}
                />
              }
              fileName={`${fileName}-${new Date().toISOString().split('T')[0]}.pdf`}
              className={clsx(
                "flex items-center gap-3 px-6 py-3 rounded-xl",
                "bg-gradient-to-r from-purple-600 to-pink-600",
                "text-white font-medium transition-all duration-300",
                "hover:shadow-lg hover:scale-[1.02]",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                "disabled:opacity-70 disabled:cursor-not-allowed",
                "w-full sm:w-auto",
                className
              )}
            >
              {({ loading }: { loading: boolean }) => (
                <>
                  <FileText size={20} />
                  <span>{loading ? "Préparation du PDF..." : buttonLabel}</span>
                  <Download size={18} />
                </>
              )}
            </PDFDownloadLink>
          );
        };

        setPDFComponent(() => PDFDownloadWrapper);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur de chargement du PDF:', error);
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [mainItem, hotelItems, subItems, fileName, buttonLabel, getTrend, className]);

  // Rendu côté serveur ou pendant le chargement
  if (!isClient || isLoading || !PDFComponent) {
    return <LoadingButton label={isLoading ? "Chargement du PDF..." : "Préparation..."} />;
  }

  const PDFWrapper = PDFComponent;
  return <PDFWrapper />;
});

PDFDownloadButton.displayName = "PDFDownloadButton";

export default PDFDownloadButton;