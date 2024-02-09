import { Play } from "phosphor-react"
import { HomeContainer, FormContainer, 
        CountdownContainer, Separator, StartCountdownButton, 
        TaskInput, MinutesAmountInput } from "./styles"	
import { useForm } from "react-hook-form"

export function Home(){

    const { register, handleSubmit, watch } = useForm();

    function handleCreateNewCycle(data: any){
        console.log(data);
    }

    const task = watch("task");

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
                    {...register("task")}
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
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownButton type="submit" disabled={!task}>
                    <Play size={24} />
                    Começar
                </StartCountdownButton>

            </form>

        </HomeContainer>
    )
}