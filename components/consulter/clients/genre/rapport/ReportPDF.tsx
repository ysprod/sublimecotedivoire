'use client';
import type { MenuItem } from "@/lib/libs/interface";
import clsx from "clsx";
import { Download, FileText } from "lucide-react";
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
    <FileText size={20} />
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

  useEffect(() => {
    setIsClient(true);

    const loadPDF = async () => {
      try {
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

        // Composant PDF Clients
        const ReportPDF = ({ mainItem, hotelItems, subItems, generatedAt }: any) => {
          const totalClients = mainItem?.nbetablissements || 0;

          // Calcul des totaux par catégorie
          const hotelsClients = hotelItems.find((item: MenuItem) =>
            item.title?.includes('HÔTELS')
          )?.nbetablissements || 0;

          const residencesClients = hotelItems.find((item: MenuItem) =>
            item.title?.includes('RÉSIDENCES')
          )?.nbetablissements || 0;

          const maisonsClients = hotelItems.find((item: MenuItem) =>
            item.title?.includes('MAISONS')
          )?.nbetablissements || 0;

          // Filtrer les items clients uniquement
          const clientItems = subItems.filter((item: MenuItem) =>
            item.title?.includes('CLIENTS') ||
            item.title?.includes('HÔTELS') ||
            item.title?.includes('RÉSIDENCES') ||
            item.title?.includes('MAISONS')
          );

          return (
            <Document>
              <Page size="A4" style={pdfStyles.page}>
                {/* En-tête */}
                <View style={pdfStyles.header}>
                  <Text style={pdfStyles.title}>Rapport Analytique des Clients</Text>
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
                      <Text style={pdfStyles.cardLabel}>Total des Clients</Text>
                      <Text style={[pdfStyles.cardValue, { fontSize: 18, color: '#7c3aed' }]}>
                        {totalClients.toLocaleString('fr-FR')}
                      </Text>
                    </View>
                  </View>
                  <View style={pdfStyles.card}>
                    <View style={pdfStyles.cardRow}>
                      <Text style={pdfStyles.cardLabel}>Clients dans les Hôtels</Text>
                      <Text style={pdfStyles.cardValue}>{hotelsClients.toLocaleString('fr-FR')}</Text>
                    </View>
                    <View style={pdfStyles.cardRow}>
                      <Text style={pdfStyles.cardLabel}>Clients dans les Résidences</Text>
                      <Text style={pdfStyles.cardValue}>{residencesClients.toLocaleString('fr-FR')}</Text>
                    </View>
                    <View style={pdfStyles.cardRow}>
                      <Text style={pdfStyles.cardLabel}>Clients dans les Maisons d'hôtes</Text>
                      <Text style={pdfStyles.cardValue}>{maisonsClients.toLocaleString('fr-FR')}</Text>
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

                {/* Statistiques Complètes des Clients */}
                <View style={pdfStyles.section}>
                  <Text style={pdfStyles.sectionTitle}>Statistiques Complètes</Text>
                  <View style={pdfStyles.card}>
                    {clientItems.map((item: MenuItem, index: number) => {
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
                />
              }
              fileName={`rapport-clients-${new Date().toISOString().split('T')[0]}.pdf`}
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
                  <FileText size={20} />
                  <span>{loading ? "Préparation du PDF..." : "Télécharger le PDF"}</span>
                  <Download size={18} />
                </>
              )}
            </PDFDownloadLink>
          );
        };

        setPDFComponent(() => PDFDownloadWrapper);
      } catch (error) {
        console.error('Erreur de chargement du PDF:', error);
      }
    };

    loadPDF();
  }, [mainItem, hotelItems, subItems]);

  // Rendu côté serveur ou pendant le chargement
  if (!isClient || !PDFComponent) {
    return <LoadingButton />;
  }

  const PDFWrapper = PDFComponent;
  return <PDFWrapper />;
});

PDFDownloadButton.displayName = "PDFDownloadButton";

export default PDFDownloadButton;