import { View, Text, StyleSheet, Pressable, ScrollView, FlatList, Image, ActivityIndicator, TouchableOpacity} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import axios from "axios";

export default function AppContatos({navigation,route}){
  const [usuariosCadastrados, setUsuariosCadastrados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [meuTelefone, setMeuTelefone] = useState('');
  const [meuIdApi, setMeuIdApi] = useState('');

  function meuTelefoneChanged(meuTelefone){
    setMeuTelefone(meuTelefone);
  }

  function meuIdApiChanged(meuIdApi){
    setMeuIdApi(meuIdApi)
  }
  
  async function getAllUsersApi() {
    try{
      const response = await axios.get(`http://192.168.0.184:8080/message/buscarUsuarios/${route.params?.telefone}`)
      const usuario =  (response.data);
      setUsuariosCadastrados(usuario);
      console.log(usuariosCadastrados);
      setCarregando(false);
    }catch(error){
        console.log(error);
    }       
  }

  useEffect(() => {
    meuTelefoneChanged(route.params?.telefoneChat);
    meuIdApiChanged(route.params?.meuId);
    getAllUsersApi(); 
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      //getAllUsersApi();
      //console.log('reload c');
    }, 10000); // Intervalo de 1 segundo (60000 milissegundos)

    return () => {
      clearInterval(intervalId); // Limpa o temporizador ao desmontar a tela
    };
  }, []);

  return (
    <View>
      <View style={styles.tituloContainer}>
        <Text style={styles.tituloContatos}>Contatos</Text>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#F6313E"
        style={styles.loading} />
      ) : (
        <ScrollView style={styles.conteudoPrincipal}>
          <FlatList
            keyExtractor={(usuario) => usuario.nome}
            data={usuariosCadastrados}
            renderItem={({ item: usuario }) => (
              <>
                <Pressable onPress={() => navigation.navigate("AppChatScreen", {idUsuario: usuario.id, meuId: route.params?.meuId, nomeUsuario: usuario.nome})} style={styles.container}>
                  {usuario.avatar && (
                    <Image source={{ uri: `data:image/png;base64,${usuario.avatar}` }} style={styles.imagemUsuario} />
                  )}
                  <Text
                  style={styles.nome}
                  >
                    {usuario.nome}
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
        onPress={() => navigation.navigate("AppNovoContato")}
      >
        <MaterialCommunityIcons
        name="chat-plus" size={50} color="black"
        style={styles.newChat}
        />
        
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
  loading:{
    marginTop: 425,
  },
  imagemUsuario:{
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
  tituloContainer:{
    backgroundColor: '#F6313E',  
    marginBottom: 15,
  },
  tituloContatos: {
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 10,
  },
  newChat: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  conteudoPrincipal: {
    height: 706,
  },
})