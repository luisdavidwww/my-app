import React, { useEffect, useContext, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, Keyboard, TextInput, RefreshControl } from 'react-native';
import { useForm } from '../../../hooks/useForm';

import { UserUpdateContext } from '../../../context/UserContext';
import { StackScreenProps } from '@react-navigation/stack';
import { UserStackParams } from '../../../Navegation/UserNavigation';

import { styles } from '../../../theme/LoginRegisterTheme';

//icon
import { MaterialIcons } from '@expo/vector-icons';  



interface Props extends StackScreenProps<UserStackParams, 'EditSurName'>{};


export default function EditName({ navigation, route }: Props) {




  //estado inicial para el pull to refresh
  const [ isRefreshing, setIsRefreshing ] = useState( false );

  //variables de las routas qyue llegan como parámetros
  const { id = '', Surname = '' } = route.params;

  //métodos del contex tipo usuario, cargar usuario por Id
  const { loadUserById, updateUserApellido  } = useContext( UserUpdateContext );

  //variables de apoyo del useForm
  const { apellido, onChange, setFormValue, form } = useForm({
   _id: id,
   apellido: Surname 
  });





  //funciones que se activan al acceder a la pestaña
  useEffect(() => {
    navigation.setOptions({
        title: 'Apellido',
    })
  }, [])

  useEffect(() => {
    loadProductsFromBackend()
  }, [])





  //pull to refresh
  const loadProductsFromBackend = async() => {
    setIsRefreshing(true);
    await loadUserById(id);
    updateUserApellido( id, apellido );
    setIsRefreshing(false);
}




//creación de metodos locales, aqui carga la información de apellido que tenga el usuario
  const loadUser = async() => {
      if ( id.length === 0 ) return;
      const user = await loadUserById( id );
        setFormValue({
          _id: user.uid,
          apellido
           })
        }



  // Metodo para Actualizar el Apellido
  const UpdateApellido = async() => {
    if( apellido.length > 0 ) {            
      await updateUserApellido( id, apellido );
      loadProductsFromBackend();
    }
     else {
    }
}




  return (

    <ScrollView
  refreshControl={
    <RefreshControl 
        refreshing={ isRefreshing }
        onRefresh={ loadProductsFromBackend }
    />
      }
  >
    <View style={styles.containerIndScreen}>
       {/* input de Apellido */}
      <View style={styles.containerfield}>
          <TextInput 
                        placeholder="Ingrese su Apellido"
                        value={ apellido }
                        placeholderTextColor="gray"
                        underlineColorAndroid="#4b58a6"
                        editable
                        maxLength={30}
                        
                        style={styles.input2}

                        selectionColor="#9caae8"

                        onChangeText={ (value) => onChange(value, 'apellido') }
                        onSubmitEditing={ UpdateApellido }

                        autoCapitalize="none"
                        autoCorrect={ false }
                    />
      </View>

      {/* Consejo */}
      <View style={styles.containerConsejo}>
        <View style={styles.containerIcon}>
          <MaterialIcons name="info-outline" size={18} color="black" />
        </View>
        <View style={styles.containerfield}>
          <Text style={styles.consejo} >
            Indícanos tu apellido.
          </Text>
        </View>
      </View>

      {/* btn Guardar Cambios */}
      <View style={styles.containerfield}>


      {Surname === apellido
      ? <>
                  <TouchableOpacity style={{
                        ...styles.buttonDisable, width: '100%'}}
                        disabled={true}
                        >
                     <Text style={{...styles.buttonText,color:'#60605f'}}>Guardar</Text>
                  </TouchableOpacity>
        </>
      : <>
                 <TouchableOpacity style={{
                        ...styles.button, width: '100%'}}
                        onPress={ UpdateApellido }
                        >
                      <Text style={{...styles.buttonText,color:'white'}}>Guardar</Text>  
                 </TouchableOpacity>
      
        </>    
    }

      </View>

        


      <Text> { JSON.stringify( form ).replace(/["']/g, "") }</Text>
    </View>

        
  </ScrollView>
  )
}