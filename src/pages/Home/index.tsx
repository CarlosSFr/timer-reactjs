import { Play } from "phosphor-react"
import { HomeContainer, FormContainer, 
        CountdownContainer, Separator, StartCountdownButton, 
        TaskInput, MinutesAmountInput } from "./styles"	
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from "react"
import { differenceInSeconds } from "date-fns"

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

    interface Cycle{
        id: string,
        task: string,
        minutesAmount: number,
        startDate: Date,
    }

export function Home(){

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0
        }
    }); // o useForm é um hook do react-hook-form que retorna um objeto com 
        // várias funções e propriedades que podemos usar para criar um formulário

    const [ cycles, setCycles ] = useState<Cycle[]>([]);
    const [ activeCycleId , setActiveCycleId ] = useState<string | null>(null);
    const [ amountSecondsPassed, setAmountSecondsPassed ] = useState(0);

    function handleCreateNewCycle(data: NewCycleFormData){
        const newCycle: Cycle = {
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

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    useEffect(() => {
        let interval: number;

        if(activeCycle){
            interval = setInterval(() => {
                setAmountSecondsPassed(
                    differenceInSeconds(new Date(), activeCycle.startDate)
                )
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }

    }, [activeCycle])

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 // pegando o total de segundos passados a partir do minutesAmount
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0 // pegando o total de segundos menos os segundos passados

    const minutesAmount = Math.floor(currentSeconds / 60) // divide o valor do segundos passados por 60 para encontrar os minutos passados
    const secondsAmount = currentSeconds % 60 // pega o resto da divisão para encontrar os segundos passados por minuto

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    const task = watch("task");

    useEffect(() => {
        if(activeCycle){
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    return (
        <HomeContainer>

            <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                    type="text" 
                    id="task" 
                    placeholder="Dê um nome para o seu projeto"
                    list="task-suggestions"
                    {...register("task")}   // o register é uma função que registra um input
                                            // ajudando no monitoramento do input
                    />
                    <datalist id="task-suggestions">
                        <option value="Estudo" />
                        <option value="Projeto" />
                        <option value="Trabalho" />
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput 
                    type="number" 
                    id="minutesAmount"
                    placeholder="00"
                    step={5}
                    min={5}
                    max={60}
                    {...register("minutesAmount" , {valueAsNumber: true})}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                <StartCountdownButton type="submit" disabled={!task}>
                    <Play size={24} />
                    Começar
                </StartCountdownButton>

            </form>

        </HomeContainer>
    )
}