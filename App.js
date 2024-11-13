

import React,{useState, useEffect} from 'react';
import { Text, TextInput, SafeAreaView, StyleSheet, ScrollView, View, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Task from './components/Task';


export default function App() {

  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

    {/*
    useEffect(() => {
      AsyncStorage.clear();
    }, []);//for testing only...remove after

    */}

   //Load tasks from AsyncStorage on app start
   useEffect(() => {
     loadTasks();
     console.log("taskItems array loaded...");
   }, []);

   const loadTasks = async () => {
     try{
      const storedTasks = await AsyncStorage.getItem('tasks');
      if(storedTasks !== null){
        setTaskItems(JSON.parse(storedTasks));
      }

     }catch(error){
       console.error(error);
     }
   };

   const saveTasks = async (taskItems) => {
     try{
       await AsyncStorage.setItem('tasks', JSON.stringify(taskItems))
       console.log("tasks saved to AsyncStorage...");
     }catch(error){
       console.error(error)
     }
   };

   //const deleteTasks();
  const handleAddTask = () => {
   // Keyboard.dismiss();
    //const newTasks = Array.isArray(taskItems) ? [task, ...taskItems] : [task];
    Keyboard.dismiss();
    const newTasks = Array.isArray(taskItems) ? [task, ...taskItems] : [task];
    const newTaskitems = [task, ...taskItems]; // add task to the array hence latest item top
    setTaskItems(newTasks); //update state with new tasks
    setTask(''); //clear input
    saveTasks(); //save tasks to AsyncStorage
    //console.log(task);
  }

  const deleteTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1); // Remove the task from the list
    setTaskItems(itemsCopy); // Update the state with the new list

    // Save the updated list to AsyncStorage after deleting the task
    saveTasks(itemsCopy); 
    
  }

  return (
    <View style={styles.container}>
        <View style={styles.taskswrapper}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          <Text style={styles.reminderText}></Text>
        </View>
      

        <View style={styles.items}>
          {
            taskItems.map((item, index) => {
              return(
                <TouchableOpacity  key={index} onPress={() => {deleteTask(index)}}>
                  <Task text={item}/>
                </TouchableOpacity>
              )
            })
          } 
        </View>


        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}     style={styles.writeTaskWrapper}>
          <TextInput style={styles.input} placeholder={"Type tasks"} onChangeText = {text => setTask(text)} value={task}/>
            <TouchableOpacity onPress={() => handleAddTask()} >
              <View style={styles.addWrapperText}>
                <Text>+</Text>
              </View>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    </View>  

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    backgroundColor: '#E8EAED',
    textAlign: "center",
    padding: 8,
    //fontSize:30
    paddingTop: 80,
    paddingHorizontal:20
  },
  sectionTitle: {
    color: '#00973c',
    fontSize: 24,
    textAlign: 'center'
  },

  reminderText:{
    fontSize:10,
    textAlign:'center'
  },

  input:{ 
    paddingVertical:15,
    paddingHorizontal:15,
    backgroundColor:"#FFF",
    borderRadius:50,
    borderColor:"#C0C0C0",
    borderWidth: 1,
    width: 250
  },

  taskswrapper: {
    /* j */
  },

  items: {
    marginTop: 30
  },

  writeTaskWrapper: {
    position:'absolute',
    bottom:60,
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal:10,
  
  },

  addWrapperText: {
    width:60,
    height:60,
    backgroundColor: "#FFF",
    borderRadius:60,
    justifyContent: "center",
    alignItems:"center",
    borderColor: "#C0C0C0",
    borderWidth:2
  }
  
});



