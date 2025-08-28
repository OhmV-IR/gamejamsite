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
                                    {days}d, {hours}h, {minutes}m, {seconds}s until event end
                                </h1>
                            )
                            } else {
                                return <h1 className={styles.countdowntext}>Event ended</h1>
                            }
                        }}></Countdown>
                    )
                } else {
                    return (
                        <h1 className={styles.countdowntext}>
                            {days}d, {hours}h, {minutes}m, {seconds}s until event start
                        </h1>
                    )
                }
            }}/>
        </div>
    )
}