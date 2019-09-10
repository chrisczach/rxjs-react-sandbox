

export const buttonsOnly = (action?: StopWatchAction) => ({ target }: any) =>
  target.value &&
  [startStop, lap, reset].indexOf(target.value) !== -1 &&
  (!action || target.value === action)

export const toTime = ([_, time]: any) => time

export const toAction = ({ target: { value } }: any) => value

export const togglePause = (acc: boolean): boolean => !acc

export const stopEmitZero = (number: number): boolean => number !== 0

export const incrementTime = (acc: number): number => acc + 1

export const resetHelper = (updateLaps: Function) => (timer: any) => () => {
  updateLaps([])
  return timer
}

export const lapHelper = (updater: Function) => (time: number) =>
  updater((laps: Array<number>) => [...laps, time])

export const [startStop, lap, reset]: Array<StopWatchAction> = [
  'startStop',
  'lap',
  'reset'
]