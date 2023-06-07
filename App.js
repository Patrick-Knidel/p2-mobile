import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppTab from './src/components/AppTab';

const statusBar = StatusBar.currentHeight ? StatusBar.currentHeight + 0 : 64;

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer >
        <AppTab />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: statusBar,
    backgroundColor: '#F6313E',
    width: 412,
    height: 870,
  },
});
