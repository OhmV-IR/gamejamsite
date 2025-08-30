"use client"
import Countdown from 'react-countdown';
import styles from './page.module.css';
import { jamEndTime, jamStartTime } from './lib/jamdetails';
export default function CountdownBar(){
    return (
        <div className={styles.countdownbar}>
            <Countdown date={jamStartTime} renderer={({days, hours, minutes, seconds, completed}) => {
                if(completed){
                    return (
                        <Countdown date={jamEndTime} renderer={({days, hours, minutes, seconds, completed}) => {
                            if(!completed){
                            return (
                                <h1 className={styles.countdowntext}>
                                    Theme: Protect It |
                                    Event End: {days}d, {hours}h, {minutes}m, {seconds}s
                                </h1>
                            )
                            } else {
                                return <h1 className={styles.countdowntext}>Event ended!</h1>
                            }
                        }}></Countdown>
                    )
                } else {
                    return (
                        <h1 className={styles.countdowntext}>
                            Event Start: {days}d, {hours}h, {minutes}m, {seconds}s
                        </h1>
                    )
                }
            }}/>
        </div>
    )
}