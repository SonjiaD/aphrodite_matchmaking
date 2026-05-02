import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';

interface OverlayCtx {
  present: (node: ReactNode) => void;
  dismiss: () => void;
}

const OverlayContext = createContext<OverlayCtx>({ present: () => {}, dismiss: () => {} });

export const useOverlay = () => useContext(OverlayContext);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null);

  const present = useCallback((node: ReactNode) => setContent(node), []);
  const dismiss = useCallback(() => setContent(null), []);

  return (
    <OverlayContext.Provider value={{ present, dismiss }}>
      <View style={styles.root}>
        {children}
        {content != null && (
          <View style={StyleSheet.absoluteFillObject}>{content}</View>
        )}
      </View>
    </OverlayContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
