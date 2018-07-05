import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  Alert
} from 'react-native';

import api from './services/api';


export default class App extends Component {

  state = {
    UsuarioLogado: null,
    errorMessage: null,
    projects: []

  };

  signIn = async () => { 
    
    try{
      const response = await api.post( api.getBaseURL() + '/auth/autenticacao', {
       
        email: "leo@stars.com",
        password: "leo123"
  
      });

      const { user, token } = response.data;
  
      
      await AsyncStorage.multiSet([
        ['@mobile:token', token],
        ['@mobile:user', JSON.stringify(user)],
      ]);

      this.setState ( {UsuarioLogado: user} );
      
      Alert.alert('Login com sucesso!');

    } catch (response) {
      Alert.alert('Falha no seu login!');
      
      this.setState({ errorMessage: response.data.error }); 
    }
  };

  getProjetosList = async () => {
    try{
      const response = await api.get( api.getBaseURL() + '/projetos');

      const { projects } = response.data;

      this.setState({ projects });
    }catch (response) {
      this.setState({errorMessage: response.data.error});
    }
  };

  async componentDidMount(){
    const token = await AsyncStorage.getItem('@mobile:token');

    const user = JSON.parse(await AsyncStorage.getItem('@mobile:user'));

    if(token && user)
    this.setState({ UsuarioLogado: user});
  }


  render() {
    return (
      <View style={styles.container}>
               
        { !!this.state.UsuarioLogado && <Text>Olá, { this.state.UsuarioLogado.name }!</Text>}
      
        { this.state.UsuarioLogado 
            ? <Button
                onPress={this.getProjetosList}
                title="Carregar" 
              /> 
            : <Button 
                onPress={this.signIn} 
                title="Entrar" 
              />
        }
        
        { !!this.state.errorMessage && <Text>{ this.state.errorMessage }</Text>}
      
        { this.state.projects.map(projeto =>(
          <View key={projeto._id} style={{marginTop: 15}}>
            <Text style={{ fontWeight: 'bold' }}>{ projeto.titulo }</Text>
            <Text> {projeto.descricao }</Text>
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
