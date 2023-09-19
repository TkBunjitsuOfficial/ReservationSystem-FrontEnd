import { FormControl, Input, InputLabel, Select, MenuItem, Typography, FormHelperText } from '@mui/material'
import { UseFormRegister } from 'react-hook-form'
import React from 'react'
import '../css/QuestionBox.css'

interface InputBoxProps {
	label: string,
	id: string,
	register: any,
	required: boolean,
	pattern?: RegExp,
	className?: string,
	error?: boolean,
	errorMessage?: string
};

export const InputBox: React.FC<InputBoxProps> = (props: InputBoxProps) => {
	return (
		<div className={`question-box input-box ${props.className}`}>
			<FormControl required={props.required} error={props.error}>
				<InputLabel>{props.label}</InputLabel>
				<Input id={props.id} {...props.register(props.id, { required: props.required, pattern: props.pattern || /.+/ })} />
				{
					props.error ? <FormHelperText disabled={!props.error}>{props.errorMessage || "入力してください"}</FormHelperText> : <></>
				}
			</FormControl>
		</div>
	);
}


interface SelectBoxProps {
	label: string,
	id: string,
	register: UseFormRegister<any>,
	candidates: string[],
	required: boolean,
	require_available?: boolean
	available?: boolean[],
	className?: string,
	error?: boolean
}

export const SelectBox: React.FC<SelectBoxProps> = (props: SelectBoxProps) => {
	return (
		<div className={`question-box select-box ${props.className}`} >
			<FormControl required={props.required} error={props.error}>
				<InputLabel>{props.label}</InputLabel>
				<Select id={props.id} defaultValue={""} {...props.register(props.id, { required: props.required })}>
					{
						props.candidates.map((v, i): [string, number] => {
							if (props.available == undefined) {
								if (props.require_available != true) return [v, i];
							}
							else if (props.available[i] == true) {
								return [v, i];
							}
							return ["", -1];
						}).filter(v => {
							return v[1] != -1;
						}).map(v =>
							<MenuItem value={v[1]} key={v[0]}>
								<Typography>{v[0]}</Typography>
							</MenuItem>
						)
					}
				</Select>
				{
					props.error ? <FormHelperText disabled={!props.error}>選択してください</FormHelperText> : <></>
				}
			</FormControl>
		</div >
	)
}