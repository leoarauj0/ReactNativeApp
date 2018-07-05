import { create } from 'apisauce';
import { AsyncStorage } from 'react-native';

const api = create({
    baseURL: 'http://192.168.0.21:3001',
});

api.addAsyncRequestTransform( request => async () => {
    const token = 
        await AsyncStorage.getItem('@mobile:token');
        

    if (token)
        request.headers['autorizacao'] = `Bearer ${token}`;
            
});

api.addResponseTransform(response => { 
    if (!response.ok) throw response;
 });

export default api;