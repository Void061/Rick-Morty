import styles from './css/Lista.module.css'
import axios from 'axios'
import { useState } from 'react';
export default function Lista(props){

        const [personaggi, setPersonaggi] = useState(props.personaggi.results);
        
       
       
        const [personaggio_corrente, setCorrente] = useState(props.personaggi.results);


        //Search personaggi con filtri
        const [Nome, setNome] = useState("");
        const [Status, setStatus] = useState("");
        const [Species, setSpecies] = useState("");
        const [Type, setType] = useState("");
        const [Gender, setGender] = useState("");
        
        //Nomi degli episodi
        const [nomi_episodi, setNomiEp] = useState([]);
        
        //Stato del modal, nascosto o visibile
        const [modal_display, setModal] = useState(0);

        
        const [preferiti_info, setPrefInfos] = useState();



       
        
        
        
        


        //Paginazione principale
        //NOTE: La paginazione poteva essere fatta con componenti di material UI o react-pag
        //Tuttavia ho scelto di farla manualmente, in quanto sull'esercizio sono valutati compiti svolti
        //Senza l'ausilio di librerie esterne
        //Utilizzando le librerie questo codice poteva avere molte meno righe
        //Numero di pagine totali (indici)
        const [n_pagine, setNpagine] = useState(props.n_pagine);
        let totale_pagine = [];

        //Pagina iniziale, servirà alla visualizzazione degli indici da 1 a 5, da 2 a 6 etc...
        const [start_page, setStartPage] = useState(1);

        //Contatore pagine
        let count = 0;

        //Serve a capire la pagina attuale, l'indice su cui ci troviamo
        const [current_page, setCurrentP] = useState(1);

        

        //Metto il totale delle pagine dentro un array così da poterlo iterare
        //Metto dentro l'array da 1 a n_pagine +1 (42 attualmente fornite dall'api)
        for(let i = start_page; i < n_pagine +1 ; i ++){
            totale_pagine.push(i);
        }

        
        


   
/* MODAL CON LE INFO DEL PERSONAGGIO SELEZIONATO */
    function ShowCharacterInfos(id){
        let new_ep = [];
        axios.get('https://rickandmortyapi.com/api/character/'+id).then(function(resp){
            setCorrente(resp.data);

            //prendo i nomi degli episodi in cui compare
            resp.data.episode.map(function(item, index){
               
                axios.get(item).then(function(resp){
                    
                    //Metto tutto dentro l'array dei nuovi episodi da inserire
                    new_ep.push(resp.data.name)
                    //Pusho tutto sull'array all'interno dell'hook
                    setNomiEp(nomi_episodi => [...new_ep]);
                    
                })
            
            })

           
          
            setModal(1);
        }).catch(function(error){alert('Errore nel recupero del personaggio')})
        
    }
    function closeModal(){
        setModal(0);
    }
/*********************************************** */

    /* RICERCA CON FILTRI */
    //Setta il nome all'interno dell'hook
    function handleNome(e){setNome(e.target.value);}
    //Setta lo stato del personaggio (vivo, morto etc)
    function handleStatus(e){setStatus(e.target.value);}
    //Genere personaggio
    function handleGender(e){setGender(e.target.value);}
    //Specie personaggio
    function handleSpecies(e){setSpecies(e.target.value);}
    //Tipo personaggio
    function handleType(e){setType(e.target.value);}
    function handleSearch(){
        
        
        axios.get('https://rickandmortyapi.com/api/character/?name='+Nome+'&status='+Status+'&gender='+Gender+'&species='+Species+'&type='+Type).then(function(resp){
            setPersonaggi(resp.data.results);
            setNpagine(resp.data.info.pages);
            setStartPage(1);
            for(let i = start_page; i < n_pagine +1 ; i ++){
                totale_pagine.push(i);
            }
            setCurrentP(1);
         
            
        }).catch(function(error){alert('Nessun personaggio corrisponde al tuo criterio di ricerca')})
    }
    /******/

   
    function handlePreferiti(item){

        //Metto l'id dentro l'array globale dei preferiti
        props.setPreferiti(item.id)

        //Separo gli indici con i comma , in quanto l'api vuole questo tipo di separazione
        let search_filter = props.preferiti.join();
        
        //RICHIAMO L'API CON GLI ID
        axios.get("https://rickandmortyapi.com/api/character/"+search_filter).then(function(resp){

        //SALVO I DATI DENTRO L'OGGETTO LOCALE
        setPrefInfos(resp.data);
        
        }).catch(function(err){})

    }


    //funzione per tornare dietro di indici
    function setBackIndex(id){
      GetPersonaggi(id);
        setStartPage(start_page -4);
        setCurrentP(id);    
    }


    //Funzione per andare avanti di indici
    function setNextIndex(item){
       GetPersonaggi(item);
        setCurrentP(item);
        setStartPage(item);
    }

    //Detecta l'ultimo indice (in questo caso 42)
    function detectLastIndex(id){
        GetPersonaggi(id)
        setCurrentP(id);
        setStartPage(id -4);
    }

    //Selezione degli indici di mezzo
    function setCurrentIndex(item){
       GetPersonaggi(item);
        setCurrentP(item)
    }

    //Funzione generica che fa il get dei personaggi, con l'id dell'indice seguendo anche i parametri di ricerca 
    function GetPersonaggi(id){
        axios.get('https://rickandmortyapi.com/api/character/?page='+id+'&name='+Nome+'&status='+Status+'&gender='+Gender+'&species='+Species+'&type='+Type).then(function(resp){
            setPersonaggi(resp.data.results);
        })
    }
    

    return(
        
        <div className={styles.main}>
            {props.pagina_attiva == "Personaggi" ?  <form className={styles.search_container}>
                <input type="text" placeholder="Nome del personaggio" onChange={handleNome} placeholder="Cerca personaggio" />
                {/* STATO DEL PERSONAGGIO */}
                <select onChange={handleStatus}>
                    <option value="">Stato del personaggio</option>
                    <option value="alive">Alive</option>
                    <option value="dead">Dead</option>
                    <option value="unknown">Unknown</option>
                </select>

                {/* GENERE */ }
                <select onChange={handleGender}>
                    <option value="">Genere del personaggio</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="genderless">Genderless</option>
                    <option value="unknown">Unknown</option>
                </select>
                {/* SPECIE */}
                <input type="text" placeholder="Specie personaggio, es: Human, Alien" onChange={handleSpecies}/>
                {/* TIPO */}
                <input type="text" placeholder="Tipo personaggio, es: fish" onChange={handleType}/>
                <button type="button" onClick={() => handleSearch()}>Search</button>
            </form> : null}
           

           
         
            {props.pagina_attiva == "Personaggi" ? 

           
            <ul className={styles.paging_n}>

                {
                 //Torna dietro alla prima pagina velocemente, questa shortcut appare quando la pagina principale
                 //è diversa dalla numero 1
                start_page != 1  ? <><li onClick={() => setNextIndex(1)}>1</li><li className={styles.index_dots}>...</li></> : null
                }

                {
                    
                   totale_pagine.map(function(item, index){

                    
                     //Per stamparne solo 5
                     count += 1;

                     //Se il counter è maggiore di 5 significa che non deve più stampare indici
                     if(count > 5){ null}

                     //Al contrario significa che deve stampare gli indici
                     else{

                        if(count == 1 && start_page - 4 > -1){
                            return(
                                <li key={index} className={current_page == item ? styles.current_index : null} onClick={() => setBackIndex(item)}>{item}</li>
                            )
                        }

                        else{
                       
                            if(count == 5 && item <= n_pagine -4 ){
                                return(
                                    <li key={index} className={current_page == item ? styles.current_index : null} onClick={() => setNextIndex(item)}>{item}</li>
                                )
                            }
                            else{
                                
                        return(
                           <li key={index} onClick={() => setCurrentIndex(item)} className={current_page == item ? styles.current_index : null}>{item}</li>
                       )
                        }
                        }

                       }
                       
                      
                   })
                   
                   
                }
                
                
                {
                    //Stampo solo 5 indici la volta, se la pagina iniziale è diversa dal numero totale(42 - 4 = 38)
                    // Allora stampa l'indice finale, altrimenti non serve in quanto significa che è già visualizzato
                    //Dal .map
                start_page != n_pagine - 4 && n_pagine > 4 ? <><li className={styles.index_dots}>...</li><li onClick={() => detectLastIndex(n_pagine)}>{n_pagine}</li></> : null
                }
                
            </ul>
                : null}

           
        <div className={styles.container_characters}>

        


            
     
        
        {props.pagina_attiva == "Personaggi" ? StampaPersonaggi(personaggi, props, ShowCharacterInfos, handlePreferiti) : StampaPreferiti(preferiti_info,props, ShowCharacterInfos, handlePreferiti)}
        

      

        
            
        </div>


    

        {!modal_display? null :
        <>
        <div className={styles.overlay }></div>

        
        <div className={styles.wrapper_fixed}>
       
           
            <div className={styles.modal_character}>
            <button type="button" onClick={closeModal} className={styles.close_modal_btn}>Chiudi</button>




            <button type="button" onClick={() => handlePreferiti(personaggio_corrente)} className={props.preferiti.includes(personaggio_corrente.id) ? styles.btn_pref_remove : styles.add_pref_btn}>{props.preferiti.includes(personaggio_corrente.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}</button>
            
                
                
                <div className={styles.header_modal}><img src={personaggio_corrente.image} alt="current_character" /></div>
                
                <ul>
                    <p>Name: {personaggio_corrente.name}</p>
                    <li key="Status">Status: {personaggio_corrente.status}</li>
                    <li key="Gender">Gender: {personaggio_corrente.gender}</li>
                    <li key="Species">Species: {personaggio_corrente.species}</li>
                    <li key="Origin">Origin: {personaggio_corrente.origin.name}</li>
                    <p>Compare in:</p>
                    { nomi_episodi.map(function(item, index){
                        return(<li key={index}>{item}</li>)
                    })}
                </ul>
            </div>
        </div>
        </>
}

        
        

        

        </div>
    )
}



//Template per la stampa dei personaggi generali
function StampaPersonaggi(personaggi, props, ShowCharacterInfos, handlePreferiti){
return(
    personaggi.map(function(item, index){
        return(
            <div key={index} className={styles.single_character}>
            <div className={styles.header_character}><img onClick={ () => ShowCharacterInfos(item.id)} src={item.image} /></div>
            <div className={styles.content_character}><p onClick={ () => ShowCharacterInfos(item.id)} className={styles.name_character}>{item.name}</p></div>
            <button onClick={/*props.setPreferiti(item.id)*/ () => handlePreferiti(item)} className={`   ${styles.button_preferito}  ${props.preferiti.includes(item.id) ? styles.btn_pref_active : null }   `}><img src="preferiti.png" alt="prefer"/></button>
        </div>
        )
    })
) 
}

//Template per la stampa dei preferiti
 function StampaPreferiti(preferiti_info,props, ShowCharacterInfos, handlePreferiti){

    
    //Se l'oggetto non è definito non è mai stato aggiunto un personaggio alla lista dei preferiti
    if(preferiti_info == undefined){return(<h1 className={styles.preferiti_text}>Non hai mai aggiunto personaggi ai preferiti =(</h1>)}

    else{
        //La lista esiste, tuttavia è vuota
        if(preferiti_info.info != undefined){return(<h1 className={styles.preferiti_text}>Lista vuota</h1>)}

        
        else{

            //Se non ci sono array dentro l'oggetto, è probabile che sia solo un elemento, lo stampo direttamente
            if(preferiti_info[0] == undefined){
                return(
                    
                    <div className={styles.single_character}>
                        <div className={styles.header_character}><img onClick={ () => ShowCharacterInfos(preferiti_info.id)} src={preferiti_info.image} /></div>
                        <div className={styles.content_character}><p onClick={ () => ShowCharacterInfos(preferiti_info.id)} className={styles.name_character}>{preferiti_info.name}</p></div>
                        <button onClick={/*props.setPreferiti(item.id)*/ () => handlePreferiti(preferiti_info)} className={`   ${styles.button_preferito}  ${props.preferiti.includes(preferiti_info.id) ? styles.btn_pref_active : null }   `}><img src="preferiti.png" alt="prefer"/></button>
                    </div>
                )
            }
            //Altrimenti significa che ci sono più elementi dentro
            else{
            return(
            <>
                {preferiti_info.map(function(item,index){
                   return( 
                       <>
                        <div key={index} className={styles.single_character}>
                        <div className={styles.header_character}><img onClick={ () => ShowCharacterInfos(item.id)} src={item.image} /></div>
                        <div className={styles.content_character}><p onClick={ () => ShowCharacterInfos(item.id)} className={styles.name_character}>{item.name}</p></div>
                        <button onClick={/*props.setPreferiti(item.id)*/ () => handlePreferiti(item)} className={`   ${styles.button_preferito}  ${props.preferiti.includes(item.id) ? styles.btn_pref_active : null }   `}><img src="preferiti.png" alt="prefer"/></button>
                    </div>
                       </>
                   )
                })}
            </>
            )
            }
        }
    }

    
    
}


