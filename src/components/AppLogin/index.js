import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';

const schema = yup.object({
  email: yup.string().required("Enter your email address"),
  password: yup.string().required("Enter your password")
})

export default function AppLogin({navigation}) {

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [items, setItems] = useState([]);
  const [email, setEmailUsuario] = useState('');
  const [senha, setSenhaUsuario] = useState('');

  function emailUsuarioChanged(email){
    setEmailUsuario(email)
  }

  function senhaUsuarioChanged(senha){
    setSenhaUsuario(senha)       
  }

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
  },[items]);
  

  function handleSignIn() {
    navigation.replace('AppMainScreen')
  }

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
          name="email"
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
              onChangeText={emailUsuarioChanged}
              onBlur={onBlur}
              value={value}
              placeholder="Enter your email"
              textContentType="emailAddress"
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
              textContentType="password"
              autoCapitalize="none"
              secureTextEntry={true}
            />
          )}
        />
        {errors.password && <Text style={styles.labelError}>{errors.password?.message}</Text>}

        <View style={styles.account}>
        <Text style={styles.accountTexto}>Don't have an account?</Text>
        </View>
        <TouchableOpacity style={styles.signUp} onPress={() => navigation.navigate("AppSignUp")}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
