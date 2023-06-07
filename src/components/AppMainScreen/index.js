import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Image} from "react-native";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from 'react';


export default function AppMainScreen(){
    const [items, setItems] = useState([]);
    
    function itemsChanged(items){
        setItems(items)
      }

    async function getItems() {
        return AsyncStorage.getItem('items')
          .then(response => {
            if (response) 
              return Promise.resolve(JSON.parse(response));
            else 
              return Promise.resolve([]);
          })
      }
    
    useEffect(() => {
        getItems().then(items => setItems(items));
    });

    return (
        <View style={styles.container}>
            <Text>AppMainScreen</Text>

            <ScrollView>
                <FlatList
                    keyExtractor={(item) => item.nomeUsuario} 
                    data={items}
                    renderItem={({item}) => (                    
                        <View style={styles.listaContatos}>
                            <Text
                                 
                                style={styles.textoContatos}                   
                            >
                            {<Image source={{ uri: item.fotoUsuario }} />}
                            {item.nomeUsuario}         {item.telefoneUsuario}
                            </Text>
                        </View>
                        
                    )}
                    
                />
            </ScrollView>

        </View>
    )    
}

const styles = StyleSheet.create({
  container: {

  },
});
