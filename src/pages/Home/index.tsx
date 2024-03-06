import { HandPalm, Play } from "phosphor-react"
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles"	
import { FormProvider, useForm } from "react-hook-form"
import { useContext } from "react"
import { NewCycleForm } from "./components/NewCycleForm"
import { Countdown } from "./components/Countdown"
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CyclesContext } from "../../contexts/CyclesContext"

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

// export const CyclesContext = createContext({} as CyclesContextType)

export function Home(){
    const { createNewCycle, interruptCurrentCycle, activeCycle } = useContext(CyclesContext)

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

    const task = watch("task");

    function handleCreateNewCycle(data: NewCycleFormData){
        createNewCycle(data)
        reset()
    }

    return (
        <HomeContainer>

            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>

                    <FormProvider {...newCycleForm} >
                        <NewCycleForm />
                    </FormProvider>
                    <Countdown />
        
                {activeCycle ? (
                    <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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