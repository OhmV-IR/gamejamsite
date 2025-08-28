export const jamStartTime = new Date("2025-08-30T09:00:00-04:00");
export const jamEndTime = new Date("2025-09-01T09:00:00-04:00");
export function IsJamRunning(){
    const curTime = Date.now();
    return curTime > jamStartTime && curTime < jamEndTime;
}