import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import api from "../service";

const schema = yup.object({
  phone: yup.string().required("Enter your phone number"),
  password: yup.string().required("Enter your password")
})

export default function AppLogin({navigation}) {

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [telefone, setTelefoneUsuario] = useState('');
  const [senha, setSenhaUsuario] = useState('');
  const [usuario, setUsuario] = useState('');
  const [userTelefone, setUserTelefone] = useState('');
  const [userSenha, setUserSenha] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  

  useEffect(() => {
    //clearAsyncStorage()
    getData().then(() => {
      getUser().then(() => {
        setUserDataLoaded(true);
      });
    });
  }, []);

  useEffect(() => {
    if (userDataLoaded) {
      authUser();
    }else{
      setLoading(false)
    }
  }, [userDataLoaded]);
 

  function telefoneUsuarioChanged(telefone){
    setTelefoneUsuario(telefone)
  }

  function senhaUsuarioChanged(senha){
    setSenhaUsuario(senha)       
  }   
  
  getData = () => {
    try {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('items')
        .then((usuario) => {
          const usuarios = JSON.parse(usuario);
          const primeiroObjeto = usuarios[0];
          if (usuarios !== null) {
            setUserSenha(primeiroObjeto.senhaUsuario);
            setUserTelefone(primeiroObjeto.telefoneUsuario);
          }
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
  };

  async function clearAsyncStorage() {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully.');
    } catch (error) {
      console.log('Failed to clear AsyncStorage:', error);
    }
  }

  async function getUser() {
    try{
      const response = await api.get(`http://192.168.0.184:8080/user/${userTelefone}/${userSenha}`)
      const usuario =  (response.data);
      setUsuario(usuario);
      setUserId(usuario.id);
      console.log(usuario.id)
    }catch(error){
        console.log(error);
    }       
  }

  async function getUserApi() {
    try{
      const response = await api.get(`http://192.168.0.184:8080/user/${telefone}/${senha}`)
      const usuario =  (response.data);
      setUsuario(usuario);
      setUserId(usuario.id);
      console.log(usuario.id)
    }catch(error){
        console.log(error);
    }       
  }

  async function authUser(){
    try {
      const response = await api.get(`http://192.168.0.184:8080/user/${userTelefone}/${userSenha}`);
      const usuario = response.data;
      setUsuario(usuario);
      console.log(usuario.id);
  
      if (userTelefone === usuario.telefone && userSenha === usuario.senha) {
        console.log(userTelefone);
        console.log(userId);
        navigation.navigate("AppMainScreen", {telefoneChat: userTelefone, meuId: usuario.id});
      } else {
        console.log("Authentication failed");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async function handleSignIn() {
    try{
      await getUserApi()       
      if(telefone === usuario.telefone && senha === usuario.senha){
        console.log("Success Sign In")
        navigation.navigate("AppMainScreen", {telefoneChat: userTelefone, meuId: userId})
      }else{
        Alert.alert("Invalid Login", "User phone or password is incorrect",[
          {
            text:"OK",
          },
        ])
      }
    }catch(error){
      console.log(error);
    }    
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#F6313E"
          style={styles.loading}  
        />
      </View>
    );
  }else{
    return (
      <View style={styles.container}>
  
        <View style={styles.titulo}>
          <Text style={styles.tituloTexto}>FEMASS CHAT</Text>
        </View>
  
        <View style={styles.imagemLogin}>
          <Image
            source={require('first_sprint/images/login.png')}
          />
        </View>
  
        <View style={styles.login}>
          <Text style={styles.loginTexto}>Login</Text>
        </View>
  
        <View style={styles.loginForm}>
  
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.loginInput, {
                  borderWidth: errors.email && 1,
                  borderColor: errors.email && '#FF375B',
                  borderRadius: errors.email && 10,
                  borderWidth: 1,
                  borderColor: '#000000',
                  borderRadius: 5,
                }]}
                onChangeText={telefoneUsuarioChanged}
                onBlur={onBlur}
                value={value}
                placeholder="Enter your phone number"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && <Text style={styles.labelError}>{errors.email?.message}</Text>}
  
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.loginInput, {
                  borderWidth: errors.password && 1, 
                  borderColor: errors.password && '#FF375B',
                  borderRadius: errors.password && 10,
                  borderWidth: 1,
                  borderColor: '#000000',
                  borderRadius: 5,
                }]}
                onChangeText={senhaUsuarioChanged}
                onBlur={onBlur}
                value={value}
                placeholder="Enter your password"
                autoCapitalize="none"
                secureTextEntry={true}
              />
            )}
          />
          {errors.password && <Text style={styles.labelError}>{errors.password?.message}</Text>}
  
          <View style={styles.account}>
          <Text style={styles.accountTexto}>Don't have an account?</Text>
          </View>
          <TouchableOpacity 
            style={styles.signUp} 
            onPress={() => navigation.navigate("AppSignUp")}>
            <Text style={styles.signUpTexto}>Sign up</Text>
          </TouchableOpacity>
  
        </View>
        
        
  
        <TouchableOpacity
          style={styles.botaoLogin}
          onPress={handleSignIn}
        >
          <Text
            style={styles.botaoLoginTexto}
          >
            Login
          </Text>
        </TouchableOpacity>
  
      </View>
    )
  }

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loading:{
    marginTop: 425,
  },
  titulo: {
    alignSelf: 'center',
    marginTop: 40,
  },
  tituloTexto: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#F6313E',
  },
  imagemLogin: {
    alignSelf: 'center',
    marginTop: 40,
  },
  login: {
    marginTop: 40,
    marginLeft: 20,
  },
  loginTexto: {
    fontSize: 28,
    color: '#1A2E35'
  },
  loginForm: {
    alignSelf: 'center',
    width: 370,
    height: 80,
    marginTop: 20,
  },
  loginInput: {
    fontSize: 16,
    padding: 5,
    paddingLeft: 10,
    marginBottom: 5,
    marginTop: 10,
    height: 45,
  },
  labelError: {
    alignSelf: 'flex-start',
    color: '#FF375B',
    marginBottom: 8,
  },
  account: {
    alignSelf: 'center',
    marginLeft: -50,
    marginTop: 10,
  },
  accountTexto: {
    fontSize: 13,
    color: '#8A8080',
  },
  signUp: {
    alignSelf: 'center',
    marginLeft: 137,
    marginTop: -18.5,
  },
  signUpTexto: {
    color: '#F6313E',
    fontSize: 13,
  },
  botaoLogin: {
    alignSelf: 'center',
    width: 300,
    height: 44,
    backgroundColor: '#F6313E',
    borderRadius: 15,
    marginTop: 190,
  },
  botaoLoginTexto: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 9,
  }
});
