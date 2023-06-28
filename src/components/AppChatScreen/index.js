import { View, Text, StyleSheet, FlatList, ImageBackground, ActivityIndicator } from "react-native";
import { useEffect, useState } from 'react';
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import axios from "axios";
import dayjs from "dayjs";
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

export default function AppChatScreen({ navigation, route }) {
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [novaMensagem, setNovaMensagem] = useState(''); 
  const mensagensOrdenadas = [...mensagens].sort((a, b) => {
    return new Date(a.dataHora) - new Date(b.dataHora);
  });

  useEffect(() => {
    getAllMessagesApi();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getAllMessagesApi();
      console.log('reload messsage');
    }, 10000); // Intervalo de 1 segundo (1000 milissegundos)

    return () => {
      clearInterval(intervalId); // Limpa o temporizador ao desmontar a tela
    };
  }, []);

  async function getAllMessagesApi() {
    try {
      const response = await axios.get(`http://192.168.0.184:8080/message/buscarMensagensComUmUsuario/${route.params?.meuId}/${route.params?.idUsuario}`);
      const mensagem = response.data;
      setMensagens(mensagem);
      setCarregando(false);
      console.log(mensagem);      
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage(){
    try {
      const response = await axios.post(`http://192.168.0.184:8080/message/enviarMensagem`,{
        idFrom: route.params?.meuId,
        idTo: route.params?.idUsuario,
        mensagem: novaMensagem,
      });     
      console.log(novaMensagem);
    }catch (error) {
      console.log(error);
    }  
    getAllMessagesApi();
    setNovaMensagem('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.nomeUsuarioContainer}>
        <Text style={styles.nomeContato}>
        {route.params?.nomeUsuario}
        </Text>
      </View>
      
      
      {carregando ? (
        <ActivityIndicator />
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.imageBackground}>
          <ImageBackground source={require('first_sprint/images/BG.png')} style={styles.imageBackground}>
            
            <FlatList 
                         
              keyExtractor={(mensagem) => mensagem.id}
              data={mensagensOrdenadas}
              renderItem={({ item: mensagem }) => (
                <View style={[styles.listaContainer,
                  {
                    backgroundColor: mensagem.from.id === route.params?.meuId ? '#DCF8C5' : 'white',
                    alignSelf: mensagem.from.id === route.params?.meuId ? 'flex-end' : 'flex-start',
                  }
                ]}>
                  <Text 
                  style={styles.textoMensagem}>
                    {mensagem.mensagem}
                  </Text>
                  <Text 
                  style={styles.dataMensagem}>
                    {dayjs(mensagem.dataHora).fromNow(true)}
                  </Text>
                </View>
              )}
              style={styles.listaMensagem}
            />
            <View style={styles.containerInput}>
              <TextInput
                style={styles.input}
                value={novaMensagem}
                onChangeText={setNovaMensagem}
                placeholder='type your message' />
              <MaterialIcons onPress={sendMessage} style={styles.send} name='send' size={20} color='white' />
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  imageBackground: {
    height: 792,
    width: '100%',
  },
  listaMensagem:{
    padding: 10,
  },
  listaContainer: {
    backgroundColor: 'white',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width:0,
      height:1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  textoMensagem: {

  },
  dataMensagem:{
    color: 'gray',
    alignSelf: 'flex-end'
  },
  containerInput:{
    flexDirection: 'row',
    backgroundColor: 'whitesmoke',
    padding: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input:{
    flex: 1,
    backgroundColor: 'whitesmoke',
    paddingHorizontal: 5,
  },
  send:{
    backgroundColor: 'royalblue',
    padding: 10,
    borderRadius: 30,
    overflow: 'hidden',
  },
  nomeContato: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  nomeUsuarioContainer: {
    backgroundColor: '#F6313E',
  },
});
