import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './analysis-pdf.styles';
 

const PageFooter: React.FC<{ pageNumber?: number }> = ({ pageNumber }) => (
  <View style={styles.footer}>
    <Text>DATAKWABA</Text>
    {pageNumber && <Text>Page {pageNumber}</Text>}
  </View>
);

export default PageFooter;