import { HandPalm, Play } from "phosphor-react"
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles"	
import { FormProvider, useForm } from "react-hook-form"
import { createContext, useState } from "react"
import { NewCycleForm } from "./components/NewCycleForm"
import { Countdown } from "./components/Countdown"
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

    interface Cycle{
        id: string,
        task: string,
        minutesAmount: number,
        startDate: Date,
        interruptedDate?: Date
        finishedDate?: Date
    }

    interface CyclesContextType{
        activeCycle: Cycle | undefined,
        activeCycleId: string | null,
        markCurrentCycleAsFinished: () => void,
        amountSecondsPassed: number,
        setSecondsPassed: (seconds: number) => void,
    }

    const newCycleFormValidationSchema = zod.object({
        task: zod.string().min(1, "Informe a tarefa"),
        minutesAmount: zod.number().min(5).max(60),
    }) // o zod é uma biblioteca que nos permite criar um schema de validação 
       // para os dados do formulário
    
       // interface NewCycleFormData{ 
        //     task: string
        //     minutesAmount: number
        // }
    
        type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export const CyclesContext = createContext({} as CyclesContextType)

export function Home(){

    const [ cycles, setCycles ] = useState<Cycle[]>([]); // cria um array de objetos, que serão os newCycle da aplicação
    const [ activeCycleId , setActiveCycleId ] = useState<string | null>(null); // monitorando o activeCycleId ao atualizar seu valor sempre que entra o ultimo ciclo
    const [ amountSecondsPassed, setAmountSecondsPassed ] = useState(0);

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0
        }
    }); // o useForm é um hook do react-hook-form que retorna um objeto com 
        // várias funções e propriedades que podemos usar para criar um formulário

    const { handleSubmit, watch, reset } = newCycleForm

    // useEffect -> o useEffect permite que uma variável seja monitorada conforme o código é executado.

    // Prop Drilling --> Quando a gente tem MUITAS propriedades APENAS para comunicação entre componentes

    // Context API --> Permite compartilharmos informações entre VÁRIOS componentes ao mesmo tempo

    function handleCreateNewCycle(data: NewCycleFormData){  // Os ciclos nessa aplicação são objetos contendo as informações do ciclo
        const newCycle: Cycle = {                           // Dessa forma, quando um ciclo novo começa, ele recebe um id e um tempo inicial novo para começar o countdown
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((state) => [...state, newCycle])  // quando o valor do estado depende de sua situação anterior
                                                    // é recomendado usar uma função de seta.
        setActiveCycleId(newCycle.id)
        setAmountSecondsPassed(0)

        reset();
    }

    function setSecondsPassed(seconds: number){
        setAmountSecondsPassed(seconds)
    }   

    function markCurrentCycleAsFinished(){
        setCycles((state) =>
                    state.map((cycle) => {
                    if (cycle.id === activeCycleId) {
                        return { ...cycle, finishedDate: new Date() }
                    } else {
                        return cycle
                    }
                    }),
                )
    }

    function handleInterruptCycle(){
        setCycles((state) => 
            state.map((cycle) => {
                if(cycle.id === activeCycleId){
                    return {
                        ...cycle,
                        interruptedDate: new Date()
                    }
                }
                return cycle
            })
        )

        setActiveCycleId(null)
    }

    const task = watch("task");

    return (
        <HomeContainer>

            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>

                <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed }} >
                    <FormProvider {...newCycleForm} >
                        <NewCycleForm />
                    </FormProvider>
                    <Countdown />
                </CyclesContext.Provider>
        
                {activeCycle ? (
                    <StopCountdownButton onClick={handleInterruptCycle} type="button">
                    <HandPalm size={24} />
                    Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton type="submit" disabled={!task}>
                    <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}

            </form>

        </HomeContainer>
    )
}