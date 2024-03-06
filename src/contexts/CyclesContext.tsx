import { ReactNode, createContext, useReducer, useState } from "react";
import { Cycle, cyclesReducer } from '../reducers/cycles/reducers'
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";

interface CreateCycleData{
    task: string
    minutesAmount: number
}

interface CyclesContextType{
    activeCycle: Cycle | undefined,
    activeCycleId: string | null,
    markCurrentCycleAsFinished: () => void,
    amountSecondsPassed: number,
    setSecondsPassed: (seconds: number) => void,
    createNewCycle: (data: CreateCycleData) => void,
    interruptCurrentCycle: () => void,
    cycles: Cycle[],
}

interface CyclesContextProviderProps{
    children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }: CyclesContextProviderProps){

    // const [ cycles, setCycles ] = useState<Cycle[]>([]); // cria um array de objetos, que serão os newCycle da aplicação
    const [ cyclesState, dispatch ] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null
    })

    const { cycles, activeCycleId } = cyclesState

    //const [ activeCycleId , setActiveCycleId ] = useState<string | null>(null); // monitorando o activeCycleId ao atualizar seu valor sempre que entra o ultimo ciclo
    const [ amountSecondsPassed, setAmountSecondsPassed ] = useState(0);

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number){
        setAmountSecondsPassed(seconds)
    } 

    function markCurrentCycleAsFinished(){
        dispatch(markCurrentCycleAsFinishedAction())

    }

    function createNewCycle(data: CreateCycleData){  // Os ciclos nessa aplicação são objetos contendo as informações do ciclo
        const newCycle: Cycle = {                           // Dessa forma, quando um ciclo novo começa, ele recebe um id e um tempo inicial novo para começar o countdown
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle))

        setAmountSecondsPassed(0)
    }

    function interruptCurrentCycle(){
        dispatch(interruptCurrentCycleAction())
    }

    return(
        <CyclesContext.Provider 
            value={{ 
                activeCycle, 
                activeCycleId, 
                markCurrentCycleAsFinished, 
                amountSecondsPassed, 
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle,
                cycles }} >
            {children}
        </CyclesContext.Provider>
    )
}