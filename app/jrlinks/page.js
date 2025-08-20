"use client"
import styles from './page.module.css';

function createLink(text, url) {
    return (
        <p className={styles.answertext}>
            {text}: <a className={styles.link} href={url}>{url}</a>
        </p>
    )
}

export default function JrLinks() {
    return (
        <div>
            <h3 className={styles.page}>This page gives links to every resource we created for the Junior JamBytes workshop.</h3>
            <u1>
                {createLink("Junior Event Schedule", "https://docs.google.com/presentation/d/17_DSEsHY7JEBaIhDok1FzDjsv5lpQ_NFBPSmWLAAKBQ/edit?usp=sharing")}
                {createLink("Scratch Workshop Slideshow", "https://docs.google.com/presentation/d/1qBkYeNdQ0xIVJ5pYLtnzL3-fMNKQ_xNrp_MW-US5pDw/edit?usp=sharing")}
                {createLink("JamBytes Scratch Account", "https://scratch.mit.edu/users/JamBytes_2025/")}
                {createLink("Demo Game Part 1", "https://scratch.mit.edu/projects/1207761020/")}
                {createLink("Demo Game Part 2", "https://scratch.mit.edu/projects/1207770790/")}
                {createLink("Finished Demo Game", "https://scratch.mit.edu/projects/1194750118/")}
                {createLink("Platformer Base Code", "https://scratch.mit.edu/projects/1207081923/")}
                {createLink("PyGame Workshop Slideshow", "https://docs.google.com/presentation/d/1Uh3UaUWNs6GgfPFtWur3N1Kjm28wvbJnk_FnNuck_Gs/edit?usp=sharing")}
                {createLink("Trinket (PyGame)", "https://trinket.io/features/pygame")}
            </u1>
        </div>
    )
}

/*
Junior Event Schedule https://docs.google.com/presentation/d/17_DSEsHY7JEBaIhDok1FzDjsv5lpQ_NFBPSmWLAAKBQ/edit?usp=sharing 
Scratch Workshop Slideshow https://docs.google.com/presentation/d/1qBkYeNdQ0xIVJ5pYLtnzL3-fMNKQ_xNrp_MW-US5pDw/edit?usp=sharing 
JamBytes Scratch Account https://scratch.mit.edu/users/JamBytes_2025/
Demo Game Part 1 https://scratch.mit.edu/projects/1207761020/ 
Demo Game Part 2 https://scratch.mit.edu/projects/1207770790/ 
Finished Demo Game https://scratch.mit.edu/projects/1194750118/ 
Platformer Base Code https://scratch.mit.edu/projects/1207081923/ 
PyGame Workshop Slideshow https://docs.google.com/presentation/d/1Uh3UaUWNs6GgfPFtWur3N1Kjm28wvbJnk_FnNuck_Gs/edit?usp=sharing 
Trinket (PyGame) https://trinket.io/features/pygame 
*/