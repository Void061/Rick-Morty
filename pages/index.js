import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Nav from '../components/nav'
import Lista from '../components/lista'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
export default function Home(props) {

  //Array che contiene l'id dei preferiti da ricercare
  const [preferiti, setPreferiti] = useState([]);

  //Variabile che contiene la pagina da visualizzare
  const [pagina_attiva, setPagina] = useState("Personaggi");

 
  
//Questa funzione gestisce i preferiti all'interno di un array
  function G_preferiti(id){
    if(preferiti.includes(id)){
      let index = preferiti.indexOf(id);
      let new_ar = preferiti;

      new_ar.splice(index, 1);
      setPreferiti(preferiti => [...new_ar]);
      
    }
    else{
    
      preferiti.push(id);
      setPreferiti(preferiti => [...preferiti]);
      
    }

   
  }


  
  

  return (
   <div className={styles.main}>
     <Nav setPagina={setPagina} pagina_attiva={pagina_attiva} active="Personaggi"/>
     <Lista n_pagine={props.n_pagine} pagina_attiva={pagina_attiva} setPreferiti={G_preferiti} preferiti={preferiti} personaggi={props.personaggi}/>   
   </div>
  )
}


//Get static props per next.js se si volesse esportare il progetto in modalità statica

//Prendo la prima pagina dei personaggi
export async function getStaticProps(context) {
  return(
  axios.get('https://rickandmortyapi.com/api/character/?page=1')
   .then(function(resp){
    
    return {
     props: {
       personaggi: resp.data,
       n_pagine : resp.data.info.pages,
      
     }
   }})
   .catch(function(error){return{
     
   }})
  
  )
}