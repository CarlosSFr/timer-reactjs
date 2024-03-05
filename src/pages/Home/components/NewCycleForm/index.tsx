import { useFormContext } from "react-hook-form";
import { CyclesContext } from "../..";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useContext } from "react";

export function NewCycleForm(){

    const { activeCycle } = useContext(CyclesContext)
    const { register } = useFormContext()

    return(
        <FormContainer>
            <label htmlFor="task">Vou trabalhar em</label>
            <TaskInput 
            type="text" 
            id="task" 
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            disabled={!!activeCycle}
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
            disabled={!!activeCycle}
            step={5}
            min={5}
            max={60}
            {...register("minutesAmount" , {valueAsNumber: true})}
            />

            <span>minutos.</span>
        </FormContainer>
    )
}