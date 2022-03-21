import styles from './css/Nav.module.css'
import { useState } from 'react';


export default function Nav(props){
    
    const [open_nav, setOpen] = useState(0);
    
    return(
        
            
        <>

        {!open_nav ? <div onClick={() => setOpen(!open_nav)} className={styles.open_nav}>
            <span></span>
            <span></span>
            <span></span>
        </div> : null}
        
        
        <div className={ `${styles.nav} ${open_nav ? styles.responsive_nav : null}`}>

             
            <div onClick={() => setOpen(!open_nav)} className={styles.mobile_btn} >
            <span>X</span>
            </div>
            
           
            
        
        

            <div className={styles.overlay_background}></div>
            <h3 className={styles.brand}>Rick & Morty</h3>

            <hr className={styles.divider} />
           <ul className={styles.items_nav}>

               <div onClick={() => props.setPagina("Personaggi")} className={`   ${styles.container_item}  ${props.pagina_attiva == "Personaggi" ?  styles.active : null}   `}>
                <li><img className={styles.icons} src="personaggi.png" alt="dashboard" />Personaggi</li>
                </div>

                <div onClick={() => props.setPagina("Preferiti")} className={`   ${styles.container_item}  ${props.pagina_attiva == "Preferiti" ? styles.active : null}   `}>
                <li><img className={styles.icons} src="preferiti.png" alt="preferiti" />Preferiti</li>
                </div>
           </ul>
        </div>
        </>
    )
}