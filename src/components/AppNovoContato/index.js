import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from "react";
import api from "../service";

const schema = yup.object({
    name: yup.string().required("Enter your full name"),
    username: yup.string().required("Create a username"),
    email: yup.string().email().required("Enter your email"),
    password: yup.string().required("Create a password"),
    copassword: yup.string().required("Confirm your password"),
    phone: yup.string().required("Enter your phone number"),
})

export default function AppNovoContato({navigation}){

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const [fotoUsuario, setFoto] = useState('');
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [emailUsuario, setEmailUsuario] = useState('');
    const [telefoneUsuario, setTelefoneUsuario] = useState('');
    const [usuario, setUsuario] = useState('');
    const [senhaUsuario, setSenhaUsuario] = useState('');

    function nomeUsuarioChanged(nomeUsuario){
        setNomeUsuario(nomeUsuario)
    }

    function emailUsuarioChanged(emailUsuario){
        setEmailUsuario(emailUsuario)
    }

    function telefoneUsuarioChanged(telefoneUsuario){
        setTelefoneUsuario(telefoneUsuario)
    }

    function usuarioChanged(usuario){
        setUsuario(usuario)
    }

    useEffect(async () => {
        if(Platform.OS !== 'web'){
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if( status !== 'granted'){
                alert('Permission denied!')
            }
        }
    },[])
    
      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: true,
          allowsEditing: true,
          aspect: [4,3],
          quality: 0.5,
      });
    
        console.log(result);
    
        if(!result.canceled){
          setFoto(result.base64);
        }
      };  

      
      async function postUser() {
        const response = await api.post('http://192.168.0.184:8080/user/',{
            nome: nomeUsuario,
            avatar: fotoUsuario,
            senha: senhaUsuario,
            email: emailUsuario,
            telefone: telefoneUsuario
        })
        .then(function(response){
            console.log("Criado com sucesso");
        })
        .catch(function(error){
            console.log("Erro ao criar");
        })
      };

      async function btnSalvar(){
        postUser();
        navigation.navigate("AppMainScreen");
      }

    return (
        <View style={styles.container}>

            <View style={styles.titulo}>
                {}
                <Text style={styles.tituloTexto}>New Contact</Text>
            </View>

            <TouchableOpacity
                style={styles.imagemPosicao}
                onPress={pickImage}  
            >
                {fotoUsuario && <Image source={{ uri: `data:image/jpeg;base64,${fotoUsuario}` }} style={{ width: 150, height: 142, borderRadius: 70 }} />}

                <Image 
                    style={styles.imagemBtn} 
                /> 

            </TouchableOpacity>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.signupForm}>
                    
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                            style={[styles.singupInput, {
                                borderWidth: errors.name && 1,
                                borderColor: errors.name && '#FF375B',
                                borderRadius: errors.name && 10,
                                borderWidth: 1,
                                borderColor: '#000000',
                                borderRadius: 5,
                            }]}
                            onChangeText={nomeUsuarioChanged}
                            onBlur={onBlur}
                            value={value}
                            placeholder="Enter your full name"
                            textContentType="text"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                            style={[styles.singupInput, {
                                borderWidth: errors.username && 1,
                                borderColor: errors.username && '#FF375B',
                                borderRadius: errors.username && 10,
                                borderWidth: 1,
                                borderColor: '#000000',
                                borderRadius: 5,
                            }]}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            placeholder="Create a username"
                            textContentType="text"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                            style={[styles.singupInput, {
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
                            />
                        )}
                    />
                    
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                            style={[styles.singupInput, {
                                borderWidth: errors.phone && 1,
                                borderColor: errors.phone && '#FF375B',
                                borderRadius: errors.phone && 10,
                                borderWidth: 1,
                                borderColor: '#000000',
                                borderRadius: 5,
                            }]}
                            onChangeText={telefoneUsuarioChanged}
                            onBlur={onBlur}
                            value={value}
                            placeholder="Enter your phone number"
                            textContentType="phone"
                            />
                        )}
                    />

                </View>
            </KeyboardAvoidingView>
            
            <TouchableOpacity
             style={styles.botaoCreate}
             onPress={btnSalvar}
            >
                <Text style={styles.botaoCreateTexto}>Create</Text>
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
    marginLeft: 20,
    marginTop: 25,
  },
  tituloTexto: {
    fontSize: 28,
    color: '#1A2E35',
  },
  imagemPosicao: {
    width: 150,
    height: 142,
    backgroundColor: '#F6313E',
    borderRadius: 70,
    alignSelf: 'center',
    marginTop: 20
  },
  imagemBtn: {
    alignSelf: 'center',
  },
  signupForm: {
    alignSelf: 'center',
    width: 370,
    height: 80,
    marginTop: 20,
  },
  singupInput: {
    fontSize: 16,
    padding: 5,
    paddingLeft: 10,
    marginBottom: 5,
    marginTop: 15,
    height: 45,
  },
  botaoCreate: {
    alignSelf: 'center',
    width: 300,
    height: 44,
    backgroundColor: '#F6313E',
    borderRadius: 15,
    marginTop: 430,
  },
  botaoCreateTexto: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 9,
  },
  iconeUsuario: {
   
   marginTop: 60,
  }
});
