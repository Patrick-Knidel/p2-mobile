import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Pressable } from "react-native";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from 'react';
import { Ionicons  } from '@expo/vector-icons';
import axios from "axios";

export default function AppMainScreen({ navigation, route }) {
  const [items, setItems] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [usuariosComConversa, setUsuariosComConversa] = useState([]);
  const [meuTelefone, setMeuTelefone] = useState(route.params?.telefoneChat);
  const [meuIdApi, setMeuIdApi] = useState(route.params?.meuId);
  
  function itemsChanged(items) {
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

  async function getChatUsers() {
    try {
      const response = await axios.get(`http://192.168.0.184:8080/message/buscarUsuariosComConversa/${route.params?.meuId}`)
      const usuario = (response.data);
      setCarregando(false);
      setUsuariosComConversa(usuario);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect (() => {
    getChatUsers();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getChatUsers();
    }, 10000); // Intervalo de 1 segundo (1000 milissegundos)

    return () => {
      clearInterval(intervalId); // Limpa o temporizador ao desmontar a tela
    };
  }, []);

  return (
    <View>

      <ScrollView
      style={styles.header}>
        <FlatList
          keyExtractor={(item) => item.nomeUsuario}
          data={items}
          renderItem={({ item }) => (
            <View style={styles.listaContatos}>
              {item.fotoUsuario && (
                <Image source={{ uri: `data:image/jpeg;base64,${item.fotoUsuario}` }} style={styles.imagemUsuario} />
              )}
            </View>
          )}
        />
      </ScrollView>

      {carregando ? (
        <ActivityIndicator size="large" color="#F6313E"
          style={styles.loading} />
      ) : (
        <ScrollView 
        style={styles.conteudoPrincipal}>
          <FlatList
            keyExtractor={(usuario) => usuario.nome}
            data={usuariosComConversa}
            renderItem={({ item: usuario }) => (
              <>
                <Pressable onPress={() => navigation.navigate("AppChatScreen", { idUsuario: usuario.id, meuId: route.params?.meuId, nomeUsuario: usuario.nome }) } style={styles.container}>
                  {usuario.avatar && (
                    <Image source={{ uri: `data:image/png;base64,${usuario.avatar}` }} style={styles.usuarioImagem} />
                  )}
                  <Text
                    style={styles.nome}
                  >
                    {usuario.id === route.params?.meuId ? "Eu" : usuario.nome}
                  </Text>

                  <Text
                    style={styles.telefone}
                  >
                    {usuario.telefone}
                  </Text>
                </Pressable>
              </>
            )}
          />
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("AppContatos", { telefone: meuTelefone, meuId: meuIdApi })}
      >
        <Ionicons name="chatbubbles" size={50} color="black" style={styles.newChat} />
      </TouchableOpacity>


    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  header: {
    backgroundColor: '#F6313E',
    marginBottom: 15,
  },  
  imagemUsuario: {
    width: 75,
    height: 75,
    borderRadius: 15,
    marginTop: 25,
    marginLeft: 10,
    marginBottom: 20,
  },
  newChat: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  usuarioImagem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  nome: {
    flex: 1,
    fontWeight: 'bold',
  },
  telefone:{
    marginRight: 10,
    color: 'gray', 
  },
  conteudoPrincipal: {
    height: 645,
  },
});
