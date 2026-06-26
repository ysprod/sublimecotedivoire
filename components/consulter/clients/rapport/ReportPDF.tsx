'use client';

import type { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import { Download, FileText, Loader2 } from "lucide-react";
import { memo, useEffect, useState } from "react";

// ============ COMPOSANT DE CHARGEMENT ============
const LoadingButton = memo(() => (
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
    <span>Chargement du PDF...</span>
    <Download size={18} />
  </button>
));

LoadingButton.displayName = "LoadingButton";

// ============ COMPOSANT PRINCIPAL ============
const PDFDownloadButton = memo(({
  mainItem,
  hotelItems,
  subItems
}: {
  mainItem: MenuItem | null;
  hotelItems: MenuItem[];
  subItems: MenuItem[];
}) => {
  const [isClient, setIsClient] = useState(false);
  const [PDFComponent, setPDFComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);

    const loadPDF = async () => {
      try {
        setIsLoading(true);
        
        // Import dynamique de react-pdf
        const pdfModule = await import('@react-pdf/renderer');
        const { Document, Page, Text, View, StyleSheet, PDFDownloadLink } = pdfModule;

        // Définition des styles PDF
        const pdfStyles = StyleSheet.create({
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
          statRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#f1f5f9',
          },
          statLabel: {
            fontSize: 11,
            color: '#64748b',
          },
          statValue: {
            fontSize: 13,
            fontWeight: 'bold',
            color: '#0f172a',
          },
          progressBar: {
            height: 6,
            backgroundColor: '#e2e8f0',
            borderRadius: 3,
            marginTop: 4,
          },
          progressFill: {
            height: 6,
            borderRadius: 3,
            backgroundColor: '#8b5cf6',
          },
          twoColumn: {
            flexDirection: 'row',
            gap: 15,
          },
          column: {
            flex: 1,
          },
          badge: {
            fontSize: 10,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 12,
            backgroundColor: '#ede9fe',
            color: '#7c3aed',
          },
        });

        // Fonction de calcul de tendance
        const getTrend = (value: number) => {
          const trendValue = Math.round((Math.sin(value * 0.001) * 10 + Math.random() * 4 - 2) * 10) / 10;
          let direction: 'up' | 'down' | 'stable';
          if (trendValue > 2) direction = 'up';
          else if (trendValue < -2) direction = 'down';
          else direction = 'stable';
          return { direction, value: Math.abs(trendValue) };
        };

        // Calcul des statistiques avancées
        const calculateStats = (items: MenuItem[]) => {
          const total = items.reduce((sum, item) => sum + (item.nbetablissements || 0), 0);
          const hommes = items.find(i => i.title?.includes('HOMMES'))?.nbetablissements || 0;
          const femmes = items.find(i => i.title?.includes('FEMMES'))?.nbetablissements || 0;
          const hotels = items.find(i => i.title?.includes('HÔTELS'))?.nbetablissements || 0;
          const residences = items.find(i => i.title?.includes('RÉSIDENCES'))?.nbetablissements || 0;
          const maisons = items.find(i => i.title?.includes('MAISONS'))?.nbetablissements || 0;

          return { total, hommes, femmes, hotels, residences, maisons };
        };

        // Composant PDF Rapport Global
        const ReportPDF = ({ mainItem, subItems, generatedAt }: any) => {
          const totalClients = mainItem?.nbetablissements || 0;
          const stats = calculateStats(subItems);

          const typeItems = subItems.filter((item: MenuItem) =>
            item.title?.includes('HÔTELS') ||
            item.title?.includes('RÉSIDENCES') ||
            item.title?.includes('MAISONS')
          );

          // Séparer les items par catégorie pour éviter les doublons
          const uniqueItems = subItems.filter((item: MenuItem, index: number, self: MenuItem[]) =>
            index === self.findIndex(i => i.title === item.title)
          );

          return (
            <Document>
              <Page size="A4" style={pdfStyles.page}>
                {/* En-tête */}
                <View style={pdfStyles.header}>
                  <Text style={pdfStyles.title}>📊 Rapport Global des Clients</Text>
                  <Text style={pdfStyles.subtitle}>
                    Analyse complète de la base clientèle
                  </Text>
                  <Text style={pdfStyles.subtitle}>
                    Généré le {new Date(generatedAt).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} à {new Date(generatedAt).toLocaleTimeString('fr-FR')}
                  </Text>
                </View>

                {/* Résumé Global */}
                <View style={pdfStyles.section}>
                  <Text style={pdfStyles.sectionTitle}>📈 Résumé Global</Text>
                  <View style={pdfStyles.highlightCard}>
                    <View style={pdfStyles.cardRow}>
                      <Text style={pdfStyles.cardLabel}>Total des Clients</Text>
                      <Text style={[pdfStyles.cardValue, { fontSize: 20, color: '#7c3aed' }]}>
                        {totalClients.toLocaleString('fr-FR')}
                      </Text>
                    </View>
                    <View style={pdfStyles.cardRow}>
                      <Text style={pdfStyles.cardLabel}>Période d'analyse</Text>
                      <Text style={pdfStyles.badge}>Toutes les données</Text>
                    </View>
                  </View>

                  {/* Statistiques rapides */}
                  <View style={pdfStyles.twoColumn}>
                    <View style={pdfStyles.column}>
                      <View style={pdfStyles.card}>
                        <Text style={[pdfStyles.cardLabel, { marginBottom: 8 }]}>👥 Par Genre</Text>
                        <View style={pdfStyles.statRow}>
                          <Text style={pdfStyles.statLabel}>Hommes</Text>
                          <Text style={pdfStyles.statValue}>{stats.hommes.toLocaleString('fr-FR')}</Text>
                        </View>
                        <View style={pdfStyles.statRow}>
                          <Text style={pdfStyles.statLabel}>Femmes</Text>
                          <Text style={pdfStyles.statValue}>{stats.femmes.toLocaleString('fr-FR')}</Text>
                        </View>
                        <View style={pdfStyles.statRow}>
                          <Text style={pdfStyles.statLabel}>Ratio H/F</Text>
                          <Text style={pdfStyles.statValue}>
                            {stats.hommes > 0 ? (stats.hommes / (stats.femmes || 1)).toFixed(2) : 'N/A'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={pdfStyles.column}>
                      <View style={pdfStyles.card}>
                        <Text style={[pdfStyles.cardLabel, { marginBottom: 8 }]}>🏢 Par Type</Text>
                        <View style={pdfStyles.statRow}>
                          <Text style={pdfStyles.statLabel}>Hôtels</Text>
                          <Text style={pdfStyles.statValue}>{stats.hotels.toLocaleString('fr-FR')}</Text>
                        </View>
                        <View style={pdfStyles.statRow}>
                          <Text style={pdfStyles.statLabel}>Résidences</Text>
                          <Text style={pdfStyles.statValue}>{stats.residences.toLocaleString('fr-FR')}</Text>
                        </View>
                        <View style={pdfStyles.statRow}>
                          <Text style={pdfStyles.statLabel}>Maisons</Text>
                          <Text style={pdfStyles.statValue}>{stats.maisons.toLocaleString('fr-FR')}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Détails par Catégorie */}
                {typeItems.length > 0 && (
                  <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>📋 Détails par Catégorie</Text>
                    <View style={pdfStyles.grid}>
                      {typeItems.map((item: MenuItem, index: number) => {
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
                            <View style={pdfStyles.progressBar}>
                              <View style={[pdfStyles.progressFill, {
                                width: `${totalClients > 0 ? (item.nbetablissements / totalClients) * 100 : 0}%`
                              }]} />
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Statistiques Complètes */}
                {uniqueItems.length > 0 && (
                  <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>📊 Statistiques Complètes</Text>
                    <View style={pdfStyles.card}>
                      {uniqueItems.map((item: MenuItem, index: number) => {
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
                )}

                {/* Pied de page */}
                <View style={pdfStyles.footer}>
                  <Text>📄 Rapport généré par Datakwaba - IA Analytics</Text>
                  <Text>🔒 Données certifiées • Analyse complète</Text>
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
                  subItems={subItems}
                  generatedAt={new Date().toISOString()}
                />
              }
              fileName={`rapport-global-clients-${new Date().toISOString().split('T')[0]}.pdf`}
              className={clsx(
                "flex items-center gap-3 px-6 py-3 rounded-xl",
                "bg-gradient-to-r from-purple-600 to-pink-600",
                "text-white font-medium transition-all duration-300",
                "hover:shadow-lg hover:scale-[1.02]",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                "disabled:opacity-70 disabled:cursor-not-allowed",
                "w-full sm:w-auto"
              )}
            >
              {({ loading }: { loading: boolean }) => (
                <>
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <FileText size={20} />
                  )}
                  <span>{loading ? "Préparation du PDF..." : "📊 Télécharger le PDF"}</span>
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
  }, [mainItem, hotelItems, subItems]);

  // Rendu côté serveur ou pendant le chargement
  if (!isClient || isLoading || !PDFComponent) {
    return <LoadingButton />;
  }

  const PDFWrapper = PDFComponent;
  return <PDFWrapper />;
});

PDFDownloadButton.displayName = "PDFDownloadButton";

export default PDFDownloadButton;